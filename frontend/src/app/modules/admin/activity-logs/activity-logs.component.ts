import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Store } from '@ngrx/store';
import { selectActivityLogs } from '../store/admin.selector';
import { adminActions } from '../store/admin.actions';
import { Observable } from 'rxjs';
import { ActivityLog } from '../../../models/activity-log.model';

@Component({
  selector: 'app-activity-logs',
  template: `
    <div class="container">
      <h2>Activity Logs</h2>
      
      <div class="filters">
        <div class="filter-group">
          <label for="type">Type:</label>
          <select id="type" [(ngModel)]="selectedType" (ngModelChange)="filterLogs()">
            <option value="">All Types</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="attendance">Attendance</option>
            <option value="leave">Leave Request</option>
            <option value="timetable">Timetable</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="date">Date Range:</label>
          <input type="date" id="startDate" [(ngModel)]="startDate" (ngModelChange)="filterLogs()">
          <input type="date" id="endDate" [(ngModel)]="endDate" (ngModelChange)="filterLogs()">
        </div>
      </div>

      <div class="logs-container">
        <div class="log-item" *ngFor="let log of filteredLogs$ | async">
          <div class="log-header">
            <span class="timestamp">{{ log.timestamp | date:'medium' }}</span>
            <span class="user">{{ log.user.name }}</span>
          </div>
          <div class="log-content">
            <div class="log-type">
              <i [ngClass]="getIconClass(log.type)"></i>
              <span>{{ log.type }}</span>
            </div>
            <div class="log-message">
              {{ log.message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    h2 {
      color: #333;
      margin-bottom: 30px;
    }
    .filters {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }
    .filter-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    select, input {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }
    .logs-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .log-item {
      background: white;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .log-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      color: #666;
    }
    .timestamp {
      font-size: 0.9em;
    }
    .user {
      font-weight: 500;
    }
    .log-content {
      display: flex;
      gap: 15px;
    }
    .log-type {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 4px;
      background: #f8f9fa;
      flex: 0 0 150px;
    }
    .log-type i {
      font-size: 1.1em;
    }
    .log-message {
      flex: 1;
      color: #333;
    }
    .login { color: #28a745; }
    .logout { color: #dc3545; }
    .attendance { color: #007bff; }
    .leave { color: #ffc107; }
    .timetable { color: #6c757d; }
  `],
  standalone: true,
  imports: [CommonModule, FormsModule] // Add FormsModule
})
export class ActivityLogsComponent implements OnInit {
  filteredLogs$: Observable<ActivityLog[]>;
  selectedType: string = '';
  startDate: string = '';
  endDate: string = '';

  constructor(private store: Store) {
    this.filteredLogs$ = this.store.select(selectActivityLogs);
  }

  ngOnInit() {
    this.loadActivityLogs();
  }

  loadActivityLogs() {
    this.store.dispatch(adminActions.loadActivityLogs());
  }

  filterLogs() {
    // Implement filtering logic based on selectedType, startDate, and endDate
    // This might involve dispatching a new action or transforming filteredLogs$
  }

  getIconClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'login':
        return 'fas fa-sign-in-alt login';
      case 'logout':
        return 'fas fa-sign-out-alt logout';
      case 'attendance':
        return 'fas fa-check-circle attendance';
      case 'leave':
        return 'fas fa-clipboard leave';
      case 'timetable':
        return 'fas fa-calendar-alt timetable';
      default:
        return 'fas fa-info-circle';
    }
  }
}