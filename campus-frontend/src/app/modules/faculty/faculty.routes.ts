import { Routes } from '@angular/router';
import { FacultyLayoutComponent } from './layout/layout.component';
import { FacultyDashboardComponent } from './dashboard/dashboard.component';

export const facultyRoutes: Routes = [
  {
    path: '',
    component: FacultyLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.FacultyDashboardComponent) },
      { path: 'classes', loadComponent: () => import('./classes/manage-classes/manage-classes.component').then(m => m.ManageClassesComponent) },
      { path: 'leave', loadComponent: () => import('./leave-requests/manage-leave-requests/manage-leave-requests.component').then(m => m.ManageLeaveRequestsComponent) },
      { path: 'attendance', loadComponent: () => import('./attendance/manage-attendance/manage-attendance.component').then(m => m.ManageAttendanceComponent) }
    ]
  }
];
