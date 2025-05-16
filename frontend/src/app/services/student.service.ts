import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface DashboardData {
  attendancePercentage: number;
  upcomingClasses: any[];
  leaveRequests: any[];
}

interface LeaveRequest {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface AttendanceRecord {
  classId: string;
  status: 'present' | 'absent';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = '/api/students';

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`);
  }

  requestLeave(leaveRequest: LeaveRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/leave`, leaveRequest);
  }

  getAttendanceHistory(): Observable<AttendanceRecord[]> {
    return this.http.get<AttendanceRecord[]>(`${this.apiUrl}/attendance`);
  }

  getUpcomingClasses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/schedule`);
  }

  markAttendance(classId: string, status: 'present' | 'absent'): Observable<any> {
    return this.http.post(`${this.apiUrl}/attendance/${classId}`, { status });
  }
}
