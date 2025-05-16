import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FacultyState } from './faculty.reducer';

export const selectFacultyFeature = createFeatureSelector<FacultyState>('faculty');

export const selectClasses = createSelector(
  selectFacultyFeature,
  (state: FacultyState) => state.classes
);

export const selectSchedule = createSelector(
  selectFacultyFeature,
  (state: FacultyState) => state.schedule
);

export const selectLeaveRequests = createSelector(
  selectFacultyFeature,
  (state: FacultyState) => state.leaveRequests
);

export const selectAttendanceStats = createSelector(
  selectFacultyFeature,
  (state: FacultyState) => state.attendanceStats
);

export const selectLoading = createSelector(
  selectFacultyFeature,
  (state: FacultyState) => state.loading
);

export const selectError = createSelector(
  selectFacultyFeature,
  (state: FacultyState) => state.error
);
