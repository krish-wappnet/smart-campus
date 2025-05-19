import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

import { StudentClass } from '../../../shared/types';

interface HeatmapData {
  date: string;
  count: number;
  active: boolean;
  color: string;
}

interface CalendarDay {
  day: number;
  active: boolean;
  events?: any[];
}

interface CalendarData {
  month: string;
  year: number;
  days: CalendarDay[];
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatMenuModule
  ],
  styles: [':host { display: block; }'],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  studentName: string = '';
  totalClasses: number = 0;
  todayClasses: StudentClass[] = [];
  allClasses: StudentClass[] = [];
  attendanceHistory: any[] = [];
  attendancePercentage: number = 0;
  activityLogs: any[] = [];
  heatmapData: HeatmapData[] = [];
  calendarData: CalendarData = {
    month: '',
    year: 0,
    days: []
  };
  announcements: any[] = [];
  months: string[] = [];
  selectedMonth: string = '';
  selectedDay: string = 'all';
  isLoading: boolean = true;

  constructor(
    private api: ApiService,
    private router: Router
  ) {
    // Check authentication
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load student info
    this.api.getStudentProfile().subscribe({
      next: (data: any) => {
        this.studentName = data.name;
        this.totalClasses = data.totalClasses;
      },
      error: (error: any) => {
        console.error('Error loading student profile:', error);
      }
    });

    // Load all classes
    this.api.getStudentClasses().subscribe({
      next: (data: StudentClass[]) => {
        this.allClasses = data;
        // Filter classes for today based on timeslot dayOfWeek
        const today = new Date();
        const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today.getDay()];
        this.todayClasses = data.filter(classItem => 
          classItem.timeslot.dayOfWeek === dayOfWeek
        );
      },
      error: (error: any) => {
        console.error('Error loading classes:', error);
      }
    });

    // Load attendance history
    this.api.getStudentAttendance().subscribe({
      next: (data: any) => {
        this.attendanceHistory = data.history;
        this.attendancePercentage = data.percentage;
      },
      error: (error: any) => {
        console.error('Error loading attendance history:', error);
      }
    });

    // Load activity logs
    this.api.getStudentActivityLogs().subscribe({
      next: (data: any) => {
        this.activityLogs = data;
      },
      error: (error: any) => {
        console.error('Error loading activity logs:', error);
      }
    });

    // Load heatmap data
    this.api.getActivityHeatmap().subscribe({
      next: (data: HeatmapData[]) => {
        this.heatmapData = data;
      },
      error: (error: any) => {
        console.error('Error loading heatmap data:', error);
      }
    });

    // Load calendar data
    this.api.getActivityCalendar().subscribe({
      next: (data: CalendarData) => {
        this.calendarData = data;
      },
      error: (error: any) => {
        console.error('Error loading calendar data:', error);
      }
    });

    // Load announcements
    this.api.getAnnouncements().subscribe({
      next: (data: any) => {
        this.announcements = data;
      },
      error: (error: any) => {
        console.error('Error loading announcements:', error);
      }
    });

    // Initialize months
    this.months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];

    this.isLoading = false;
  }

  private isToday(date: string): boolean {
    const today = new Date();
    const classDate = new Date(date);
    return today.getDate() === classDate.getDate() &&
           today.getMonth() === classDate.getMonth() &&
           today.getFullYear() === classDate.getFullYear();
  }

  private getDayOfWeek(date: string): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dateObj = new Date(date);
    return days[dateObj.getDay()];
  }

  filterClassesByDay(): StudentClass[] {
    if (this.selectedDay === 'all') {
      return this.allClasses;
    }
    return this.allClasses.filter((classItem: StudentClass) => {
      return classItem.timeslot.dayOfWeek === this.selectedDay;
    });
  }

  viewClassDetails(classItem: StudentClass): void {
    // TODO: Implement class details view
    console.log('Viewing details for class:', classItem);
  }

  downloadMaterials(classItem: StudentClass): void {
    // TODO: Implement materials download
    console.log('Downloading materials for class:', classItem);
  }
}      
 