export interface Student {
  id: string;
  name: string;
  isPresent: boolean;
}

export interface AttendanceReport {
  id: string;
  className: string;
  date: Date;
  totalStudents: number;
  present: number;
  absent: number;
  students: Student[];
}
