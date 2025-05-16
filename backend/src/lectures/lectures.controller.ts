import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LectureDto } from './dto/lecture.dto';

@ApiTags('lectures')
@ApiBearerAuth()
@Controller('lectures')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @Post('start')
  @Roles(Role.FACULTY)
  @ApiOperation({ summary: 'Start a lecture (for auto-attendance)' })
  @ApiResponse({ status: 200, description: 'Lecture started successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires faculty role' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  startLecture(@Body() lectureDto: LectureDto): Promise<{ message: string }> {
    return this.lecturesService.startLecture(lectureDto.classId);
  }

  @Post('end')
  @Roles(Role.FACULTY)
  @ApiOperation({ summary: 'End a lecture (for auto-attendance)' })
  @ApiResponse({ status: 200, description: 'Lecture ended successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires faculty role' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  endLecture(@Body() lectureDto: LectureDto): Promise<{ message: string }> {
    return this.lecturesService.endLecture(lectureDto.classId);
  }
}