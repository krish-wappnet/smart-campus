import { Entity, ManyToOne, JoinColumn, Unique, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@common/entities/base.entity';
import { User } from '@users/entities/user.entity';
import { Class } from '@classes/entities/class.entity';

// This is needed to fix circular dependency issues
type UserWithEnrollments = User & { enrollments?: any };
type ClassWithEnrollments = Class & { enrollments?: any };

@Entity('enrollments')
@Unique(['studentId', 'classId'])
export class Enrollment extends BaseEntity {
  @ApiProperty({ description: 'The student enrolled in the class' })
  @ManyToOne(() => User, (user: UserWithEnrollments) => user.enrollments, { 
    onDelete: 'CASCADE',
    nullable: false,
    lazy: true
  })
  @JoinColumn({ name: 'studentId' })
  student: Promise<User>;

  @ApiProperty({ description: 'ID of the student' })
  @Column({ type: 'uuid' })
  studentId: string;

  @ApiProperty({ description: 'The class the student is enrolled in' })
  @ManyToOne(() => Class, (cls: ClassWithEnrollments) => cls.enrollments, { 
    onDelete: 'CASCADE',
    nullable: false,
    lazy: true
  })
  @JoinColumn({ name: 'classId' })
  class: Promise<Class>;

  @ApiProperty({ description: 'ID of the class' })
  @Column({ type: 'uuid' })
  classId: string;
}
