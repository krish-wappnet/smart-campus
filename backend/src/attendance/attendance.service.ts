import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance, AttendanceStatus } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { ClassesService } from '../classes/classes.service';
import { UsersService } from '../users/users.service';
import { BiometricAttendanceDto } from './dto/biometric-attendance.dto';
import { AttendanceReportDto } from './dto/attendance-report.dto';
import { Role } from '../users/entities/user.entity';

@Injectable()
export class AttendanceService {
  private readonly logger = new Logger(AttendanceService.name);

  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    private readonly classesService: ClassesService,
    private readonly usersService: UsersService,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    // Validate class exists
    await this.classesService.findOne(createAttendanceDto.classId);

    // Validate student exists
    const student = await this.usersService.findOne(createAttendanceDto.studentId);
    if (student.role !== Role.STUDENT) {
      throw new NotFoundException('User is not a student');
    }

    // Check if attendance record already exists for this date and class
    const existingAttendance = await this.attendanceRepository.findOne({
      where: {
        studentId: createAttendanceDto.studentId,
        classId: createAttendanceDto.classId,
        date: createAttendanceDto.date,
      },
    });

    if (existingAttendance) {
      // Update existing record
      existingAttendance.status = createAttendanceDto.status;
      const updatedAttendance = await this.attendanceRepository.save(existingAttendance);
      this.logger.log(`Updated attendance for student ${createAttendanceDto.studentId} in class ${createAttendanceDto.classId}`);
      return updatedAttendance;
    }

    // Create new attendance record
    const attendance = this.attendanceRepository.create(createAttendanceDto);
    const savedAttendance = await this.attendanceRepository.save(attendance);
    this.logger.log(`Recorded attendance for student ${createAttendanceDto.studentId} in class ${createAttendanceDto.classId}`);
    return savedAttendance;
  }

  async recordBiometricAttendance(biometricAttendanceDto: BiometricAttendanceDto): Promise<Attendance> {
    const { studentId, classId, biometricData } = biometricAttendanceDto;

    // Validate class exists
    await this.classesService.findOne(classId);

    // Validate student exists
    const student = await this.usersService.findOne(studentId);
    if (student.role !== Role.STUDENT) {
      throw new NotFoundException('User is not a student');
    }

    // Create attendance record with biometric data
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = this.attendanceRepository.create({
      studentId,
      classId,
      date: today,
      status: AttendanceStatus.PRESENT,
      biometricData,
    });

    const savedAttendance = await this.attendanceRepository.save(attendance);
    this.logger.log(`Recorded biometric attendance for student ${studentId} in class ${classId}`);
    return savedAttendance;
  }

  async findByClass(classId: string, dateStr?: string): Promise<Attendance[]> {
    // Validate class exists
    await this.classesService.findOne(classId);

    const queryBuilder = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.student', 'student')
      .where('attendance.classId = :classId', { classId });

    if (dateStr) {
      const date = new Date(dateStr);
      queryBuilder.andWhere('attendance.date = :date', { date });
    }

    return queryBuilder.getMany();
  }

  async findByStudent(studentId: string): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { studentId },
      relations: ['class'],
    });
  }

  async getAttendanceReports(): Promise<AttendanceReportDto[]> {
    // This is a simplified implementation
    // In a real application, you would use more complex queries to generate reports
    const attendanceData = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.class', 'class')
      .leftJoinAndSelect('attendance.student', 'student')
      .select([
        'class.id as classId',
        'class.name as className',
        'COUNT(attendance.id) as totalRecords',
        'SUM(CASE WHEN attendance.status = :present THEN 1 ELSE 0 END) as presentCount',
        'SUM(CASE WHEN attendance.status = :absent THEN 1 ELSE 0 END) as absentCount',
        'SUM(CASE WHEN attendance.status = :late THEN 1 ELSE 0 END) as lateCount',
      ])
      .setParameters({
        present: AttendanceStatus.PRESENT,
        absent: AttendanceStatus.ABSENT,
        late: AttendanceStatus.LATE,
      })
      .groupBy('class.id')
      .addGroupBy('class.name')
      .getRawMany();

    return attendanceData.map(item => ({
      classId: item.classId,
      className: item.className,
      totalRecords: parseInt(item.totalRecords, 10),
      presentCount: parseInt(item.presentCount, 10),
      absentCount: parseInt(item.absentCount, 10),
      lateCount: parseInt(item.lateCount, 10),
      presentPercentage: (parseInt(item.presentCount, 10) / parseInt(item.totalRecords, 10)) * 100,
    }));
  }

  async markAttendanceForLecture(classId: string, status: AttendanceStatus): Promise<void> {
    // In a real application, this would mark attendance for all students enrolled in the class
    // For this example, we'll use a simplified approach
    const cls = await this.classesService.findOne(classId);
    
    // Get all students (in a real app, you'd get students enrolled in this class)
    const students = await this.usersService.findAll();
    const studentUsers = students.filter(user => user.role === Role.STUDENT);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Create attendance records for all students
    for (const student of studentUsers) {
      await this.create({
        studentId: student.id,
        classId,
        date: today,
        status,
      });
    }
    
    this.logger.log(`Marked ${status} attendance for all students in class ${classId}`);
  }
}