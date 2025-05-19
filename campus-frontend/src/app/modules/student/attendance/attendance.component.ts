import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="attendance-container">
      <mat-card class="attendance-card">
        <mat-card-title>Attendance History</mat-card-title>
        
        <mat-card-content>
          <div class="filters">
            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Select Month</mat-label>
              <mat-select [(value)]="selectedMonth">
                <mat-option *ngFor="let month of months" [value]="month">
                  {{ month }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-field">
              <mat-label>Select Year</mat-label>
              <mat-select [(value)]="selectedYear">
                <mat-option *ngFor="let year of years" [value]="year">
                  {{ year }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>

          <div class="attendance-stats">
            <div class="stat-item">
              <mat-icon>assignment</mat-icon>
              <span class="stat-value">{{ totalClasses }}</span>
              <span class="stat-label">Total Classes</span>
            </div>

            <div class="stat-item">
              <mat-icon>check_circle</mat-icon>
              <span class="stat-value">{{ presentClasses }}</span>
              <span class="stat-label">Present</span>
            </div>

            <div class="stat-item">
              <mat-icon>remove_circle</mat-icon>
              <span class="stat-value">{{ absentClasses }}</span>
              <span class="stat-label">Absent</span>
            </div>

            <div class="stat-item">
              <mat-icon>percent</mat-icon>
              <span class="stat-value">{{ attendancePercentage }}%</span>
              <span class="stat-label">Attendance</span>
            </div>
          </div>

          <mat-card class="attendance-table">
            <mat-card-content>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Class</th>
                    <th>Room</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let record of attendanceHistory">
                    <td>{{ record.date | date:'mediumDate' }}</td>
                    <td>{{ record.className }}</td>
                    <td>{{ record.room }}</td>
                    <td>
                      <span [class]="record.status === 'present' ? 'present' : 'absent'">
                        {{ record.status | titlecase }}
                      </span>
                    </td>
                    <td>{{ record.time }}</td>
                  </tr>
                </tbody>
              </table>
            </mat-card-content>
          </mat-card>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .attendance-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .attendance-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .filter-field {
      flex: 1;
    }

    .attendance-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .stat-item {
      background: #f8f9fa;
      padding: 16px;
      border-radius: 8px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .stat-item mat-icon {
      font-size: 24px;
      color: #666;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #2196f3;
    }

    .stat-label {
      color: #666;
      font-size: 14px;
    }

    .attendance-table {
      margin-top: 24px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    th {
      background: #f8f9fa;
      font-weight: 500;
      color: #333;
    }

    .present {
      color: #4caf50;
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 4px;
      background: rgba(76, 175, 80, 0.1);
    }

    .absent {
      color: #f44336;
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 4px;
      background: rgba(244, 67, 54, 0.1);
    }

    @media (max-width: 768px) {
      .attendance-stats {
        grid-template-columns: 1fr;
      }

      .filters {
        flex-direction: column;
      }
    }
  `]
})
export class StudentAttendanceComponent implements OnInit {
  selectedMonth = '';
  selectedYear = '';
  months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
  years: number[] = [];
  attendanceHistory: any[] = [];
  totalClasses = 0;
  presentClasses = 0;
  absentClasses = 0;
  attendancePercentage = 0;

  constructor(private api: ApiService) {
    // Initialize years for the last 5 years
    const currentYear = new Date().getFullYear();
    this.years = Array.from({length: 5}, (_, i) => currentYear - i);
  }

  ngOnInit() {
    this.loadAttendanceData();
  }

  loadAttendanceData() {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    this.api.getStudentAttendance().subscribe({
      next: (attendance: any) => {
        this.attendanceHistory = attendance.history;
        this.totalClasses = attendance.totalClasses;
        this.presentClasses = attendance.presentClasses;
        this.absentClasses = attendance.absentClasses;
        this.attendancePercentage = attendance.percentage;
      },
      error: (error: any) => {
        console.error('Error loading attendance:', error);
      }
    });
  }
}
