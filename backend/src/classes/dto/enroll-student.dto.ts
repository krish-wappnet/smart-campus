import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class EnrollStudentDto {
  @ApiProperty({ description: 'ID of the class to enroll in' })
  @IsUUID()
  classId: string;

  @ApiProperty({ description: 'ID of the student to enroll', required: false })
  @IsUUID()
  studentId?: string; // Optional - if not provided, will use the authenticated student's ID
}
