import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAttendanceReports, selectClasses } from '../store/admin.selectors';
import { adminActions } from '../store/admin.actions';
import { Observable } from 'rxjs';
import { AttendanceReport } from '../../../models/attendance-report.model';
import { Class } from '../../../models/class.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-attendance-reports',
  template: `
    <div class="container">
      <h2>Attendance Reports</h2>
      
      <div class="filters">
        <div class="filter-group">
          <label for="class">Class:</label>
          <select id="class" [(ngModel)]="selectedClass">
            <option value="">All Classes</option>
            <option *ngFor="let cls of classes$ | async" [value]="cls.id">{{ cls.name }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="date">Date:</label>
          <input type="date" id="date" [(ngModel)]="selectedDate">
        </div>
      </div>

      <div class="reports-container">
        <div class="report-card" *ngFor="let report of filteredReports$ | async">
          <div class="report-header">
            <h3>{{ report.className }}</h3>
            <span class="date">{{ report.date | date }}</span>
          </div>
          <div class="report-content">
            <div class="attendance-stats">
              <div class="stat-item">
                <span class="label">Total Students:</span>
                <span class="value">{{ report.totalStudents }}</span>
              </div>
              <div class="stat-item">
                <span class="label">Present:</span>
                <span class="value">{{ report.present }}</span>
              </div>
              <div class="stat-item">
                <span class="label">Absent:</span>
                <span class="value">{{ report.absent }}</span>
              </div>
            </div>
            <div class="attendance-list">
              <div class="student-item" *ngFor="let student of report.students">
                <span class="student-name">{{ student.name }}</span>
                <span class="status" [class.absent]="!student.isPresent">{{ student.isPresent ? 'Present' : 'Absent' }}</span>
              </div>
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

    .reports-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .report-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .report-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .date {
      color: #666;
      font-size: 0.9em;
    }

    .attendance-stats {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .stat-item {
      text-align: center;
      flex: 1;
    }

    .label {
      color: #666;
      display: block;
      margin-bottom: 5px;
    }

    .value {
      font-weight: bold;
      font-size: 1.2em;
    }

    .attendance-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .student-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }

    .student-name {
      color: #333;
    }

    .status {
      padding: 5px 10px;
      border-radius: 4px;
      font-weight: bold;
    }

    .absent {
      background: #ffebee;
      color: #c62828;
    }

    .present {
      background: #e8f5e9;
      color: #2e7d32;
    }
  `],
  standalone: true,
  imports: [CommonModule,FormsModule]
})
export class AttendanceReportsComponent implements OnInit {
  filteredReports$: Observable<AttendanceReport[]>;
  selectedClass: string = '';
  selectedDate: string = '';
  classes$: Observable<Class[]> = new Observable();

  constructor(private store: Store) {
    this.classes$ = store.select(selectClasses);
    this.filteredReports$ = store.select(selectAttendanceReports);
  }

  ngOnInit(): void {
    this.store.dispatch(adminActions.loadAttendanceReports());
  }
}
