import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
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
    // In a real application, this would query a student-class enrollment table
    // For this example, we'll return all classes (simplified)
    return this.classesRepository.find({
      relations: ['faculty', 'room', 'timeslot'],
    });
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
    const result = await this.classesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    this.logger.log(`Deleted class: ${id}`);
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