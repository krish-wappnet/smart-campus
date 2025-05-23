import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class StudentAttendanceComponent implements OnInit {
  attendanceHistory: any[] = [];
  totalClasses = 0;
  presentClasses = 0;
  absentClasses = 0;
  lateClasses = 0;
  attendancePercentage = 0;
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  years: number[] = [];
  selectedMonth = '';
  selectedYear = '';
  isLoading = true;

  constructor(private http: HttpClient) {
    // Initialize years for the last 5 years
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  }

  ngOnInit() {
    this.fetchAttendance();
  }

  fetchAttendance() {
    this.isLoading = true;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>('http://localhost:3000/attendance/student', { headers }).subscribe({
      next: (data) => {
        this.attendanceHistory = data;
        this.processStats();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.attendanceHistory = [];
      }
    });
  }

  processStats() {
    this.totalClasses = this.attendanceHistory.length;
    this.presentClasses = this.attendanceHistory.filter(a => a.status === 'present' || a.status === 'PRESENT').length;
    this.absentClasses = this.attendanceHistory.filter(a => a.status === 'absent' || a.status === 'ABSENT').length;
    this.lateClasses = this.attendanceHistory.filter(a => a.status === 'late' || a.status === 'LATE').length;
    this.attendancePercentage = this.totalClasses > 0 ? Math.round((this.presentClasses / this.totalClasses) * 100) : 0;
  }

  get filteredHistory() {
    return this.attendanceHistory.filter(record => {
      const date = new Date(record.date);
      const monthMatch = this.selectedMonth ? date.toLocaleString('default', { month: 'long' }) === this.selectedMonth : true;
      const yearMatch = this.selectedYear ? date.getFullYear().toString() === this.selectedYear : true;
      return monthMatch && yearMatch;
    });
  }
}
