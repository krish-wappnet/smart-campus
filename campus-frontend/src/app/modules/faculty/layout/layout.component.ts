import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FacultySidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-faculty-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FacultySidebarComponent,
    MatSidenavModule
  ],
  styles: [`
    .faculty-layout {
      display: flex;
      height: 100vh;
      width: 100%;
    }

    .content {
      flex: 1;
      overflow: auto;
      padding: 24px;
      background-color: #f5f5f5;
    }
  `],
  template: `
    <div class="faculty-layout">
      <app-faculty-sidebar></app-faculty-sidebar>
      <div class="content">
        <div class="page-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class FacultyLayoutComponent {}
