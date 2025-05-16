import { createAction, props } from '@ngrx/store';

interface DashboardData {
  attendancePercentage: number;
  upcomingClasses: any[];
  leaveRequests: any[];
}

interface LeaveRequest {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export const loadStudentDashboardData = createAction('[Student] Load Dashboard Data');

export const loadStudentDashboardDataSuccess = createAction(
  '[Student] Load Dashboard Data Success',
  props<{ data: DashboardData }>()
);

export const loadStudentDashboardDataFailure = createAction(
  '[Student] Load Dashboard Data Failure',
  props<{ error: string }>()
);

export const requestLeave = createAction(
  '[Student] Request Leave',
  props<{ leaveRequest: LeaveRequest }>()
);

export const markAttendance = createAction(
  '[Student] Mark Attendance',
  props<{ classId: string; status: 'present' | 'absent' }>()
);

export const markAttendanceSuccess = createAction(
  '[Student] Mark Attendance Success',
  props<{ classId: string; status: 'present' | 'absent' }>()
);

export const markAttendanceFailure = createAction(
  '[Student] Mark Attendance Failure',
  props<{ error: string }>()
);

export const requestLeaveSuccess = createAction(
  '[Student] Request Leave Success',
  props<{ leaveRequest: LeaveRequest }>()
);

export const requestLeaveFailure = createAction(
  '[Student] Request Leave Failure',
  props<{ error: string }>()
);
