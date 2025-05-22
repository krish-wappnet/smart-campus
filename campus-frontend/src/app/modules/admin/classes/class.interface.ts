export interface Class {
  id?: string;
  name: string;
  code?: string;
  description?: string;
  facultyId: string;
  facultyName?: string;
  instructor?: string;
  roomId: string;
  roomName?: string;
  timeslotId: string;
  schedule?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  capacity?: number;
  enrolled?: number;
  status?: 'active' | 'upcoming' | 'completed' | 'cancelled';
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
