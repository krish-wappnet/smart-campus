import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClassDto {
  @ApiProperty({ example: 'Introduction to Computer Science', description: 'Class name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Faculty ID', required: false })
  @IsUUID()
  @IsOptional()
  facultyId?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Room ID', required: false })
  @IsUUID()
  @IsOptional()
  roomId?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Timeslot ID', required: false })
  @IsUUID()
  @IsOptional()
  timeslotId?: string;
}