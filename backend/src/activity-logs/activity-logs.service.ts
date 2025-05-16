import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { ClassesService } from '../classes/classes.service';
import { ActivityHeatmapDto } from './dto/activity-heatmap.dto';
import { ActivityCalendarDto } from './dto/activity-calendar.dto';

@Injectable()
export class ActivityLogsService {
  private readonly logger = new Logger(ActivityLogsService.name);

  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
    private readonly classesService: ClassesService,
  ) {}

  async create(studentId: string, description: string): Promise<ActivityLog> {
    const activityLog = this.activityLogRepository.create({
      studentId,
      description,
      timestamp: new Date(),
    });

    const savedLog = await this.activityLogRepository.save(activityLog);
    this.logger.log(`Created activity log for student ${studentId}: ${description}`);
    return savedLog;
  }

  async findAll(): Promise<ActivityLog[]> {
    return this.activityLogRepository.find({
      relations: ['student'],
      order: { timestamp: 'DESC' },
    });
  }

  async findByClass(classId: string): Promise<ActivityLog[]> {
    // Validate class exists
    await this.classesService.findOne(classId);

    // In a real application, you would have a relationship between activity logs and classes
    // For this example, we'll return all logs (simplified)
    return this.activityLogRepository.find({
      relations: ['student'],
      order: { timestamp: 'DESC' },
    });
  }

  async findByStudent(studentId: string): Promise<ActivityLog[]> {
    return this.activityLogRepository.find({
      where: { studentId },
      order: { timestamp: 'DESC' },
    });
  }

  async getHeatmap(studentId: string): Promise<ActivityHeatmapDto> {
    // In a real application, you would generate actual heatmap data
    // For this example, we'll return mock data
    const logs = await this.findByStudent(studentId);
    
    // Group logs by day
    const activityByDay = {};
    logs.forEach(log => {
      const day = log.timestamp.toISOString().split('T')[0];
      if (!activityByDay[day]) {
        activityByDay[day] = 0;
      }
      activityByDay[day]++;
    });

    return {
      studentId,
      activityByDay,
      totalActivities: logs.length,
    };
  }

  async getCalendar(studentId: string): Promise<ActivityCalendarDto> {
    // In a real application, you would generate actual calendar data
    // For this example, we'll return mock data
    const logs = await this.findByStudent(studentId);
    
    // Group logs by month and day
    const activityByMonth = {};
    logs.forEach(log => {
      const date = log.timestamp;
      const month = date.getMonth() + 1; // 1-12
      const day = date.getDate(); // 1-31
      
      if (!activityByMonth[month]) {
        activityByMonth[month] = {};
      }
      
      if (!activityByMonth[month][day]) {
        activityByMonth[month][day] = [];
      }
      
      activityByMonth[month][day].push({
        id: log.id,
        description: log.description,
        timestamp: log.timestamp,
      });
    });

    return {
      studentId,
      activityByMonth,
      totalActivities: logs.length,
    };
  }
}