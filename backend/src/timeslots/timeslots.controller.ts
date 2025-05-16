import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TimeslotsService } from './timeslots.service';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Timeslot } from './entities/timeslot.entity';

@ApiTags('timeslots')
@ApiBearerAuth()
@Controller('timeslots')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TimeslotsController {
  constructor(private readonly timeslotsService: TimeslotsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new timeslot' })
  @ApiResponse({ status: 201, description: 'Timeslot created successfully', type: Timeslot })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin role' })
  create(@Body() createTimeslotDto: CreateTimeslotDto): Promise<Timeslot> {
    return this.timeslotsService.create(createTimeslotDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.FACULTY)
  @ApiOperation({ summary: 'Get all timeslots' })
  @ApiResponse({ status: 200, description: 'Return all timeslots', type: [Timeslot] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin or faculty role' })
  findAll(): Promise<Timeslot[]> {
    return this.timeslotsService.findAll();
  }
}