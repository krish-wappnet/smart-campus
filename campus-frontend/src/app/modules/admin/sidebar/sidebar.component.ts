import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '@store/auth/auth.selectors';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" opened>
        <mat-toolbar color="primary" class="sidenav-header">
          <span>Admin Dashboard</span>
        </mat-toolbar>
        
        <div class="nav-content">
          <mat-nav-list>
            <a mat-list-item routerLink="/admin/dashboard" routerLinkActive="active">
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
            </a>

            <a mat-list-item routerLink="/admin/users" routerLinkActive="active">
              <mat-icon>people</mat-icon>
              <span>Manage Users</span>
            </a>

            <a mat-list-item routerLink="/admin/rooms" routerLinkActive="active">
              <mat-icon>meeting_room</mat-icon>
              <span>Manage Rooms</span>
            </a>

            <a mat-list-item routerLink="/admin/timeslots" routerLinkActive="active">
              <mat-icon>schedule</mat-icon>
              <span>Manage Timeslots</span>
            </a>

            <a mat-list-item routerLink="/admin/classes" routerLinkActive="active">
              <mat-icon>class</mat-icon>
              <span>Manage Classes</span>
            </a>

            <a mat-list-item routerLink="/admin/leave-requests" routerLinkActive="active">
              <mat-icon>event</mat-icon>
              <span>Leave Requests</span>
            </a>
          </mat-nav-list>
        </div>

        <div class="bottom-nav">
          <button mat-list-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </div>
      </mat-sidenav>

      <mat-sidenav-content>
        <ng-content></ng-content>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      display: flex;
    }

    mat-sidenav {
      width: 250px;
      box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
      height: 100%;
      background-color: white;
    }

    .sidenav-header {
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      background-color: #1976d2;
      color: white;
    }

    .nav-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .bottom-nav {
      margin-top: auto;
      padding: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
    }

    mat-nav-list {
      padding: 16px 0;
    }

    mat-list-item {
      height: 48px;
      min-height: 48px;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    mat-icon {
      color: rgba(0, 0, 0, 0.54);
    }

    a.active {
      background-color: rgba(0, 0, 0, 0.04);
      border-left: 3px solid #1976d2;
    }

    button {
      width: 100%;
      text-align: left;
    }
  `]
})
export class SidebarComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {}

  logout(): void {
    // Implement logout logic here
    // For now, just navigate to login
    // this.store.dispatch(authActions.logout());
  }
}
