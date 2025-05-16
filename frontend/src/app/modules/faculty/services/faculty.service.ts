import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

interface DashboardData {
  totalClasses: number;
  totalStudents: number;
  upcomingClasses: any[];
  recentAttendance: any[];
}

interface ClassSchedule {
  id: string;
  subject: string;
  teacherName: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private apiUrl = `${environment.apiUrl}/faculty`;

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`).pipe(
      map(response => response as DashboardData)
    );
  }

  requestLeave(leaveRequest: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/leave-requests`, leaveRequest);
  }

  markAttendance(classId: string, studentId: string, status: 'present' | 'absent'): Observable<any> {
    return this.http.post(`${this.apiUrl}/attendance/${classId}/${studentId}`, { status });
  }

  updateClassSchedule(schedule: ClassSchedule[]): Observable<ClassSchedule[]> {
    return this.http.put<ClassSchedule[]>(`${this.apiUrl}/schedule`, schedule);
  }

  getClassSchedule(): Observable<ClassSchedule[]> {
    return this.http.get<any[]>(`${this.apiUrl}/schedule`);
  }

  getLeaveRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leave-requests`);
  }

  getAttendanceStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/attendance/stats`);
  }
}
