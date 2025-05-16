import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Class } from '../../classes/entities/class.entity';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
}

@Entity('attendances')
export class Attendance extends BaseEntity {
  @ApiProperty({ description: 'Student ID' })
  @Column()
  studentId: string;

  @ManyToOne(() => User, (user) => user.attendances)
  @JoinColumn({ name: 'studentId' })
  student: User;

  @ApiProperty({ description: 'Class ID' })
  @Column()
  classId: string;

  @ManyToOne(() => Class, (cls) => cls.attendances)
  @JoinColumn({ name: 'classId' })
  class: Class;

  @ApiProperty({ example: '2023-05-15', description: 'Attendance date' })
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({ enum: AttendanceStatus, enumName: 'AttendanceStatus', example: AttendanceStatus.PRESENT, description: 'Attendance status' })
  @Column({ type: 'enum', enum: AttendanceStatus, default: AttendanceStatus.ABSENT })
  status: AttendanceStatus;

  @ApiProperty({ example: '{ "fingerprint": "..." }', description: 'Biometric data (optional)', required: false })
  @Column({ type: 'jsonb', nullable: true })
  biometricData: Record<string, any>;
}