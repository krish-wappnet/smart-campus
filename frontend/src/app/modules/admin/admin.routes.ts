import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { ClassesComponent } from './classes/classes.component';
import { RoomsComponent } from './rooms/rooms.component';
import { TimeslotsComponent } from './timeslots/timeslots.component';
import { TimetableComponent } from './timetable/timetable.component';
import { LeaveRequestsComponent } from './leave-requests/leave-requests.component';
import { AttendanceReportsComponent } from './attendance-reports/attendance-reports.component';
import { ActivityLogsComponent } from './activity-logs/activity-logs.component';

export const adminRoutes: Routes = [
  { path: '', component: DashboardComponent, pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'classes', component: ClassesComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'timeslots', component: TimeslotsComponent },
  { path: 'timetable', component: TimetableComponent },
  { path: 'leave-requests', component: LeaveRequestsComponent },
  { path: 'attendance-reports', component: AttendanceReportsComponent },
  { path: 'activity-logs', component: ActivityLogsComponent }
];
