import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AttendanceReport } from '../../../models/attendance-report.model';
import { ActivityLog } from '../../../models/activity-log.model';

export const selectAdminState = createFeatureSelector('admin');

export const selectDashboardData = createSelector(
  selectAdminState,
  (state: any) => state.dashboardData
);

export const selectLeaveRequests = createSelector(
  selectAdminState,
  (state: any) => state.leaveRequests
);

export const selectTimeslots = createSelector(
  selectAdminState,
  (state: any) => state.timeslots
);

export const selectAttendanceReports = createSelector(
  selectAdminState,
  (state: any) => state.attendanceReports
);

export const selectActivityLogs = createSelector(
  selectAdminState,
  (state: any) => state.activityLogs
);
