import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { EnrollStudentDto } from './dto/enroll-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Class } from './entities/class.entity';
import { Enrollment } from './entities/enrollment.entity';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { ForbiddenException } from '@nestjs/common';
import { GenerateQrCodeDto, GenerateQrCodeResponse } from './dto/generate-qrcode.dto';

@ApiTags('classes')
@ApiBearerAuth()
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({ status: 201, description: 'Class created successfully', type: Class })
  @ApiResponse({ status: 400, description: 'Bad request or conflict' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin role' })
  create(@Body() createClassDto: CreateClassDto): Promise<Class> {
    return this.classesService.create(createClassDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.FACULTY, Role.STUDENT)
  @ApiOperation({ summary: 'Get all classes' })
  @ApiResponse({ status: 200, description: 'Return all classes', type: [Class] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(@Request() req) {
    console.log('findAll called with user role:', req.user.role);
    console.log('User ID:', req.user.id);
    
    try {
      // For all roles (ADMIN, FACULTY, STUDENT), return all classes
      console.log('Fetching all classes');
      const result = await this.classesService.findAll();
      console.log('Result from service:', result);
      return result;
    } catch (error) {
      console.error('Error in findAll controller:', error);
      throw error;
    }
  }

  @Get('faculty')
  @Roles(Role.FACULTY)
  @ApiOperation({ summary: 'Get classes assigned to the faculty' })
  @ApiResponse({ status: 200, description: 'Return faculty classes', type: [Class] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires faculty role' })
  findFacultyClasses(@Request() req): Promise<Class[]> {
    return this.classesService.findFacultyClasses(req.user.id);
  }

  @Get('student')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get classes enrolled by the student' })
  @ApiResponse({ status: 200, description: 'Return student classes', type: [Class] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires student role' })
  findStudentClasses(@Request() req): Promise<Class[]> {
    return this.classesService.findStudentClasses(req.user.id);
  }

  @Post('enroll')
  @Roles(Role.STUDENT, Role.ADMIN)
  @ApiOperation({ summary: 'Enroll a student in a class' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Successfully enrolled student in the class',
    type: Enrollment
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Class not found' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Student is already enrolled in this class' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden - Requires student or admin role' })
  async enroll(
    @Request() req,
    @Body() enrollDto: EnrollStudentDto,
  ): Promise<Enrollment> {
    // If admin is enrolling a student, the DTO should contain studentId
    // If student is self-enrolling, the DTO doesn't need studentId
    const studentId = enrollDto.studentId || req.user.id;
    return this.classesService.enrollStudent(studentId, enrollDto);
  }

  @Delete('enroll/:classId')
  @Roles(Role.STUDENT, Role.ADMIN)
  @ApiOperation({ summary: 'Unenroll a student from a class' })
  @ApiParam({ name: 'classId', description: 'ID of the class to unenroll from' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Successfully unenrolled student from the class'
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Enrollment not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden - Requires student or admin role' })
  async unenroll(
    @Request() req,
    @Param('classId') classId: string,
    @Body('studentId') studentId?: string, // Optional, for admin unenrolling a student
  ): Promise<void> {
    // If admin is unenrolling a student, the studentId should be provided in the body
    // If student is unenrolling themselves, use their own ID
    const targetStudentId = studentId || req.user.id;
    return this.classesService.unenrollStudent(targetStudentId, classId);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a class' })
  @ApiResponse({ status: 200, description: 'Class updated successfully', type: Class })
  @ApiResponse({ status: 400, description: 'Bad request or conflict' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin role' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ): Promise<Class> {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a class' })
  @ApiResponse({ status: 200, description: 'Class deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin role' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.classesService.remove(id);
  }

  @Post(':id/generate-qrcode')
  @Roles(Role.FACULTY, Role.ADMIN)
  @ApiOperation({ summary: 'Generate a QR code for class attendance' })
  @ApiParam({ name: 'id', description: 'Class ID' })
  @ApiResponse({ 
    status: 201, 
    description: 'QR code generated successfully',
    type: GenerateQrCodeResponse
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires faculty or admin role' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async generateQrCode(
    @Param('id') classId: string,
    @Body() generateQrCodeDto: GenerateQrCodeDto,
    @Request() req
  ): Promise<GenerateQrCodeResponse> {
    // Verify the requesting faculty is the owner of the class
    const cls = await this.classesService.findOne(classId);
    if (req.user.role === Role.FACULTY && cls.facultyId !== req.user.id) {
      throw new ForbiddenException('You can only generate QR codes for your own classes');
    }
    
    // Generate QR code data with class information
    const qrData = await this.classesService.generateQrCode(classId, generateQrCodeDto.duration);
    
    // Include class information in the response
    return {
      ...qrData,
      classInfo: {
        id: cls.id,
        name: cls.name,
        facultyName: cls.faculty?.name || 'Unknown Faculty'
      }
    };
  }

  @Post(':id/start-lecture')
  @Roles(Role.FACULTY)
  @ApiOperation({ summary: 'Start a lecture and generate QR code' })
  @ApiResponse({ status: 200, description: 'Lecture started successfully' })
  async startLecture(
    @Param('id') id: string,
    @Body('duration') duration: number = 15
  ) {
    return this.classesService.generateQrCode(id, duration);
  }

  @Post(':id/end-lecture')
  @Roles(Role.FACULTY)
  @ApiOperation({ summary: 'End a lecture' })
  @ApiResponse({ status: 200, description: 'Lecture ended successfully' })
  async endLecture(@Param('id') id: string) {
    return this.classesService.endLecture(id);
  }

  @Post(':id/mark-attendance')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Mark attendance using QR code' })
  @ApiResponse({ status: 200, description: 'Attendance marked successfully' })
  async markAttendance(
    @Param('id') id: string,
    @Body('token') token: string,
    @Body('email') email: string
  ) {
    return this.classesService.markAttendanceFromQrCode(token, id, email);
  }

  @Get(':id/lecture-status')
  @ApiOperation({ summary: 'Get current lecture status' })
  @ApiResponse({ status: 200, description: 'Returns the current lecture status' })
  async getLectureStatus(@Param('id') id: string) {
    const cls = await this.classesService.findOne(id);
    return {
      status: cls.lectureStatus,
      qrCode: cls.currentQrCode,
      expiresAt: cls.qrCodeExpiresAt
    };
  }
}