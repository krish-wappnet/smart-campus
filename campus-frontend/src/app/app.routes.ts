import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { 
    path: 'auth', 
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.routes)
  },
  { 
    path: 'admin', 
    canActivate: [RoleGuard],
    data: { roles: ['admin'] },
    loadChildren: () => import('./modules/admin/admin.routes').then(m => m.routes)
  },
  { 
    path: 'faculty', 
    canActivate: [RoleGuard],
    data: { roles: ['faculty'] },
    loadChildren: () => import('./modules/faculty/faculty.routes').then(m => m.facultyRoutes)
  },
  { 
    path: 'student', 
    canActivate: [RoleGuard],
    data: { roles: ['student'] },
    loadChildren: () => import('./modules/student/student.routes').then(m => m.studentRoutes)
  }
];
