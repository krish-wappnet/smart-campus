import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '@environments/environment';
import { catchError, map } from 'rxjs/operators';

export interface StudentClass {
  id: string;
  name: string;
  courseCode: string;
  facultyId: string;
  roomId: string;
  timeslotId: string;
  // Add other properties as needed
}

export interface Lecture {
  id: string;
  classId: string;
  startTime: string;
  endTime: string;
  qrCode?: string;
  expiresAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClassApiService {
  private apiUrl = `${environment.apiUrl}/classes`;

  constructor(private http: HttpClient) {}

  // Get all classes for the current faculty member
  getFacultyClasses(): Observable<StudentClass[]> {
    return this.http.get<StudentClass[]>(`${this.apiUrl}/faculty/me`).pipe(
      catchError(error => {
        console.error('Error fetching faculty classes:', error);
        return of([]);
      })
    );
  }

  // Start a lecture and get QR code
  startLecture(classId: string): Observable<{ qrCode: string; expiresAt: string }> {
    return this.http.post<{ qrCode: string; expiresAt: string }>(
      `${this.apiUrl}/${classId}/start-lecture`,
      {}
    ).pipe(
      catchError(error => {
        console.error('Error starting lecture:', error);
        throw error;
      })
    );
  }

  // End a lecture
  endLecture(classId: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${classId}/end-lecture`,
      {}
    ).pipe(
      catchError(error => {
        console.error('Error ending lecture:', error);
        throw error;
      })
    );
  }

  // Get active lecture details
  getActiveLecture(classId: string): Observable<{ qrCode: string; expiresAt: string } | null> {
    return this.http.get<{ qrCode: string; expiresAt: string } | null>(
      `${this.apiUrl}/${classId}/active-lecture`
    ).pipe(
      catchError(() => of(null)) // Return null if no active lecture
    );
  }
  
  // Get class by ID
  getClassById(classId: string): Observable<StudentClass | null> {
    return this.http.get<StudentClass>(`${this.apiUrl}/${classId}`).pipe(
      catchError(() => of(null))
    );
  }
  
  // Get upcoming lectures for a class
  getUpcomingLectures(classId: string): Observable<Lecture[]> {
    return this.http.get<Lecture[]>(`${this.apiUrl}/${classId}/lectures/upcoming`).pipe(
      catchError(() => of([]))
    );
  }
  
  // Get past lectures for a class
  getPastLectures(classId: string, limit: number = 10): Observable<Lecture[]> {
    return this.http.get<Lecture[]>(`${this.apiUrl}/${classId}/lectures/past`, {
      params: { limit: limit.toString() }
    }).pipe(
      catchError(() => of([]))
    );
  }
}
