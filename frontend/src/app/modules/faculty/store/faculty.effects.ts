import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { FacultyService } from '../services/faculty.service';
import * as facultyActions from './faculty.action';

@Injectable()
export class FacultyEffects {
  loadDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(facultyActions.loadFacultyDashboardData),
      mergeMap(() =>
        this.facultyService.getDashboardData().pipe(
          map(dashboardData => {
            // Transform the data to match the expected format
            const transformedData = {
              classes: [], // You might need to adjust this based on actual data
              schedule: dashboardData.upcomingClasses || [],
              leaveRequests: [], // You might need to adjust this based on actual data
              attendanceStats: dashboardData.recentAttendance || []
            };
            return facultyActions.loadFacultyDashboardDataSuccess({ data: transformedData });
          }),
          catchError(error => of(facultyActions.loadFacultyDashboardDataFailure({ error: error.message })))
        )
      )
    )
  );

  requestLeave$ = createEffect(() =>
    this.actions$.pipe(
      ofType(facultyActions.requestLeave),
      mergeMap(action =>
        this.facultyService.requestLeave(action.leaveRequest).pipe(
          map(leaveRequest => facultyActions.requestLeaveSuccess({ leaveRequest })),
          catchError(error => of(facultyActions.requestLeaveFailure({ error: error.message })))
        )
      )
    )
  );

  markAttendance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(facultyActions.markAttendance),
      mergeMap(action =>
        this.facultyService.markAttendance(action.classId, action.studentId, action.status).pipe(
          map(attendance => facultyActions.markAttendanceSuccess({ attendance })),
          catchError(error => of(facultyActions.markAttendanceFailure({ error: error.message })))
        )
      )
    )
  );

  updateClassSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(facultyActions.updateClassSchedule),
      mergeMap(action =>
        this.facultyService.updateClassSchedule(action.schedule).pipe(
          map(schedule => facultyActions.updateClassScheduleSuccess({ schedule })),
          catchError(error => of(facultyActions.updateClassScheduleFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private facultyService: FacultyService
  ) {}
}
