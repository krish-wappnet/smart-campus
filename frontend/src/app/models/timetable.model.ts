export interface TimetableEntry {
  id: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt: Date;
}
