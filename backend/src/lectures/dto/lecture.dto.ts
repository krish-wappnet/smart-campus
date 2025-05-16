import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LectureDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Class ID' })
  @IsUUID()
  @IsNotEmpty()
  classId: string;
}