import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID' })
  id: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ enum: Role, enumName: 'Role', example: Role.STUDENT, description: 'User role' })
  role: Role;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  name: string;

  @ApiProperty({ example: '2023-05-15T14:30:00Z', description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ example: '2023-05-15T14:30:00Z', description: 'Last update timestamp' })
  updatedAt: Date;
}