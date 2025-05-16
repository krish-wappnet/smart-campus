import { ApiProperty } from '@nestjs/swagger';

class ActivityEntry {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Activity log ID' })
  id: string;

  @ApiProperty({ example: 'Joined lecture', description: 'Activity description' })
  description: string;

  @ApiProperty({ example: '2023-05-15T14:30:00Z', description: 'Activity timestamp' })
  timestamp: Date;
}

export class ActivityCalendarDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Student ID' })
  studentId: string;

  @ApiProperty({
    example: {
      '5': { // May
        '15': [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            description: 'Joined lecture',
            timestamp: '2023-05-15T14:30:00Z',
          },
        ],
      },
    },
    description: 'Activities organized by month and day',
  })
  activityByMonth: Record<string, Record<string, ActivityEntry[]>>;

  @ApiProperty({ example: 42, description: 'Total number of activities' })
  totalActivities: number;
}