import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ActivityLog } from './entities/activity-log.entity';
import { ActivityHeatmapDto } from './dto/activity-heatmap.dto';
import { ActivityCalendarDto } from './dto/activity-calendar.dto';

@ApiTags('activity-logs')
@ApiBearerAuth()
@Controller('activity-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all activity logs' })
  @ApiResponse({ status: 200, description: 'Return all activity logs', type: [ActivityLog] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin role' })
  findAll(): Promise<ActivityLog[]> {
    return this.activityLogsService.findAll();
  }

  @Get('class/:classId')
  @Roles(Role.FACULTY, Role.ADMIN)
  @ApiOperation({ summary: 'Get activity logs for a class' })
  @ApiResponse({ status: 200, description: 'Return activity logs for a class', type: [ActivityLog] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires faculty or admin role' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  findByClass(@Param('classId') classId: string): Promise<ActivityLog[]> {
    return this.activityLogsService.findByClass(classId);
  }

  @Get('student')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get activity logs for the current student' })
  @ApiResponse({ status: 200, description: 'Return activity logs for the student', type: [ActivityLog] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires student role' })
  findStudentLogs(@Request() req): Promise<ActivityLog[]> {
    return this.activityLogsService.findByStudent(req.user.id);
  }

  @Get('heatmap')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get activity heatmap data for the current student' })
  @ApiResponse({ status: 200, description: 'Return activity heatmap data', type: ActivityHeatmapDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires student role' })
  getHeatmap(@Request() req): Promise<ActivityHeatmapDto> {
    return this.activityLogsService.getHeatmap(req.user.id);
  }

  @Get('calendar')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get activity calendar data for the current student' })
  @ApiResponse({ status: 200, description: 'Return activity calendar data', type: ActivityCalendarDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires student role' })
  getCalendar(@Request() req): Promise<ActivityCalendarDto> {
    return this.activityLogsService.getCalendar(req.user.id);
  }
}