import { Routes } from '@angular/router';
import { FacultyComponent } from './faculty.component';
import { LecturesComponent } from './lectures/lectures.component';

export const facultyRoutes: Routes = [
  {
    path: '',
    component: FacultyComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.FacultyDashboardComponent) },
      { path: 'lectures', component: LecturesComponent },
      { path: 'classes', loadComponent: () => import('./classes/manage-classes/manage-classes.component').then(m => m.ManageClassesComponent) },
      { path: 'leave', loadComponent: () => import('./leave-requests/manage-leave-requests/manage-leave-requests.component').then(m => m.ManageLeaveRequestsComponent) },
      { path: 'attendance', loadComponent: () => import('./attendance/manage-attendance/manage-attendance.component').then(m => m.ManageAttendanceComponent) }
    ]
  }
];
