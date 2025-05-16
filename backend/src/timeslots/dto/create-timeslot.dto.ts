import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek } from '../entities/timeslot.entity';

export class CreateTimeslotDto {
  @ApiProperty({ example: '09:00', description: 'Start time (HH:MM)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Start time must be in HH:MM format' })
  startTime: string;

  @ApiProperty({ example: '10:30', description: 'End time (HH:MM)' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'End time must be in HH:MM format' })
  endTime: string;

  @ApiProperty({ enum: DayOfWeek, enumName: 'DayOfWeek', example: DayOfWeek.MONDAY, description: 'Day of week' })
  @IsEnum(DayOfWeek)
  @IsNotEmpty()
  dayOfWeek: DayOfWeek;
}