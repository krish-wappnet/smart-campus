import { Routes } from '@angular/router';
import { StudentLayoutComponent } from './layout/layout.component';
import { StudentDashboardComponent } from './dashboard/dashboard.component';
// import { StudentAttendanceComponent } from './attendance/attendance.component';
// import { StudentProfileComponent } from './profile/profile.component';

export const studentRoutes: Routes = [
  {
    path: '',
    component: StudentLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: StudentDashboardComponent },
      // { path: 'attendance', component: StudentAttendanceComponent },
      // { path: 'profile', component: StudentProfileComponent },
    ]
  }
];
