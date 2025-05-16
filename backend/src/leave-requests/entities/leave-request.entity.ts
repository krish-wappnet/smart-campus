import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum LeaveRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('leave_requests')
export class LeaveRequest extends BaseEntity {
  @ApiProperty({ description: 'Faculty ID' })
  @Column()
  facultyId: string;

  @ManyToOne(() => User, (user) => user.leaveRequests)
  @JoinColumn({ name: 'facultyId' })
  faculty: User;

  @ApiProperty({ example: '2023-05-15', description: 'Leave start date' })
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty({ example: '2023-05-17', description: 'Leave end date' })
  @Column({ type: 'date' })
  endDate: Date;

  @ApiProperty({ example: 'Medical leave', description: 'Leave reason' })
  @Column()
  reason: string;

  @ApiProperty({ enum: LeaveRequestStatus, enumName: 'LeaveRequestStatus', example: LeaveRequestStatus.PENDING, description: 'Leave request status' })
  @Column({ type: 'enum', enum: LeaveRequestStatus, default: LeaveRequestStatus.PENDING })
  status: LeaveRequestStatus;

  @ApiProperty({ description: 'Substitute faculty ID (optional)', required: false })
  @Column({ nullable: true })
  substituteId: string;

  @ManyToOne(() => User, (user) => user.substituteLeaveRequests)
  @JoinColumn({ name: 'substituteId' })
  substitute: User;
}