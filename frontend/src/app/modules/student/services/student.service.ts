import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  requestLeave(leaveRequest: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/leave-requests`, leaveRequest);
  }

  markAttendance(classId: string, status: 'present' | 'absent'): Observable<any> {
    return this.http.post(`${this.apiUrl}/attendance/${classId}`, { status });
  }

  getAttendanceHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/attendance`);
  }

  getLeaveRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/leave-requests`);
  }
}
