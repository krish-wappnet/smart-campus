export interface StudentState {
  loading: boolean;
  error: string | null;
  attendancePercentage: number;
  upcomingClasses: any[];
  leaveRequests: any[];
  attendanceHistory: {
    classId: string;
    status: 'present' | 'absent';
    timestamp: Date;
  }[];
}

export const initialState: StudentState = {
  loading: false,
  error: null,
  attendancePercentage: 0,
  upcomingClasses: [],
  leaveRequests: [],
  attendanceHistory: []
};

export const studentFeatureKey = 'student';
