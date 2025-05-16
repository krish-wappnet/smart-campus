import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StudentState, studentFeatureKey } from './student.interface';

export const selectStudentFeature = createFeatureSelector<StudentState>(studentFeatureKey);

export const selectAttendancePercentage = createSelector(
  selectStudentFeature,
  (state: StudentState) => state.attendancePercentage
);

export const selectUpcomingClasses = createSelector(
  selectStudentFeature,
  (state: StudentState) => state.upcomingClasses
);

export const selectLeaveRequests = createSelector(
  selectStudentFeature,
  (state: StudentState) => state.leaveRequests
);

export const selectClasses = createSelector(
  selectStudentFeature,
  (state: StudentState) => state.upcomingClasses
);

export const selectAttendanceHistory = createSelector(
  selectStudentFeature,
  (state: StudentState) => state.attendanceHistory
);

export const selectLoading = createSelector(
  selectStudentFeature,
  (state: StudentState) => state.loading
);

export const selectError = createSelector(
  selectStudentFeature,
  (state: StudentState) => state.error
);
