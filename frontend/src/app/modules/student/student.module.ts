import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { studentRoutes } from './student.routes';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyClassesComponent } from './my-classes/my-classes.component';
import { MyScheduleComponent } from './my-schedule/my-schedule.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { LeaveRequestsComponent } from './leave-requests/leave-requests.component';
import { studentReducer } from './store/student.reducer';
import { StudentEffects } from './store/student.effects';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    DashboardComponent,
    MyClassesComponent,
    MyScheduleComponent,
    AttendanceComponent,
    LeaveRequestsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(studentRoutes),
    StoreModule.forFeature('student', studentReducer),
    EffectsModule.forFeature([StudentEffects])
  ]
})
export class StudentModule { }
