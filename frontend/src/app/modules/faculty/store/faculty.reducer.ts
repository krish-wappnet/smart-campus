import { createReducer, on } from '@ngrx/store';
import * as facultyActions from './faculty.action';

export interface FacultyState {
  classes: any[];
  schedule: any[];
  leaveRequests: any[];
  attendanceStats: any[];
  loading: boolean;
  error: string | null;
}

export const initialState: FacultyState = {
  classes: [],
  schedule: [],
  leaveRequests: [],
  attendanceStats: [],
  loading: false,
  error: null
};

export const facultyReducer = createReducer(
  initialState,
  on(facultyActions.loadFacultyDashboardData, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(facultyActions.loadFacultyDashboardDataSuccess, (state, { data }) => ({
    ...state,
    ...data,
    loading: false
  })),
  on(facultyActions.loadFacultyDashboardDataFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(facultyActions.requestLeave, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(facultyActions.requestLeaveSuccess, (state, { leaveRequest }) => ({
    ...state,
    leaveRequests: [...state.leaveRequests, leaveRequest],
    loading: false
  })),
  on(facultyActions.requestLeaveFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(facultyActions.markAttendance, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(facultyActions.markAttendanceSuccess, (state, { attendance }) => ({
    ...state,
    loading: false
  })),
  on(facultyActions.markAttendanceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(facultyActions.updateClassSchedule, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(facultyActions.updateClassScheduleSuccess, (state, { schedule }) => ({
    ...state,
    schedule,
    loading: false
  })),
  on(facultyActions.updateClassScheduleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
