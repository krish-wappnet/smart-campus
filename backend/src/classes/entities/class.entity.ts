import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';
import { Timeslot } from '../../timeslots/entities/timeslot.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { Enrollment } from './enrollment.entity';

@Entity('classes')
export class Class extends BaseEntity {
  @ApiProperty({ example: 'Introduction to Computer Science', description: 'Class name' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Faculty ID' })
  @Column()
  facultyId: string;

  @ManyToOne(() => User, (user) => user.classes)
  @JoinColumn({ name: 'facultyId' })
  faculty: User;

  @ApiProperty({ description: 'Room ID' })
  @Column()
  roomId: string;

  @ManyToOne(() => Room, (room) => room.classes)
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @ApiProperty({ description: 'Timeslot ID' })
  @Column()
  timeslotId: string;

  @ManyToOne(() => Timeslot, (timeslot) => timeslot.classes)
  @JoinColumn({ name: 'timeslotId' })
  timeslot: Timeslot;

  @ApiProperty({ description: 'Attendance records for this class' })
  @OneToMany(() => Attendance, (attendance) => attendance.class, { lazy: true })
  attendances: Promise<Attendance[]>;

  @ApiProperty({ description: 'Enrollments for this class' })
  @OneToMany(() => Enrollment, (enrollment) => enrollment.class, { lazy: true })
  enrollments: Promise<Enrollment[]>;
}