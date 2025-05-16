import { Routes, Router, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { map, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from './store';
import { selectIsAuthenticated, selectUser } from './store/auth/auth.selectors';
import { Role } from './core/models/role.enum';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AuthService } from './services/auth.service';

// Define route data interface for type safety
export interface RouteData {
  roles?: Role[];
  title?: string;
  [key: string]: any;
}

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'auth', 
    pathMatch: 'full' 
  },
  { 
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule),
    canActivate: [(): ReturnType<CanActivateFn> => {
      const store = inject(Store<AppState>);
      const router = inject(Router);
      
      return store.select(selectIsAuthenticated).pipe(
        withLatestFrom(store.select(selectUser)),
        map(([isAuthenticated, user]) => {
          if (isAuthenticated && user) {
            return router.createUrlTree([`/${user.role.toLowerCase()}/dashboard`]);
          }
          return true;
        })
      );
    }]
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      roles: [Role.ADMIN],
      title: 'Admin Dashboard - Smart Campus'
    },
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'faculty',
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      roles: [Role.FACULTY],
      title: 'Faculty Dashboard - Smart Campus'
    },
    loadChildren: () => import('./modules/faculty/faculty.module').then(m => m.FacultyModule)
  },
  {
    path: 'student',
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      roles: [Role.STUDENT],
      title: 'Student Dashboard - Smart Campus'
    },
    loadChildren: () => import('./modules/student/student.module').then(m => m.StudentModule)
  },
  { 
    path: '**', 
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];
