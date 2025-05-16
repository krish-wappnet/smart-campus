import { ApiProperty } from '@nestjs/swagger';

export class ActivityHeatmapDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Student ID' })
  studentId: string;

  @ApiProperty({
    example: {
      '2023-05-15': 5,
      '2023-05-16': 3,
    },
    description: 'Activity count by day',
  })
  activityByDay: Record<string, number>;

  @ApiProperty({ example: 42, description: 'Total number of activities' })
  totalActivities: number;
}