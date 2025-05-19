import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-faculty-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterModule,
    Router
  ],
  template: `
    <mat-sidenav #sidenav mode="side" opened>
        <mat-toolbar color="primary" class="sidenav-header">
          <span>Faculty Dashboard</span>
        </mat-toolbar>
        
        <div class="nav-content">
          <mat-nav-list>
            <a mat-list-item routerLink="/faculty/dashboard" routerLinkActive="active">
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
            </a>

            <a mat-list-item routerLink="/faculty/lectures" routerLinkActive="active">
              <mat-icon>live_tv</mat-icon>
              <span>My Lectures</span>
            </a>

            <a mat-list-item routerLink="/faculty/classes" routerLinkActive="active">
              <mat-icon>class</mat-icon>
              <span>Manage Classes</span>
            </a>

            <a mat-list-item routerLink="/faculty/attendance" routerLinkActive="active">
              <mat-icon>assignment</mat-icon>
              <span>Manage Attendance</span>
            </a>

            <a mat-list-item routerLink="/faculty/leave" routerLinkActive="active">
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
  `,
  styles: [`
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
    }

    mat-list-item:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    mat-list-item.active {
      background-color: rgba(25, 118, 210, 0.1);
    }

    mat-icon {
      color: rgba(0, 0, 0, 0.54);
      margin-right: 16px;
    }

    button {
      width: 100%;
      justify-content: flex-start;
    }

    .mat-mdc-list-item-content {
      padding: 0 16px !important;
    }

    .mat-mdc-list-item-text {
      margin-left: 16px !important;
    }

    .mat-mdc-button {
      height: 48px;
    }
  `]
})
export class FacultySidebarComponent {
  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/auth/login']);
  }
}
