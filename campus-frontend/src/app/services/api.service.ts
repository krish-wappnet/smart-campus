import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated, selectToken } from '@store/auth/auth.selectors';
import { filter, switchMap, take, catchError } from 'rxjs/operators';
import { StorageService } from '@services/storage.service';
import { authActions } from '@store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;


  private qrCodeRefreshInterval: any;
  private currentQrCode: { code: string; expiresAt: Date } | null = null;
  private isBrowser: boolean = typeof window !== 'undefined';

  constructor(
    private http: HttpClient,
    private store: Store<{ auth: any }>
  ) {
    // No need to initialize from localStorage since it's handled by the login component
  }

  private getToken(): string | null {
    return this.isBrowser ? localStorage.getItem('auth_token') : null;
  }

  private handleError(error: any, fallbackValue: any): Observable<any> {
    console.error('API Error:', error);
    return of(fallbackValue);
  }

  login(email: string, password: string): Observable<{ accessToken: string; user: any }> {
    return this.http.post<{ accessToken: string; user: any }>(`${this.apiUrl}/auth/login`, {
      email,
      password
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  getUsers(): Observable<any[]> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any[]>(`${this.apiUrl}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, []))
    );
  }

  getTimetable(): Observable<any[]> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any[]>(`${this.apiUrl}/timetable`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, []))
    );
  }

  getClassAttendance(classId: string, date: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any>(`${this.apiUrl}/attendance/class/${classId}?date=${date}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  getFacultyClasses(): Observable<any[]> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any[]>(`${this.apiUrl}/classes/faculty`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, []))
    );
  }

  startLecture(classId: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.post<any>(`${this.apiUrl}/lectures/start`, {
      classId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  endLecture(classId: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.post<any>(`${this.apiUrl}/lectures/end`, {
      classId
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  postAttendance(data: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.post<any>(`${this.apiUrl}/attendance`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  getLeaveRequestsFaculty(): Observable<any[]> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any[]>(`${this.apiUrl}/leave-requests/faculty`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, []))
    );
  }

  submitLeaveRequest(data: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.post<any>(`${this.apiUrl}/leave-requests/faculty`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  updateUser(userId: string, userData: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.put<any>(`${this.apiUrl}/users/${userId}`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  deleteUser(userId: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.delete<any>(`${this.apiUrl}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  createUser(userData: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.post<any>(`${this.apiUrl}/users`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  createRoom(roomData: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.post<any>(`${this.apiUrl}/rooms`, roomData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  updateRoom(roomData: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.put<any>(`${this.apiUrl}/rooms/${roomData.id}`, roomData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  getRooms(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any>(`${this.apiUrl}/rooms`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  markAttendance(attendanceData: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.post<any>(`${this.apiUrl}/attendance`, attendanceData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  deleteRoom(roomId: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.delete<any>(`${this.apiUrl}/rooms/${roomId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  createTimeslot(timeslotData: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.post<any>(`${this.apiUrl}/timeslots`, timeslotData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  getTimeslots(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any>(`${this.apiUrl}/timeslots`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  deleteTimeslot(timeslotId: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.delete<any>(`${this.apiUrl}/timeslots/${timeslotId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }


  getClasses(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any>(`${this.apiUrl}/classes`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  createClass(classData: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.post<any>(`${this.apiUrl}/classes`, classData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  deleteClass(classId: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.delete<any>(`${this.apiUrl}/classes/${classId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  // Get faculty users
  getFacultyUsers(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any>(`${this.apiUrl}/users?role=faculty`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  getUserById(userId: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  getStudentProfile(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any>(`${this.apiUrl}/students/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  getStudentAttendance(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any>(`${this.apiUrl}/attendance/student`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }


  getAttendanceHistory(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any>(`${this.apiUrl}/attendance/history`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  getAnnouncements(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any>(`${this.apiUrl}/announcements`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  getStudentActivityLogs(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any>(`${this.apiUrl}/activity-logs/student`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, []))
    );
  }

  getActivityHeatmap(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any>(`${this.apiUrl}/activity-logs/heatmap`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  getActivityCalendar(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any>(`${this.apiUrl}/activity-logs/calendar`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  // Leave Requests
  getLeaveRequests(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any>(`${this.apiUrl}/leave-requests`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  createLeaveRequest(leaveRequest: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.post<any>(`${this.apiUrl}/leave-requests`, leaveRequest, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  updateLeaveRequest(leaveRequestId: string, leaveRequest: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.put<any>(`${this.apiUrl}/leave-requests/${leaveRequestId}`, leaveRequest, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }

  getStudentClasses(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No authentication token available'));
    }
    return this.http.get<any>(`${this.apiUrl}/classes/student`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError(error => this.handleError(error, null))
    );
  }
}
