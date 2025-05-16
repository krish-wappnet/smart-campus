import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('activity_logs')
export class ActivityLog extends BaseEntity {
  @ApiProperty({ description: 'Student ID' })
  @Column()
  studentId: string;

  @ManyToOne(() => User, (user) => user.activityLogs)
  @JoinColumn({ name: 'studentId' })
  student: User;

  @ApiProperty({ example: 'Joined lecture', description: 'Activity description' })
  @Column()
  description: string;

  @ApiProperty({ example: '2023-05-15T14:30:00Z', description: 'Activity timestamp' })
  @Column()
  timestamp: Date;
}