import { BadRequestException, Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { Enrollment } from './entities/enrollment.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { UsersService } from '../users/users.service';
import { RoomsService } from '../rooms/rooms.service';
import { TimeslotsService } from '../timeslots/timeslots.service';
import { Role } from '../users/entities/user.entity';

@Injectable()
export class ClassesService {
  private readonly logger = new Logger(ClassesService.name);

  constructor(
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    private readonly usersService: UsersService,
    private readonly roomsService: RoomsService,
    private readonly timeslotsService: TimeslotsService,
  ) {}

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const { facultyId, roomId, timeslotId } = createClassDto;

    // Validate faculty exists and has faculty role
    const faculty = await this.usersService.findOne(facultyId);
    if (faculty.role !== Role.FACULTY) {
      throw new BadRequestException('User is not a faculty member');
    }

    // Validate room exists
    const room = await this.roomsService.findOne(roomId);
    if (!room) {
      throw new BadRequestException('Room not found');
    }

    // Validate timeslot exists
    const timeslot = await this.timeslotsService.findOne(timeslotId);
    if (!timeslot) {
      throw new BadRequestException('Timeslot not found');
    }

    // Check for conflicts
    await this.checkConflicts(facultyId, roomId, timeslotId);

    // Create class
    const cls = this.classesRepository.create(createClassDto);
    const savedClass = await this.classesRepository.save(cls);
    this.logger.log(`Created new class: ${savedClass.name}`);
    return savedClass;
  }

  async findAll(): Promise<Class[]> {
    return this.classesRepository.find({
      relations: ['faculty', 'room', 'timeslot'],
    });
  }

  async findOne(id: string): Promise<Class> {
    const cls = await this.classesRepository.findOne({
      where: { id },
      relations: ['faculty', 'room', 'timeslot'],
    });
    if (!cls) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    return cls;
  }

  async findFacultyClasses(facultyId: string): Promise<Class[]> {
    return this.classesRepository.find({
      where: { facultyId },
      relations: ['room', 'timeslot'],
    });
  }

  async findStudentClasses(studentId: string): Promise<Class[]> {
    const enrollments = await this.enrollmentRepository.find({
      where: { studentId },
      relations: ['class'],
    });
    
    // Resolve all class promises in parallel
    const classes = await Promise.all(enrollments.map(async (enrollment) => {
      const cls = await enrollment.class;
      // Load additional relations if needed
      await cls.faculty;
      await cls.room;
      await cls.timeslot;
      return cls;
    }));
    
    return classes;
  }

  async enrollStudent(studentId: string, enrollDto: EnrollStudentDto): Promise<Enrollment> {
    // If studentId is provided in the DTO, use it (for admin enrolling a student)
    // Otherwise, use the authenticated student's ID
    const targetStudentId = enrollDto.studentId || studentId;
    
    // Check if the student exists and is actually a student
    const student = await this.usersService.findOne(targetStudentId);
    if (student.role !== Role.STUDENT) {
      throw new BadRequestException('User is not a student');
    }

    // Check if the class exists
    const classToEnroll = await this.classesRepository.findOne({
      where: { id: enrollDto.classId },
    });
    
    if (!classToEnroll) {
      throw new NotFoundException('Class not found');
    }

    // Check if already enrolled
    const existingEnrollment = await this.enrollmentRepository.findOne({
      where: {
        studentId: targetStudentId,
        classId: enrollDto.classId,
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('Student is already enrolled in this class');
    }

    // Create enrollment
    const enrollment = this.enrollmentRepository.create({
      studentId: targetStudentId,
      classId: enrollDto.classId,
    });

    return this.enrollmentRepository.save(enrollment);
  }

  async unenrollStudent(studentId: string, classId: string): Promise<void> {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { studentId, classId },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    await this.enrollmentRepository.remove(enrollment);
  }

  async update(id: string, updateClassDto: UpdateClassDto): Promise<Class> {
    const cls = await this.findOne(id);

    // Check if updating critical fields that could cause conflicts
    if (
      updateClassDto.facultyId ||
      updateClassDto.roomId ||
      updateClassDto.timeslotId
    ) {
      const facultyId = updateClassDto.facultyId || cls.facultyId;
      const roomId = updateClassDto.roomId || cls.roomId;
      const timeslotId = updateClassDto.timeslotId || cls.timeslotId;

      // Validate faculty if changing
      if (updateClassDto.facultyId) {
        const faculty = await this.usersService.findOne(facultyId);
        if (faculty.role !== Role.FACULTY) {
          throw new BadRequestException('User is not a faculty member');
        }
      }

      // Validate room if changing
      if (updateClassDto.roomId) {
        const room = await this.roomsService.findOne(roomId);
        if (!room) {
          throw new BadRequestException('Room not found');
        }
      }

      // Validate timeslot if changing
      if (updateClassDto.timeslotId) {
        const timeslot = await this.timeslotsService.findOne(timeslotId);
        if (!timeslot) {
          throw new BadRequestException('Timeslot not found');
        }
      }

      // Check for conflicts (excluding this class)
      await this.checkConflicts(facultyId, roomId, timeslotId, id);
    }

    // Update class
    Object.assign(cls, updateClassDto);
    const updatedClass = await this.classesRepository.save(cls);
    this.logger.log(`Updated class: ${id}`);
    return updatedClass;
  }

  async remove(id: string): Promise<void> {
    // First delete all enrollments for this class
    await this.enrollmentRepository.delete({ classId: id });
    
    // Then delete the class
    const result = await this.classesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    this.logger.log(`Deleted class with ID: ${id}`);
  }

  private async checkConflicts(
    facultyId: string,
    roomId: string,
    timeslotId: string,
    excludeClassId?: string,
  ): Promise<void> {
    // Build query to check for conflicts
    const queryBuilder = this.classesRepository
      .createQueryBuilder('class')
      .where('class.timeslotId = :timeslotId', { timeslotId })
      .andWhere(
        '(class.facultyId = :facultyId OR class.roomId = :roomId)',
        { facultyId, roomId }
      );

    // Exclude the current class if updating
    if (excludeClassId) {
      queryBuilder.andWhere('class.id != :excludeClassId', { excludeClassId });
    }

    const conflicts = await queryBuilder.getCount();

    if (conflicts > 0) {
      throw new BadRequestException(
        'Conflict detected: Faculty or room already scheduled for this timeslot'
      );
    }
  }
}