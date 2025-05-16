import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../store/auth/auth.selectors';
import { Observable } from 'rxjs';
import { User } from '../../../store/auth/auth.interface';

@Component({
  selector: 'app-admin-sidebar',
  template: `
    <div class="sidebar-container">
      <div class="user-info">
        <img src="assets/images/default-avatar.png" alt="Profile" class="avatar" />
        <div class="user-details">
          <h3>{{ (user$ | async)?.name || 'Loading...' }}</h3>
          <p>Administrator</p>
        </div>
      </div>

      <nav class="sidebar-nav">
        <a [routerLink]="['/admin/dashboard']" class="nav-item" [class.active]="activeRoute === 'dashboard'">
          <i class="fas fa-home"></i>
          <span>Dashboard</span>
        </a>

        <a [routerLink]="['/admin/users']" class="nav-item" [class.active]="activeRoute === 'users'">
          <i class="fas fa-users"></i>
          <span>Users</span>
        </a>

        <a [routerLink]="['/admin/classes']" class="nav-item" [class.active]="activeRoute === 'classes'">
          <i class="fas fa-chalkboard-teacher"></i>
          <span>Classes</span>
        </a>

        <a [routerLink]="['/admin/rooms']" class="nav-item" [class.active]="activeRoute === 'rooms'">
          <i class="fas fa-door-open"></i>
          <span>Rooms</span>
        </a>

        <a [routerLink]="['/admin/timeslots']" class="nav-item" [class.active]="activeRoute === 'timeslots'">
          <i class="fas fa-clock"></i>
          <span>Timeslots</span>
        </a>

        <a [routerLink]="['/admin/timetable']" class="nav-item" [class.active]="activeRoute === 'timetable'">
          <i class="fas fa-calendar-alt"></i>
          <span>Timetable</span>
        </a>

        <a [routerLink]="['/admin/leave-requests']" class="nav-item" [class.active]="activeRoute === 'leave-requests'">
          <i class="fas fa-clipboard-list"></i>
          <span>Leave Requests</span>
        </a>

        <a [routerLink]="['/admin/attendance']" class="nav-item" [class.active]="activeRoute === 'attendance'">
          <i class="fas fa-check-circle"></i>
          <span>Attendance</span>
        </a>

        <a [routerLink]="['/admin/activity-logs']" class="nav-item" [class.active]="activeRoute === 'activity-logs'">
          <i class="fas fa-history"></i>
          <span>Activity Logs</span>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .sidebar-container {
      width: 250px;
      background: #fff;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
      height: 100vh;
      padding: 20px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 30px;
      padding: 20px;
      border-bottom: 1px solid #eee;
    }

    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-details h3 {
      margin: 0;
      font-size: 1.2rem;
      color: #333;
    }

    .user-details p {
      margin: 5px 0 0;
      color: #666;
      font-size: 0.9rem;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      border-radius: 8px;
      text-decoration: none;
      color: #333;
      transition: all 0.2s ease;
    }

    .nav-item:hover {
      background: #f5f5f5;
      color: #007bff;
    }

    .nav-item.active {
      background: #007bff;
      color: white;
    }

    .nav-item i {
      width: 20px;
      text-align: center;
    }

    .nav-item span {
      font-size: 0.95rem;
    }
  `],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class AdminSidebarComponent implements OnInit {
  @Input() activeRoute: string = '';
  user$: Observable<User | null>;

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit() {}
}
