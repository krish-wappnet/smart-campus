import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  @ApiProperty({ example: 'Introduction to Computer Science', description: 'Class name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Faculty ID' })
  @IsUUID()
  @IsNotEmpty()
  facultyId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Room ID' })
  @IsUUID()
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Timeslot ID' })
  @IsUUID()
  @IsNotEmpty()
  timeslotId: string;
}