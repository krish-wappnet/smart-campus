import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { StudentService } from '../../../services/student.service';
import * as studentActions from './student.action';

@Injectable()
export class StudentEffects {
  loadDashboardData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(studentActions.loadStudentDashboardData),
      mergeMap(() =>
        this.studentService.getDashboardData().pipe(
          map(data => studentActions.loadStudentDashboardDataSuccess({ data })),
          catchError(error => of(studentActions.loadStudentDashboardDataFailure({ error: error.message })))
        )
      )
    )
  );

  requestLeave$ = createEffect(() =>
    this.actions$.pipe(
      ofType(studentActions.requestLeave),
      mergeMap(action =>
        this.studentService.requestLeave(action.leaveRequest).pipe(
          map(leaveRequest => studentActions.requestLeaveSuccess({ leaveRequest })),
          catchError(error => of(studentActions.requestLeaveFailure({ error: error.message })))
        )
      )
    )
  );

  markAttendance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(studentActions.markAttendance),
      mergeMap(action =>
        this.studentService.markAttendance(action.classId, action.status).pipe(
          map(() => studentActions.markAttendanceSuccess({ classId: action.classId, status: action.status })),
          catchError(error => of(studentActions.markAttendanceFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private studentService: StudentService
  ) {}
}
