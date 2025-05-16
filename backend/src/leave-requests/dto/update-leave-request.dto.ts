import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LeaveRequestStatus } from '../entities/leave-request.entity';

export class UpdateLeaveRequestDto {
  @ApiProperty({ enum: LeaveRequestStatus, enumName: 'LeaveRequestStatus', example: LeaveRequestStatus.APPROVED, description: 'Leave request status', required: false })
  @IsEnum(LeaveRequestStatus)
  @IsOptional()
  status?: LeaveRequestStatus;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Substitute faculty ID', required: false })
  @IsUUID()
  @IsOptional()
  substituteId?: string;

  @ApiProperty({ example: 'Approved with conditions', description: 'Admin comments', required: false })
  @IsString()
  @IsOptional()
  adminComments?: string;
}