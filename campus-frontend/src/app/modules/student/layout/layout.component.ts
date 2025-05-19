import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StudentSidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, StudentSidebarComponent],
  template: `
    <app-student-sidebar>
      <router-outlet></router-outlet>
    </app-student-sidebar>
  `
})
export class StudentLayoutComponent { }
