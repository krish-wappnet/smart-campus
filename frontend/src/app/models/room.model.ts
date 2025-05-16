export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: 'classroom' | 'lab' | 'lecture_hall' | 'meeting_room';
  floor: number;
  building: string;
  location: string;
  equipment: string[];
  available: boolean;
  createdAt: string;
  updatedAt: string;
}
