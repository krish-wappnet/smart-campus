import { Entity, Column, ManyToOne, OneToMany, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';
import { Timeslot } from '../../timeslots/entities/timeslot.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { Enrollment } from './enrollment.entity';

export enum LectureStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

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

  @ApiProperty({ description: 'Whether the lecture is currently active' })
  @Column({ default: false })
  isActive: boolean;

  @ApiProperty({ description: 'Current lecture QR code (if active)', nullable: true })
  @Column({ nullable: true })
  currentQrCode: string;

  @ApiProperty({ description: 'QR code expiry timestamp (if active)', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  qrCodeExpiresAt: Date;

  @Column({
    type: 'enum',
    enum: LectureStatus,
    default: LectureStatus.NOT_STARTED
  })
  lectureStatus: LectureStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}