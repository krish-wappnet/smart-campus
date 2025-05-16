import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { Role } from './core/models/role.enum';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';

const routes: Routes = [
  // Public routes
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Admin routes
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.ADMIN] },
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
  },

  // Faculty routes
  {
    path: 'faculty',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.FACULTY] },
    loadChildren: () => import('./modules/faculty/faculty.module').then(m => m.FacultyModule)
  },

  // Student routes
  {
    path: 'student',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.STUDENT] },
    loadChildren: () => import('./modules/student/student.module').then(m => m.StudentModule)
  },

  // Catch all
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
