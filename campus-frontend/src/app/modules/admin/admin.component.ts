import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '@store/auth/auth.selectors';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-admin',
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer mode="side" opened>
        <mat-toolbar color="primary">
          <span>Smart Campus Admin</span>
        </mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="dashboard" routerLinkActive="active">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-list-item routerLink="users" routerLinkActive="active">
            <mat-icon>people</mat-icon>
            <span>Users</span>
          </a>
          <a mat-list-item routerLink="timetable" routerLinkActive="active">
            <mat-icon>schedule</mat-icon>
            <span>Timetable</span>
          </a>
          <a mat-list-item routerLink="attendance" routerLinkActive="active">
            <mat-icon>assignment</mat-icon>
            <span>Attendance</span>
          </a>
          <a mat-list-item routerLink="leave-requests" routerLinkActive="active">
            <mat-icon>event</mat-icon>
            <span>Leave Requests</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button type="button" aria-label="Toggle sidenav" mat-icon-button (click)="drawer.toggle()">
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          <span>Smart Campus Admin</span>
          <span class="spacer"></span>
          <button mat-icon-button (click)="logout()">
            <mat-icon>logout</mat-icon>
          </button>
        </mat-toolbar>

        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 200px;
    }

    .sidenav .mat-toolbar {
      background: inherit;
    }

    .mat-toolbar.mat-primary {
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .spacer {
      flex: 1 1 auto;
    }

    mat-nav-list {
      padding: 16px 0;
    }

    mat-list-item {
      margin: 8px 0;
    }

    mat-list-item:hover {
      background: rgba(0, 0, 0, 0.04);
    }

    mat-list-item.active {
      background: rgba(0, 0, 0, 0.08);
    }

    mat-icon {
      margin-right: 16px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    SidebarComponent
  ]
})
export class AdminComponent {
  isAuthenticated: boolean = false;

  constructor(private store: Store) {
    this.store.select(selectIsAuthenticated).subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
      }
    });
  }

  logout() {
    // Add logout logic here
  }
}
