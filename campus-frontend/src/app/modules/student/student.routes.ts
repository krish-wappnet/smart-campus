import { Routes } from '@angular/router';
import { StudentLayoutComponent } from './layout/layout.component';
import { StudentDashboardComponent } from './dashboard/dashboard.component';
import { ClassEnrollmentComponent } from './class-enrollment/class-enrollment.component';
import { QrScannerComponent } from './attendance/qr-scanner/qr-scanner.component';
import { StudentAttendanceComponent } from './attendance/attendance.component';
// import { TimetableComponent } from './timetable/timetable.component';

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
      {
        path: 'attendance/scan',
        component: QrScannerComponent,
        data: { title: 'Scan QR Code' }
      },
      {
        path: 'attendance',
        component: StudentAttendanceComponent,
        data: { title: 'Attendance' }
      },
    ]
  }
];
