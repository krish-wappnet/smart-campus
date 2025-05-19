import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'users', loadComponent: () => import('./users/manage-users/manage-users.component').then(m => m.ManageUsersComponent) },
      { path: 'rooms', loadComponent: () => import('./rooms/manage-rooms/manage-rooms.component').then(m => m.ManageRoomsComponent) },
      { path: 'timeslots', loadComponent: () => import('./timeslots/manage-timeslots/manage-timeslots.component').then(m => m.ManageTimeslotsComponent) },
      { path: 'classes', loadComponent: () => import('./classes/manage-classes/manage-classes.component').then(m => m.ManageClassesComponent) },
      { path: 'leave-requests', loadComponent: () => import('./leave-requests/manage-leave-requests/manage-leave-requests.component').then(m => m.ManageLeaveRequestsComponent) }
    ]
  }
];
