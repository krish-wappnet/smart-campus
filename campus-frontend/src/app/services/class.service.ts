import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError, switchMap, take, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { User } from '../store/auth/auth.interface';

export interface IClass {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description?: string;
  facultyId: string;
  faculty?: {
    id: string;
    name: string;
    email?: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  roomId: string;
  room?: {
    id: string;
    name: string;
    capacity?: number;
    createdAt?: string;
    updatedAt?: string;
  };
  timeslotId: string;
  timeslot?: {
    id: string;
    startTime: string;
    endTime: string;
    dayOfWeek: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = `${environment.apiUrl}/classes`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    console.log('ClassService initialized with API URL:', this.apiUrl);
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }

  getAllClasses(): Observable<IClass[]> {
    console.log('Fetching all classes from:', this.apiUrl);
    return this.http.get<IClass[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  enrollInClass(classId: string): Observable<any> {
    console.log('Enroll in class initiated for class ID:', classId);
    
    // Log authentication state
    console.log('Current localStorage state:', {
      auth_token: !!localStorage.getItem('auth_token'),
      token: !!localStorage.getItem('token'),
      user: localStorage.getItem('user')
    });
    
    // Get current user synchronously
    const user = this.authService.getCurrentUser();
    console.log('Current user from auth service:', user);
    
    if (!user || !user.id) {
      console.error('No user or user ID found. Auth state:', {
        hasUser: !!user,
        hasUserId: user?.id ? 'yes' : 'no',
        authServiceState: this.authService // Log the entire auth service state
      });
      return throwError(() => new Error('User not authenticated'));
    }
    
    const payload = { 
      classId,
      studentId: user.id 
    };
    
    console.log('Sending enrollment request with payload:', payload);
    return this.http.post(`${this.apiUrl}/enroll`, payload).pipe(
      tap(response => console.log('Enrollment successful:', response)),
      catchError(error => {
        console.error('Enrollment error:', error);
        return throwError(() => error);
      })
    );
  }

  getStudentClasses(): Observable<IClass[]> {
    console.log('Fetching enrolled classes for student from:', `${this.apiUrl}/student`);
    return this.http.get<IClass[]>(`${this.apiUrl}/student`).pipe(
      tap(classes => console.log('Fetched enrolled classes:', classes)),
      catchError(this.handleError)
    );
  }

  markAttendance(classId: string): Observable<any> {
    const user = this.authService.getCurrentUser();
    if (!user || !user.id) {
      return throwError(() => new Error('User not authenticated'));
    }

    return this.http.post(`${this.apiUrl}/${classId}/attendance`, {
      studentId: user.id,
      status: 'PRESENT',
      date: new Date().toISOString()
    }).pipe(
      tap(() => console.log('Attendance marked successfully')),
      catchError(error => {
        console.error('Error marking attendance:', error);
        return throwError(() => error);
      })
    );
  }

  unenrollFromClass(classId: string): Observable<void> {
    console.log('Unenrolling from class:', classId);
    
    // Get current user synchronously
    const user = this.authService.getCurrentUser();
    console.log('Current user from auth service (unenroll):', user);
    
    if (!user || !user.id) {
      console.error('No user or user ID found for unenrollment');
      return throwError(() => new Error('User not authenticated'));
    }
    
    console.log('Sending unenrollment request for student:', user.id);
    return this.http.delete<void>(`${this.apiUrl}/enroll/${classId}`, {
      params: { studentId: user.id }
    }).pipe(
      tap(() => console.log('Unenrollment successful')),
      catchError(error => {
        console.error('Unenrollment error:', error);
        return throwError(() => error);
      })
    );
  }
}
