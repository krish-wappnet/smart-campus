import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LeaveRequestsService } from './leave-requests.service';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LeaveRequest } from './entities/leave-request.entity';

@ApiTags('leave-requests')
@ApiBearerAuth()
@Controller('leave-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeaveRequestsController {
  constructor(private readonly leaveRequestsService: LeaveRequestsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a leave request (admin)' })
  @ApiResponse({ status: 201, description: 'Leave request created successfully', type: LeaveRequest })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin role' })
  create(@Body() createLeaveRequestDto: CreateLeaveRequestDto): Promise<LeaveRequest> {
    return this.leaveRequestsService.create(createLeaveRequestDto);
  }

  @Post('faculty')
  @Roles(Role.FACULTY)
  @ApiOperation({ summary: 'Create a leave request (faculty)' })
  @ApiResponse({ status: 201, description: 'Leave request created successfully', type: LeaveRequest })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires faculty role' })
  createFacultyLeave(
    @Request() req,
    @Body() createLeaveRequestDto: CreateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    // Override facultyId with the current user's ID
    createLeaveRequestDto.facultyId = req.user.id;
    return this.leaveRequestsService.create(createLeaveRequestDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all leave requests (admin)' })
  @ApiResponse({ status: 200, description: 'Return all leave requests', type: [LeaveRequest] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin role' })
  findAll(): Promise<LeaveRequest[]> {
    return this.leaveRequestsService.findAll();
  }

  @Get('faculty')
  @Roles(Role.FACULTY)
  @ApiOperation({ summary: 'Get leave requests for the current faculty' })
  @ApiResponse({ status: 200, description: 'Return faculty leave requests', type: [LeaveRequest] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires faculty role' })
  findFacultyLeaves(@Request() req): Promise<LeaveRequest[]> {
    return this.leaveRequestsService.findByFaculty(req.user.id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a leave request (admin)' })
  @ApiResponse({ status: 200, description: 'Leave request updated successfully', type: LeaveRequest })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin role' })
  @ApiResponse({ status: 404, description: 'Leave request not found' })
  update(
    @Param('id') id: string,
    @Body() updateLeaveRequestDto: UpdateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    return this.leaveRequestsService.update(id, updateLeaveRequestDto);
  }
}