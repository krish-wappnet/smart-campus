import { IsDate, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '../entities/attendance.entity';
import { Type } from 'class-transformer';

export class CreateAttendanceDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Student ID' })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Class ID' })
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @ApiProperty({ example: '2023-05-15', description: 'Attendance date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ enum: AttendanceStatus, enumName: 'AttendanceStatus', example: AttendanceStatus.PRESENT, description: 'Attendance status' })
  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;
}