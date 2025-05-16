export interface Class {
  id: string;
  name: string;
  section: string;
  code?: string;
  capacity: number;
  teacherId: string;
  teacherName: string;
  department: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any; // Keep this as a fallback for any additional properties
}
