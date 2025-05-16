import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeaveRequest, LeaveRequestStatus } from './entities/leave-request.entity';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';
import { UpdateLeaveRequestDto } from './dto/update-leave-request.dto';
import { UsersService } from '../users/users.service';
import { Role } from '../users/entities/user.entity';

@Injectable()
export class LeaveRequestsService {
  private readonly logger = new Logger(LeaveRequestsService.name);

  constructor(
    @InjectRepository(LeaveRequest)
    private readonly leaveRequestRepository: Repository<LeaveRequest>,
    private readonly usersService: UsersService,
  ) {}

  async create(createLeaveRequestDto: CreateLeaveRequestDto): Promise<LeaveRequest> {
    const { facultyId, substituteId } = createLeaveRequestDto;

    // Validate faculty exists and has faculty role
    const faculty = await this.usersService.findOne(facultyId);
    if (faculty.role !== Role.FACULTY) {
      throw new NotFoundException('User is not a faculty member');
    }

    // Validate substitute if provided
    if (substituteId) {
      const substitute = await this.usersService.findOne(substituteId);
      if (substitute.role !== Role.FACULTY) {
        throw new NotFoundException('Substitute is not a faculty member');
      }
    }

    // Create leave request
    const leaveRequest = this.leaveRequestRepository.create(createLeaveRequestDto);
    const savedLeaveRequest = await this.leaveRequestRepository.save(leaveRequest);
    this.logger.log(`Created leave request for faculty ${facultyId}`);
    return savedLeaveRequest;
  }

  async findAll(): Promise<LeaveRequest[]> {
    return this.leaveRequestRepository.find({
      relations: ['faculty', 'substitute'],
    });
  }

  async findOne(id: string): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.findOne({
      where: { id },
      relations: ['faculty', 'substitute'],
    });
    if (!leaveRequest) {
      throw new NotFoundException(`Leave request with ID ${id} not found`);
    }
    return leaveRequest;
  }

  async findByFaculty(facultyId: string): Promise<LeaveRequest[]> {
    return this.leaveRequestRepository.find({
      where: { facultyId },
      relations: ['substitute'],
    });
  }

  async update(id: string, updateLeaveRequestDto: UpdateLeaveRequestDto): Promise<LeaveRequest> {
    const leaveRequest = await this.findOne(id);

    // Validate substitute if provided
    if (updateLeaveRequestDto.substituteId) {
      const substitute = await this.usersService.findOne(updateLeaveRequestDto.substituteId);
      if (substitute.role !== Role.FACULTY) {
        throw new NotFoundException('Substitute is not a faculty member');
      }
    }

    // Update leave request
    Object.assign(leaveRequest, updateLeaveRequestDto);
    const updatedLeaveRequest = await this.leaveRequestRepository.save(leaveRequest);
    this.logger.log(`Updated leave request: ${id}`);
    return updatedLeaveRequest;
  }
}