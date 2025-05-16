import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Class } from '../../classes/entities/class.entity';

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

@Entity('timeslots')
export class Timeslot extends BaseEntity {
  @ApiProperty({ example: '09:00', description: 'Start time (HH:MM)' })
  @Column()
  startTime: string;

  @ApiProperty({ example: '10:30', description: 'End time (HH:MM)' })
  @Column()
  endTime: string;

  @ApiProperty({ enum: DayOfWeek, enumName: 'DayOfWeek', example: DayOfWeek.MONDAY, description: 'Day of week' })
  @Column({ type: 'enum', enum: DayOfWeek })
  dayOfWeek: DayOfWeek;

  @OneToMany(() => Class, (cls) => cls.timeslot)
  classes: Class[];
}