import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AttendanceService } from '../attendance/attendance.service';
import { ClassesService } from '../classes/classes.service';
import { AttendanceStatus } from '../attendance/entities/attendance.entity';

@Injectable()
export class LecturesService {
  private readonly logger = new Logger(LecturesService.name);
  private activeLectures: Set<string> = new Set();

  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly classesService: ClassesService,
  ) {}

  async startLecture(classId: string): Promise<{ message: string }> {
    // Validate class exists
    await this.classesService.findOne(classId);

    // Mark class as active
    this.activeLectures.add(classId);
    this.logger.log(`Started lecture for class ${classId}`);

    // In a real application, you might want to create a lecture record in the database
    return { message: 'Lecture started successfully' };
  }

  async endLecture(classId: string): Promise<{ message: string }> {
    // Validate class exists
    await this.classesService.findOne(classId);

    // Check if lecture is active
    if (!this.activeLectures.has(classId)) {
      throw new NotFoundException('No active lecture found for this class');
    }

    // Mark attendance for all students in the class
    await this.attendanceService.markAttendanceForLecture(classId, AttendanceStatus.PRESENT);

    // Mark class as inactive
    this.activeLectures.delete(classId);
    this.logger.log(`Ended lecture for class ${classId}`);

    return { message: 'Lecture ended and attendance marked successfully' };
  }
}