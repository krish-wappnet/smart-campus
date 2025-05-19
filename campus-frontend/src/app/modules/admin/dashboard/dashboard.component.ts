import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '@services/api.service';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty' | 'student';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalUsers = 0;
  totalStudents = 0;
  totalFaculty = 0;
  totalAdmins = 0;
  recentActivities: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Add API calls to load dashboard data
    this.apiService.getUsers().subscribe({
      next: (users: User[]) => {
        this.totalUsers = users.length;
        this.totalStudents = users.filter((u: User) => u.role === 'student').length;
        this.totalFaculty = users.filter((u: User) => u.role === 'faculty').length;
        this.totalAdmins = users.filter((u: User) => u.role === 'admin').length;
      },
      error: (error: any) => {
        console.error('Error loading dashboard data:', error);
      }
    });

    // Add mock recent activities data
    this.recentActivities = [
      {
        icon: 'person_add',
        description: 'New user registered',
        time: '10 minutes ago'
      },
      {
        icon: 'edit',
        description: 'User profile updated',
        time: '30 minutes ago'
      },
      {
        icon: 'assignment',
        description: 'Attendance marked',
        time: '1 hour ago'
      }
    ];
  }
}
