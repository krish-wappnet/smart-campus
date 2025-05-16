import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ example: 'Room 101', description: 'Room name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 50, description: 'Room capacity' })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  capacity: number;
}