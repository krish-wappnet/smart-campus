import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Attendance } from './entities/attendance.entity';
import { BiometricAttendanceDto } from './dto/biometric-attendance.dto';
import { AttendanceReportDto } from './dto/attendance-report.dto';

@ApiTags('attendance')
@ApiBearerAuth()
@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

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
}