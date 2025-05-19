import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

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
    RouterModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" opened>
        <mat-toolbar color="primary" class="sidenav-header">
          <span>Smart Campus Faculty</span>
        </mat-toolbar>
        
        <div class="nav-content">
          <mat-nav-list>
            <a mat-list-item routerLink="/faculty/dashboard" routerLinkActive="active">
              <mat-icon>dashboard</mat-icon>
              <span>Dashboard</span>
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

      <mat-sidenav-content>
        <ng-content></ng-content>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    mat-sidenav {
      width: 250px;
      box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
      height: 100%;
      background-color: white;
      border-radius: 0 !important;
    }

    .sidenav-header {
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      background-color: #1976d2;
      color: white;
      border-radius: 0 !important;
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

    mat-list-item {
      display: flex;
      align-items: center;
      gap: 16px;
      height: 48px;
      border-radius: 0 !important;
    }

    mat-icon {
      color: rgba(0, 0, 0, 0.54);
    }

    .active {
      background-color: rgba(0, 0, 0, 0.04);
      border-radius: 0 !important;
    }

    .mat-mdc-list-item {
      height: 48px;
      border-radius: 0 !important;
    }

    button {
      width: 100%;
      text-align: left;
      border-radius: 0 !important;
    }

    .mat-mdc-list-item.active {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .mat-mdc-button {
      height: 48px;
    }
  `]
})
export class FacultySidebarComponent {
  logout(): void {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  }
}
