import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Role } from '../core/models/role.enum';
import { LeaveRequest } from '../models/leave-request.model';

export interface DashboardData {
  totalUsers: number;
  totalClasses: number;
  totalRooms: number;
  pendingLeaves: number;
  recentActivities: {
    id: string;
    type: string;
    description: string;
    time: Date;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: Date;
  updatedAt: Date;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  capacity: number;
  teacherId: string;
  teacherName: string;
  department: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  building: string;
  floor: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Timeslot {
  id: string;
  startTime: string;
  endTime: string;
  day: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  type: string;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`).pipe(
      catchError(this.handleError)
    );
  }

  // Users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      catchError(this.handleError)
    );
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(id: string, changes: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, changes).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Classes
  getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(`${this.apiUrl}/classes`).pipe(
      catchError(this.handleError)
    );
  }

  addClass(classData: Class): Observable<Class> {
    return this.http.post<Class>(`${this.apiUrl}/classes`, classData).pipe(
      catchError(this.handleError)
    );
  }

  updateClass(id: string, changes: Partial<Class>): Observable<Class> {
    return this.http.put<Class>(`${this.apiUrl}/classes/${id}`, changes).pipe(
      catchError(this.handleError)
    );
  }

  deleteClass(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/classes/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Rooms
  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/rooms`).pipe(
      catchError(this.handleError)
    );
  }

  addRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/rooms`, room).pipe(
      catchError(this.handleError)
    );
  }

  updateRoom(id: string, changes: Partial<Room>): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/rooms/${id}`, changes).pipe(
      catchError(this.handleError)
    );
  }

  deleteRoom(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/rooms/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Timeslots
  getTimeslots(): Observable<Timeslot[]> {
    return this.http.get<Timeslot[]>(`${this.apiUrl}/timeslots`).pipe(
      catchError(this.handleError)
    );
  }

  addTimeslot(timeslot: Timeslot): Observable<Timeslot> {
    return this.http.post<Timeslot>(`${this.apiUrl}/timeslots`, timeslot).pipe(
      catchError(this.handleError)
    );
  }

  updateTimeslot(id: string, changes: Partial<Timeslot>): Observable<Timeslot> {
    return this.http.put<Timeslot>(`${this.apiUrl}/timeslots/${id}`, changes).pipe(
      catchError(this.handleError)
    );
  }

  deleteTimeslot(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/timeslots/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Timetable
  getTimetable(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/timetable`).pipe(
      catchError(this.handleError)
    );
  }

  // Leave Requests
  getLeaveRequests(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/leave-requests`).pipe(
      catchError(this.handleError)
    );
  }

  approveLeaveRequest(leaveRequest: LeaveRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/leave-requests/${leaveRequest.id}/approve`, {}).pipe(
      catchError(this.handleError)
    );
  }

  rejectLeaveRequest(leaveRequest: LeaveRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/leave-requests/${leaveRequest.id}/reject`, { 
      reason: leaveRequest.rejectionReason 
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Attendance Reports
  getAttendanceReports(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/attendance/reports`).pipe(
      catchError(this.handleError)
    );
  }

  // Activity Logs
  getActivityLogs(): Observable<ActivityLog[]> {
    return this.http.get<ActivityLog[]>(`${this.apiUrl}/activity-logs`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Admin service error:', error);
    return throwError(() => error);
  }
}
