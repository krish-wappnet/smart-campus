export interface Timeslot {
  id: string;
  name: string; // Added for template
  startTime: string;
  endTime: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  capacity: number;
  days: string[];
  available: boolean;
  createdAt: string;
  updatedAt: string;
}
