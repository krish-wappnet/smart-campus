import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Class } from '../../classes/entities/class.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { ActivityLog } from '../../activity-logs/entities/activity-log.entity';
import { LeaveRequest } from '../../leave-requests/entities/leave-request.entity';

export enum Role {
  ADMIN = 'admin',
  FACULTY = 'faculty',
  STUDENT = 'student',
}

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'User password (hashed)' })
  @Column()
  @Exclude()
  password: string;

  @ApiProperty({ enum: Role, enumName: 'Role', example: Role.STUDENT, description: 'User role' })
  @Column({ type: 'enum', enum: Role, default: Role.STUDENT })
  role: Role;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @Column()
  name: string;

  @OneToMany(() => Class, (cls) => cls.faculty)
  classes: Class[];

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances: Attendance[];

  @OneToMany(() => ActivityLog, (activityLog) => activityLog.student)
  activityLogs: ActivityLog[];

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.faculty)
  leaveRequests: LeaveRequest[];

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.substitute)
  substituteLeaveRequests: LeaveRequest[];
}