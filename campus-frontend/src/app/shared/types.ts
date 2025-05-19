export interface StudentClass {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  facultyId: string;
  roomId: string;
  timeslotId: string;
  faculty: {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    password: string;
    role: string;
    name: string;
  };
  room: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    capacity: number;
  };
  timeslot: {
    id: string;
    createdAt: string;
    updatedAt: string;
    startTime: string;
    endTime: string;
    dayOfWeek: string;
  };
  lectureStatus?: 'active' | 'inactive';
}
