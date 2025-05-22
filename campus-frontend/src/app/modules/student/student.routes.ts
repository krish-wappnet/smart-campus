import { Routes } from '@angular/router';
import { StudentLayoutComponent } from './layout/layout.component';
import { StudentDashboardComponent } from './dashboard/dashboard.component';
import { ClassEnrollmentComponent } from './class-enrollment/class-enrollment.component';
// import { StudentAttendanceComponent } from './attendance/attendance.component';
// import { StudentProfileComponent } from './profile/profile.component';

export const studentRoutes: Routes = [
  {
    path: '',
    component: StudentLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: StudentDashboardComponent },
      { 
        path: 'classes', 
        component: ClassEnrollmentComponent,
        data: { title: 'Class Enrollment' }
      },
      // { path: 'attendance', component: StudentAttendanceComponent },
      // { path: 'profile', component: StudentProfileComponent },
    ]
  }
];
