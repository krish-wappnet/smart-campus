import { createReducer, on } from '@ngrx/store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as studentActions from './student.action';
import { StudentState, initialState, studentFeatureKey } from './student.interface';

const reducer = createReducer(
  initialState,
  on(studentActions.loadStudentDashboardData, (state: StudentState) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(studentActions.loadStudentDashboardDataSuccess, (state: StudentState, { data }) => ({
    ...state,
    loading: false,
    error: null,
    ...data
  })),
  on(studentActions.markAttendanceSuccess, (state: StudentState, { classId, status }) => ({
    ...state,
    loading: false,
    error: null,
    attendanceHistory: [...state.attendanceHistory, { classId, status, timestamp: new Date() }]
  })),
  on(studentActions.markAttendanceFailure, (state: StudentState, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(studentActions.requestLeaveSuccess, (state: StudentState, { leaveRequest }) => ({
    ...state,
    loading: false,
    error: null,
    leaveRequests: [...state.leaveRequests, leaveRequest]
  })),
  on(studentActions.requestLeaveFailure, (state: StudentState, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(studentActions.loadStudentDashboardDataFailure, (state: StudentState, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

export function studentReducer(state: StudentState | undefined, action: any): StudentState {
  return reducer(state as StudentState, action);
}

export const selectStudentState = createFeatureSelector<StudentState>(studentFeatureKey);

export const selectAttendancePercentage = createSelector(
  selectStudentState,
  (state: StudentState) => state.attendancePercentage
);

export const selectUpcomingClasses = createSelector(
  selectStudentState,
  (state: StudentState) => state.upcomingClasses
);

export const selectLeaveRequests = createSelector(
  selectStudentState,
  (state: StudentState) => state.leaveRequests
);

export const selectAttendanceHistory = createSelector(
  selectStudentState,
  (state: StudentState) => state.attendanceHistory
);

export const selectLoading = createSelector(
  selectStudentState,
  (state: StudentState) => state.loading
);

export const selectError = createSelector(
  selectStudentState,
  (state: StudentState) => state.error
);
