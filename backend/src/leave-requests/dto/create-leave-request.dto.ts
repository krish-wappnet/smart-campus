import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateLeaveRequestDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Faculty ID' })
  @IsUUID()
  @IsNotEmpty()
  facultyId: string;

  @ApiProperty({ example: '2023-05-15', description: 'Leave start date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({ example: '2023-05-17', description: 'Leave end date' })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({ example: 'Medical leave', description: 'Leave reason' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Substitute faculty ID (optional)', required: false })
  @IsUUID()
  @IsOptional()
  substituteId?: string;
}