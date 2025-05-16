import { ApiProperty } from '@nestjs/swagger';

export class AttendanceReportDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Class ID' })
  classId: string;

  @ApiProperty({ example: 'Introduction to Computer Science', description: 'Class name' })
  className: string;

  @ApiProperty({ example: 100, description: 'Total attendance records' })
  totalRecords: number;

  @ApiProperty({ example: 80, description: 'Number of present records' })
  presentCount: number;

  @ApiProperty({ example: 15, description: 'Number of absent records' })
  absentCount: number;

  @ApiProperty({ example: 5, description: 'Number of late records' })
  lateCount: number;

  @ApiProperty({ example: 80, description: 'Percentage of present records' })
  presentPercentage: number;
}