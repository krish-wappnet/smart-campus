import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-faculty-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class FacultyDashboardComponent implements OnInit {
  totalClasses = 0;
  todayClasses: any[] = [];
  upcomingClasses: any[] = [];
  pendingLeaves: any[] = [];
  recentActivities: any[] = [];
  facultyName = 'Loading...';
  selectedClass: any = null;
  selectedDate: string = '';
  attendanceData: any = null;
  classes: any[] = [];  // For class selection

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Get faculty name
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    this.api.getUserById(token).subscribe({
      next: (user: any) => {
        if (user && user.name) {
          this.facultyName = user.name;
        }
      }
    });

    // Get faculty classes
    this.api.getFacultyClasses().subscribe({
      next: (classes: any) => {
        if (!classes) {
          return;
        }
        this.totalClasses = classes.length;
        this.classes = classes;
        
        const today = new Date();
        this.todayClasses = classes.filter((cls: any) => {
          const classDate = new Date(cls.timeslot.dayOfWeek);
          return classDate.getDay() === today.getDay();
        });

        this.upcomingClasses = classes.filter((cls: any) => {
          const classDate = new Date(cls.timeslot.dayOfWeek);
          return classDate > today;
        });
      },
      error: (error: any) => {
        console.error('Error loading faculty classes:', error);
      }
    });

    // Get pending leave requests
    this.api.getLeaveRequests().subscribe({
      next: (leaves: any) => {
        if (!leaves) {
          return;
        }
        this.pendingLeaves = leaves.filter((leave: any) => leave && leave.status === 'pending');
      }
    });

    // Add mock recent activities data
    this.recentActivities = [
      {
        icon: 'class',
        description: 'Class scheduled',
        time: '10 minutes ago'
      },
      {
        icon: 'event',
        description: 'Leave request submitted',
        time: '30 minutes ago'
      },
      {
        icon: 'assignment',
        description: 'Attendance marked',
        time: '1 hour ago'
      }
    ];
  }

  loadAttendance() {
    if (!this.selectedClass || !this.selectedDate) {
      this.attendanceData = null;
      return;
    }

    this.api.getClassAttendance(this.selectedClass.id, this.selectedDate).subscribe({
      next: (data: any) => {
        this.attendanceData = data;
      },
      error: (error: any) => {
        console.error('Error loading attendance:', error);
        this.attendanceData = null;
      }
    });
  }

  onClassChange(event: any) {
    this.selectedClass = event.value;
    this.loadAttendance();
  }

  onDateChange(event: any) {
    this.selectedDate = event.target.value;
    this.loadAttendance();
  }
}