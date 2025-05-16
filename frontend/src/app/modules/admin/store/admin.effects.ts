import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { map, catchError, switchMap, of } from 'rxjs';
import { AdminService } from '../../../services/admin.service';
import { adminActions } from './admin.actions';
import { ActivityLog } from '../../../models/activity-log.model';
import { LeaveRequest } from '../../../models/leave-request.model';

export class AdminEffects {
  private actions$ = inject(Actions);
  private adminService = inject(AdminService);

  constructor() { }

  loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(adminActions.loadDashboardData),
      switchMap(() =>
        this.adminService.getDashboardData().pipe(
          map(data => adminActions.loadDashboardDataSuccess({
      totalUsers: data.totalUsers,
      totalClasses: data.totalClasses,
      totalRooms: data.totalRooms,
      pendingLeaves: data.pendingLeaves,
      recentActivities: data.recentActivities
    })),
          catchError(error => of(adminActions.loadDashboardDataFailure({ error: error.message })))
        )
      )
    )
  );

  loadActivityLogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(adminActions.loadActivityLogs),
      switchMap(() =>
        this.adminService.getActivityLogs().pipe(
          map((logs: ActivityLog[]) => adminActions.loadActivityLogsSuccess({ logs })),
          catchError(error => of(adminActions.loadActivityLogsFailure({ error: error.message })))
        )
      )
    )
  );

  getUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(adminActions.loadUsers),
      switchMap(() =>
        this.adminService.getUsers().pipe(
          map(users => adminActions.loadUsersSuccess({ users })),
          catchError(error => of(adminActions.loadUsersFailure({ error: error.message })))
        )
      )
    )
  );

  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(adminActions.addUser),
      switchMap(action =>
        this.adminService.addUser(action.user).pipe(
          map(user => adminActions.loadUsersSuccess({ users: [user] })),
          catchError(error => of(adminActions.loadUsersFailure({ error: error.message })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(adminActions.updateUser),
      switchMap(action =>
        this.adminService.updateUser(action.user.id, action.user).pipe(
          map(user => adminActions.loadUsersSuccess({ users: [user] })),
          catchError(error => of(adminActions.loadUsersFailure({ error: error.message })))
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(adminActions.deleteUser),
      switchMap(action =>
        this.adminService.deleteUser(action.user.id).pipe(
          map(() => adminActions.loadUsersSuccess({ users: [] })),
          catchError(error => of(adminActions.loadUsersFailure({ error: error.message })))
        )
      )
    )
  );

  // Leave Request Effects
  loadLeaveRequests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(adminActions.loadLeaveRequests),
      switchMap(() =>
        this.adminService.getLeaveRequests().pipe(
          map((requests: LeaveRequest[]) => adminActions.loadLeaveRequestsSuccess({ leaveRequests: requests })),
          catchError(error => of(adminActions.loadLeaveRequestsFailure({ error: error.message })))
        )
      )
    )
  );

  loadAttendanceReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(adminActions.loadAttendanceReports),
      switchMap(() =>
        this.adminService.getAttendanceReports().pipe(
          map((reports: any[]) => adminActions.loadAttendanceReportsSuccess({ reports })),
          catchError(error => of(adminActions.loadAttendanceReportsFailure({ error: error.message })))
        )
      )
    )
  );

  approveLeaveRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(adminActions.approveLeaveRequest),
      switchMap(action =>
        this.adminService.approveLeaveRequest(action.leaveRequest).pipe(
          map(() => adminActions.approveLeaveRequestSuccess({ leaveRequest: { ...action.leaveRequest, status: 'approved' } })),
          catchError(error => of(adminActions.approveLeaveRequestFailure({ error: error.message })))
        )
      )
    )
  );

  rejectLeaveRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(adminActions.rejectLeaveRequest),
      switchMap(action =>
        this.adminService.rejectLeaveRequest(action.leaveRequest).pipe(
          map(() => adminActions.rejectLeaveRequestSuccess({ leaveRequest: { ...action.leaveRequest, status: 'rejected', rejectionReason: action.leaveRequest.rejectionReason } })),
          catchError(error => of(adminActions.rejectLeaveRequestFailure({ error: error.message })))
        )
      )
    )
  );
}
