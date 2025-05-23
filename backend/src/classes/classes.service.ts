import { BadRequestException, Inject, Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Class, LectureStatus } from './entities/class.entity';
import { Enrollment } from './entities/enrollment.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { UsersService } from '../users/users.service';
import { RoomsService } from '../rooms/rooms.service';
import { TimeslotsService } from '../timeslots/timeslots.service';
import { Role } from '../users/entities/user.entity';
import { AttendanceStatus } from '../attendance/entities/attendance.entity';
import { AttendanceService } from '../attendance/attendance.service';
import * as qrcode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

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
    @Inject('ATTENDANCE_SERVICE')
    private readonly attendanceService: AttendanceService,
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
    this.logger.log('Fetching all classes with relations');
    try {
      const classes = await this.classesRepository.find({
        relations: ['faculty', 'room', 'timeslot', 'enrollments'],
      });
      this.logger.log(`Found ${classes.length} classes in the database`);
      if (classes.length > 0) {
        this.logger.log('Sample class data:', JSON.stringify(classes[0], null, 2));
      }
      return classes;
    } catch (error) {
      this.logger.error('Error in findAll:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Class> {
    const cls = await this.classesRepository.findOne({ 
      where: { id },
      relations: ['faculty', 'room', 'timeslot', 'enrollments']
    });

    if (!cls) {
      throw new NotFoundException(`Class with ID "${id}" not found`);
    }

    return cls;
  }

  async findByFaculty(facultyId: string): Promise<Class[]> {
    return this.classesRepository.find({
      where: { facultyId },
      relations: ['faculty', 'room', 'timeslot', 'enrollments']
    });
  }

  async findEnrollmentsByClass(classId: string) {
    return this.enrollmentRepository.find({
      where: { classId },
      relations: ['student']
    });
  }

  async deactivateQrCode(classId: string): Promise<void> {
    await this.classesRepository.update(classId, {
      isActive: false,
      currentQrCode: null,
      qrCodeExpiresAt: null
    });
  }

  async findFacultyClasses(facultyId: string): Promise<Class[]> {
    return this.classesRepository.find({
      where: { facultyId },
      relations: ['faculty', 'room', 'timeslot', 'enrollments'],
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
    
    const result = await this.classesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Class with ID "${id}" not found`);
    }
  }

  async generateQrCode(classId: string, durationMinutes: number = 15): Promise<{ qrCode: string; expiresAt: Date }> {
    const cls = await this.findOne(classId);
    
    if (cls.lectureStatus === LectureStatus.IN_PROGRESS) {
      throw new BadRequestException('Lecture is already in progress');
    }

    // Generate QR code
    const qrCodeToken = uuidv4();
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);
    
    // Update class with QR code and status
    await this.classesRepository.update(classId, {
      currentQrCode: qrCodeToken,
      qrCodeExpiresAt: expiresAt,
      lectureStatus: LectureStatus.IN_PROGRESS
    });

    // Generate QR code image
    const qrCode = await qrcode.toDataURL(qrCodeToken);

    return { qrCode, expiresAt };
  }

  async endLecture(classId: string): Promise<void> {
    const cls = await this.findOne(classId);
    
    if (cls.lectureStatus !== LectureStatus.IN_PROGRESS) {
      throw new BadRequestException('No active lecture found');
    }

    // Mark absent for students who didn't attend
    await this.markAbsentForInactiveStudents(classId, new Date());

    // Update class status
    await this.classesRepository.update(classId, {
      currentQrCode: null,
      qrCodeExpiresAt: null,
      lectureStatus: LectureStatus.COMPLETED
    });
  }

  async markAttendanceFromQrCode(token: string, classId: string, email: string) {
    const cls = await this.findOne(classId);
    if (cls.lectureStatus !== LectureStatus.IN_PROGRESS) {
      throw new BadRequestException('No active lecture found');
    }
    if (cls.currentQrCode !== token) {
      throw new BadRequestException('Invalid QR code');
    }
    if (cls.qrCodeExpiresAt && new Date() > cls.qrCodeExpiresAt) {
      throw new BadRequestException('QR code has expired');
    }
    // Find student by email
    const student = await this.usersService.findByEmail(email);
    if (!student) {
      throw new BadRequestException('Student not found');
    }
    // Check if student is enrolled
    const enrollment = await this.enrollmentRepository.findOne({
      where: { studentId: student.id, classId }
    });
    if (!enrollment) {
      throw new BadRequestException('Student is not enrolled in this class');
    }
    // Mark attendance
    const attendanceTime = new Date();
    const isLate = this.isLate(attendanceTime, cls.timeslot);
    // Prevent duplicate attendance
    const existingAttendance = await this.attendanceService.findByStudentAndDate(
      student.id,
      classId,
      attendanceTime
    );
    if (existingAttendance) {
      throw new BadRequestException('Attendance already marked for this lecture.');
    }
    await this.attendanceService.markAttendance({
      studentId: student.id,
      classId,
      status: isLate ? AttendanceStatus.LATE : AttendanceStatus.PRESENT,
      date: attendanceTime
    });
    return { success: true, status: isLate ? 'LATE' : 'PRESENT' };
  }

  private isLate(attendanceTime: Date, timeslot: any): boolean {
    const [hours, minutes] = timeslot.startTime.split(':').map(Number);
    const startTime = new Date();
    startTime.setHours(hours, minutes, 0, 0);
    
    // Consider attendance late if it's more than 15 minutes after start time
    return attendanceTime.getTime() > startTime.getTime() + 15 * 60 * 1000;
  }

  private async markAbsentForInactiveStudents(classId: string, lectureEndTime: Date) {
    const enrollments = await this.enrollmentRepository.find({
      where: { classId },
      relations: ['student']
    });

    const attendancePromises = enrollments.map(enrollment => 
      this.attendanceService.markAttendance({
        studentId: enrollment.studentId,
        classId,
        status: AttendanceStatus.ABSENT,
        date: lectureEndTime
      })
    );

    await Promise.all(attendancePromises);
  }

  async getClassIdFromQrCode(qrCode: string): Promise<string | null> {
    // Find the class that has this QR code and it's not expired
    const classInfo = await this.classesRepository.findOne({
      where: {
        currentQrCode: qrCode,
        qrCodeExpiresAt: MoreThan(new Date())
      },
      select: ['id']
    });
    
    return classInfo?.id || null;
  }

  async markAttendance(classId: string, studentId: string, qrCode: string) {
    const cls = await this.findOne(classId);
    
    // Parse the QR code data (it should be a JSON string with classId, token, and expiresAt)
    let qrCodeData;
    try {
      // The QR code is a data URL, we need to extract the data part
      const qrCodeJson = Buffer.from(qrCode.split(',')[1], 'base64').toString('utf-8');
      qrCodeData = JSON.parse(qrCodeJson);
    } catch (error) {
      throw new BadRequestException('Invalid QR code format');
    }
    
    // Validate the QR code data
    if (!qrCodeData.token || !qrCodeData.expiresAt) {
      throw new BadRequestException('Invalid QR code data');
    }
    
    // Check if the QR code is for this class
    if (qrCodeData.classId !== classId) {
      throw new BadRequestException('This QR code is for a different class');
    }
    
    // Check if the QR code has expired
    const expiresAt = new Date(qrCodeData.expiresAt);
    if (expiresAt < new Date()) {
      // Mark attendance as absent for all students who didn't mark attendance
      await this.markAbsentForInactiveStudents(classId, expiresAt);
      throw new BadRequestException('QR code has expired');
    }
    
    // Verify the token matches the one in the database
    if (cls.currentQrCode !== qrCodeData.token) {
      throw new BadRequestException('Invalid QR code');
    }
    
    // Check if student is enrolled in the class
    const isEnrolled = await this.enrollmentRepository.findOne({
      where: {
        classId,
        studentId
      }
    });
    
    if (!isEnrolled) {
      throw new BadRequestException('You are not enrolled in this class');
    }
    
    // Mark attendance
    await this.attendanceService.markAttendance({
      studentId,
      classId,
      status: AttendanceStatus.PRESENT,
      date: new Date()
    });
    
    return { message: 'Attendance marked successfully' };
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