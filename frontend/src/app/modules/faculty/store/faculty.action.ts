import { createAction, props } from '@ngrx/store';

export const loadFacultyDashboardData = createAction('[Faculty] Load Dashboard Data');

export const loadFacultyDashboardDataSuccess = createAction(
  '[Faculty] Load Dashboard Data Success',
  props<{ data: {
    classes: any[];
    schedule: any[];
    leaveRequests: any[];
    attendanceStats: any[];
  } }>()
);

export const loadFacultyDashboardDataFailure = createAction(
  '[Faculty] Load Dashboard Data Failure',
  props<{ error: string }>()
);

export const requestLeave = createAction(
  '[Faculty] Request Leave',
  props<{ leaveRequest: any }>()
);

export const requestLeaveSuccess = createAction(
  '[Faculty] Request Leave Success',
  props<{ leaveRequest: any }>()
);

export const requestLeaveFailure = createAction(
  '[Faculty] Request Leave Failure',
  props<{ error: string }>()
);

export const markAttendance = createAction(
  '[Faculty] Mark Attendance',
  props<{ classId: string; studentId: string; status: 'present' | 'absent' }>()
);

export const markAttendanceSuccess = createAction(
  '[Faculty] Mark Attendance Success',
  props<{ attendance: any }>()
);

export const markAttendanceFailure = createAction(
  '[Faculty] Mark Attendance Failure',
  props<{ error: string }>()
);

export const updateClassSchedule = createAction(
  '[Faculty] Update Class Schedule',
  props<{ schedule: any[] }>()
);

export const updateClassScheduleSuccess = createAction(
  '[Faculty] Update Class Schedule Success',
  props<{ schedule: any[] }>()
);

export const updateClassScheduleFailure = createAction(
  '[Faculty] Update Class Schedule Failure',
  props<{ error: string }>()
);
