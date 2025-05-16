import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminState } from './admin.interface';
import { User } from '../../../store/auth/auth.interface';
import { AttendanceReport } from '../../../models/attendance-report.model';

export const selectAdminFeature = createFeatureSelector<AdminState>('admin');

export const selectLoading = createSelector(
  selectAdminFeature,
  (state: AdminState) => state.loading
);

export const selectError = createSelector(
  selectAdminFeature,
  (state: AdminState) => state.error
);

export const selectTotalUsers = createSelector(
  selectAdminFeature,
  (state: AdminState) => state.totalUsers
);

export const selectTotalClasses = createSelector(
  selectAdminFeature,
  (state: AdminState) => state.totalClasses
);

export const selectTotalRooms = createSelector(
  selectAdminFeature,
  (state: AdminState) => state.totalRooms
);

export const selectPendingLeaves = createSelector(
  selectAdminFeature,
  (state: AdminState) => state.pendingLeaves
);

export const selectRecentActivities = createSelector(
  selectAdminFeature,
  (state: AdminState) => state.recentActivities
);

// User selectors
export const selectUsers = createSelector(
  selectAdminFeature,
  (state: AdminState) => state.users
);

export const selectUser = createSelector(
  selectAdminFeature,
  (state: AdminState) => state.user
);

export const selectAttendanceReports = createSelector(
  selectAdminFeature,
  (state: AdminState) => state.reports || []
);

export const selectClasses = createSelector(
  selectAdminFeature,
  (state: AdminState) => state.classes || []
);

export const selectUserById = createSelector(
  selectAdminFeature,
  (state: AdminState, props: { id: string }) => state.users.find(user => user.id === props.id)
);
