import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { 
    path: 'auth', 
    loadChildren: () => import('./modules/auth/auth.routes').then(m => m.routes)
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./modules/admin/admin.routes').then(m => m.routes)
  }
];
