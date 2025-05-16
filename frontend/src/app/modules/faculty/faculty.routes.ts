import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyClassesComponent } from './my-classes/my-classes.component';
import { MyScheduleComponent } from './my-schedule/my-schedule.component';
import { LeaveRequestsComponent } from './leave-requests/leave-requests.component';

export const facultyRoutes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'my-classes', component: MyClassesComponent },
  { path: 'my-schedule', component: MyScheduleComponent },
  { path: 'leave-requests', component: LeaveRequestsComponent }
];
