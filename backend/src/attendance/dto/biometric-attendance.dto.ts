import { IsNotEmpty, IsObject, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BiometricAttendanceDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Student ID' })
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Class ID' })
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @ApiProperty({ example: { fingerprint: 'data...' }, description: 'Biometric data' })
  @IsObject()
  @IsNotEmpty()
  biometricData: Record<string, any>;
}