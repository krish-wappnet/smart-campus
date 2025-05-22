import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Class } from '../../classes/entities/class.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { ActivityLog } from '../../activity-logs/entities/activity-log.entity';
import { LeaveRequest } from '../../leave-requests/entities/leave-request.entity';
import { Enrollment } from '../../classes/entities/enrollment.entity';

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

  @OneToMany(() => Class, (cls) => cls.faculty, { lazy: true })
  classes: Promise<Class[]>;

  @OneToMany(() => Attendance, (attendance) => attendance.student, { lazy: true })
  attendances: Promise<Attendance[]>;

  @OneToMany(() => ActivityLog, (activityLog) => activityLog.student, { lazy: true })
  activityLogs: Promise<ActivityLog[]>;

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.faculty, { lazy: true })
  leaveRequests: Promise<LeaveRequest[]>;

  @OneToMany(() => LeaveRequest, (leaveRequest) => leaveRequest.substitute, { lazy: true })
  substituteLeaveRequests: Promise<LeaveRequest[]>;

  @ApiProperty({ description: 'Enrollments of the student' })
  @OneToMany(() => Enrollment, (enrollment) => enrollment.student, { lazy: true })
  enrollments: Promise<Enrollment[]>;
}