import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  HttpStatus,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiQuery, 
  ApiBody,
  ApiParam, 
  ApiProperty,
  ApiOkResponse
} from '@nestjs/swagger';
import { Attendance, AttendanceStatus } from './entities/attendance.entity';
import { BiometricAttendanceDto } from './dto/biometric-attendance.dto';
import { AttendanceReportDto } from './dto/attendance-report.dto';
import { MarkAttendanceDto } from '../classes/dto/mark-attendance.dto';
import { ClassesService } from '../classes/classes.service';
import { UsersService } from '../users/users.service';

export class StartLectureResponse {
  @ApiProperty({ description: 'QR code data URL for attendance' })
  qrCode: string;

  @ApiProperty({ description: 'Expiration timestamp of the QR code' })
  expiresAt: Date;
}

@ApiTags('attendance')
@ApiBearerAuth()
@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly classesService: ClassesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @Roles(Role.FACULTY)
  @ApiOperation({ summary: 'Record attendance manually (by faculty)' })
  @ApiResponse({ status: 201, description: 'Attendance recorded successfully', type: Attendance })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires faculty role' })
  create(@Body() createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Post('biometric')
  @ApiOperation({ summary: 'Record attendance via biometric data' })
  @ApiResponse({ status: 201, description: 'Attendance recorded successfully', type: Attendance })
  @ApiResponse({ status: 400, description: 'Bad request' })
  recordBiometricAttendance(
    @Body() biometricAttendanceDto: BiometricAttendanceDto,
  ): Promise<Attendance> {
    return this.attendanceService.recordBiometricAttendance(biometricAttendanceDto);
  }

  @Get('class/:classId')
  @Roles(Role.FACULTY, Role.ADMIN)
  @ApiOperation({ summary: 'Get attendance records for a class' })
  @ApiResponse({ status: 200, description: 'Return attendance records', type: [Attendance] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires faculty or admin role' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  @ApiQuery({ name: 'date', required: false, type: String, description: 'Filter by date (YYYY-MM-DD)' })
  findByClass(
    @Param('classId') classId: string,
    @Query('date') date?: string,
  ): Promise<Attendance[]> {
    return this.attendanceService.findByClass(classId, date);
  }

  @Get('student')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get attendance records for the current student' })
  @ApiResponse({ status: 200, description: 'Return attendance records', type: [Attendance] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires student role' })
  findStudentAttendance(@Request() req): Promise<Attendance[]> {
    return this.attendanceService.findByStudent(req.user.id);
  }

  @Get('reports')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get attendance reports' })
  @ApiResponse({ status: 200, description: 'Return attendance reports', type: [AttendanceReportDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin role' })
  getAttendanceReports(): Promise<AttendanceReportDto[]> {
    return this.attendanceService.getAttendanceReports();
  }

  @Post('lecture/start')
  @Roles(Role.FACULTY)
  @ApiOperation({ summary: 'Start a lecture and generate QR code for attendance' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Lecture started successfully and QR code generated',
    type: StartLectureResponse
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden - Requires faculty role' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        classId: { type: 'string', description: 'ID of the class to start lecture for' },
        duration: { type: 'number', description: 'Duration of the lecture in minutes (default: 60)' }
      },
      required: ['classId']
    }
  })
  async startLecture(
    @Request() req,
    @Body('classId') classId: string,
    @Body('duration') duration: number = 60
  ): Promise<{ qrCode: string; expiresAt: Date }> {
    if (!classId) {
      throw new BadRequestException('Class ID is required');
    }

    // Verify the requesting faculty is the one assigned to this class
    const classInfo = await this.classesService.findOne(classId);
    if (classInfo.facultyId !== req.user.id) {
      throw new ForbiddenException('You are not authorized to start this lecture');
    }

    return this.classesService.generateQrCode(classId);
  }

  @Post('mark')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Mark attendance using QR code' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Attendance marked successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        status: { type: 'string', enum: ['PRESENT', 'LATE'] },
        class: { 
          type: 'object',
          properties: {
            name: { type: 'string' },
            facultyName: { type: 'string' }
          }
        },
        timestamp: { type: 'string', format: 'date-time' },
        alreadyMarked: { type: 'boolean' }
      },
      required: ['success', 'status', 'class', 'timestamp']
    }
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid QR code or already marked' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden - Requires student role' })
  async markAttendance(
    @Request() req,
    @Body() markAttendanceDto: MarkAttendanceDto,
  ) {
    try {
      // Parse the QR code data
      let qrData;
      try {
        // The QR code is a data URL, we need to extract the data part
        const qrCodeJson = Buffer.from(markAttendanceDto.qrCode.split(',')[1], 'base64').toString('utf-8');
        qrData = JSON.parse(qrCodeJson);
      } catch (error) {
        throw new BadRequestException('Invalid QR code format');
      }

      // Verify the QR code data
      if (!qrData.token || !qrData.classId) {
        throw new BadRequestException('Invalid QR code data');
      }

      // Mark attendance using the new method
      return await this.classesService.markAttendanceFromQrCode(
        qrData.token,
        qrData.classId,
        req.user.id
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to mark attendance');
    }
  }

  @Post('mark/url')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Mark attendance using QR code token from URL' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Attendance marked successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        status: { type: 'string', enum: ['PRESENT', 'LATE'] },
        class: { 
          type: 'object',
          properties: {
            name: { type: 'string' },
            facultyName: { type: 'string' }
          }
        },
        timestamp: { type: 'string', format: 'date-time' },
        alreadyMarked: { type: 'boolean' }
      },
      required: ['success', 'status', 'class', 'timestamp']
    }
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid token or class ID' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden - Requires student role' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'QR code expired or invalid' })
  @ApiQuery({ name: 'token', required: true, description: 'QR code token' })
  @ApiQuery({ name: 'classId', required: true, description: 'Class ID' })
  async markAttendanceFromUrl(
    @Query('token') token: string,
    @Query('classId') classId: string,
    @Request() req,
  ) {
    try {
      if (!token || !classId) {
        throw new BadRequestException('Token and class ID are required');
      }

      return await this.classesService.markAttendanceFromQrCode(
        token,
        classId,
        req.user.id
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to mark attendance from URL');
    }
  }

  @Post('lecture/end')
  @Roles(Role.FACULTY)
  @ApiOperation({ summary: 'End a lecture and mark absent students' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lecture ended and absent students marked',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        absentCount: { type: 'number' }
      }
    }
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden - Requires faculty role' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        classId: { type: 'string', description: 'ID of the class to end lecture for' }
      },
      required: ['classId']
    }
  })
  async endLecture(
    @Request() req,
    @Body('classId') classId: string
  ): Promise<{ message: string; absentCount: number }> {
    if (!classId) {
      throw new BadRequestException('Class ID is required');
    }

    // Verify the requesting faculty is the one assigned to this class
    const classInfo = await this.classesService.findOne(classId);
    if (classInfo.facultyId !== req.user.id) {
      throw new ForbiddenException('You are not authorized to end this lecture');
    }

    // Get all enrolled students who didn't mark attendance
    const enrollments = await this.classesService.findEnrollmentsByClass(classId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let absentCount = 0;

    for (const enrollment of enrollments) {
      const attendance = await this.attendanceService.findByStudentAndDate(
        enrollment.studentId,
        classId,
        today
      );

      if (!attendance) {
        // Mark as absent
        await this.attendanceService.markAttendance({
          studentId: enrollment.studentId,
          classId,
          status: AttendanceStatus.ABSENT,
          date: today
        });
        absentCount++;
      }
    }

    // Deactivate the QR code
    await this.classesService.deactivateQrCode(classId);

    return { 
      message: 'Lecture ended successfully',
      absentCount
    };
  }

  @Get('lecture/status/:classId')
  @Roles(Role.FACULTY, Role.ADMIN)
  @ApiOperation({ summary: 'Get lecture status and attendance' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Return lecture status and attendance',
    schema: {
      type: 'object',
      properties: {
        isActive: { type: 'boolean' },
        qrCode: { type: 'string', nullable: true },
        expiresAt: { type: 'string', format: 'date-time', nullable: true },
        attendance: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              studentId: { type: 'string' },
              studentName: { type: 'string' },
              status: { type: 'string', enum: ['PRESENT', 'LATE', 'ABSENT'] },
              markedAt: { type: 'string', format: 'date-time', nullable: true }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden - Requires faculty or admin role' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Class not found' })
  async getLectureStatus(
    @Param('classId') classId: string,
    @Request() req
  ) {
    // Get class info
    const classInfo = await this.classesService.findOne(classId);
    
    // Verify the requesting faculty is the one assigned to this class (unless admin)
    if (req.user.role !== Role.ADMIN && classInfo.facultyId !== req.user.id) {
      throw new ForbiddenException('You are not authorized to view this lecture');
    }

    // Get enrollments
    const enrollments = await this.classesService.findEnrollmentsByClass(classId);
    
    // Get attendance for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendanceData = [];
    
    for (const enrollment of enrollments) {
      const attendance = await this.attendanceService.findByStudentAndDate(
        enrollment.studentId,
        classId,
        today
      );
      
      // Get student details
      const student = await this.usersService.findOne(enrollment.studentId);
      
      attendanceData.push({
        studentId: enrollment.studentId,
        studentName: student?.name || 'Unknown',
        status: attendance?.status || 'ABSENT',
        markedAt: attendance?.createdAt || null
      });
    }

    return {
      isActive: classInfo.isActive,
      qrCode: classInfo.currentQrCode,
      expiresAt: classInfo.qrCodeExpiresAt,
      attendance: attendanceData
    };
  }
}
