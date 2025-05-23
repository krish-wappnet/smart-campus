import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError, switchMap, take, tap, map } from 'rxjs';
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

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  markAttendance(qrCode: string, studentId: string): Observable<{ message: string; status: 'PRESENT' | 'LATE' }> {
    console.log('Marking attendance with QR code for student:', studentId);
    
    const handleQRCodeData = (qrCodeData: any) => {
      // Ensure the QR code data has the required fields
      if (!qrCodeData.token || !qrCodeData.classId || !qrCodeData.expiresAt) {
        console.error('QR code missing required fields:', qrCodeData);
        return throwError(() => new Error('Invalid QR code: Missing required fields'));
      }
      
      // Create the payload in the format expected by the backend
      const payload = {
        qrCode: JSON.stringify({
          token: qrCodeData.token,
          classId: qrCodeData.classId,
          expiresAt: qrCodeData.expiresAt
        }),
        studentId
      };
      
      console.log('Sending attendance payload:', payload);
      
      return this.http.post<{ message: string; status: 'PRESENT' | 'LATE' }>(
        `${environment.apiUrl}/attendance/mark`,
        payload,
        { 
          headers: { 'Content-Type': 'application/json' } 
        }
      ).pipe(
        tap((response) => console.log('Attendance marked successfully:', response)),
        catchError(error => {
          console.error('Error marking attendance:', error);
          // Return a more user-friendly error message
          let errorMessage = 'Failed to mark attendance. Please try again.';
          if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          return throwError(() => new Error(errorMessage));
        })
      );
    };
    
    // First, check if it's a data URL
    if (qrCode.startsWith('data:image/')) {
      // Extract the base64 part of the data URL
      const base64Data = qrCode.split(',')[1];
      if (!base64Data) {
        console.error('Invalid QR code data URL format');
        return throwError(() => new Error('Invalid QR code format'));
      }
      
      try {
        // Decode the base64 data
        const qrCodeJson = atob(base64Data);
        const qrCodeData = JSON.parse(qrCodeJson);
        return handleQRCodeData(qrCodeData);
      } catch (parseError) {
        console.error('Error parsing QR code data:', parseError);
        return throwError(() => new Error('Invalid QR code format'));
      }
    } else {
      // If it's not a data URL, try to parse it directly as JSON
      try {
        const qrCodeData = JSON.parse(qrCode);
        return handleQRCodeData(qrCodeData);
      } catch (parseError) {
        console.error('Error parsing QR code data:', parseError);
        return throwError(() => new Error('Invalid QR code format'));
      }
    }
  }

  generateQrCode(classId: string): Observable<{ qrCode: string; expiresAt: Date }> {
    return this.http.post<{ qrCode: string; expiresAt: string }>(
      `${this.apiUrl}/${classId}/generate-qrcode`,
      { duration: 15 } // 15 minutes duration for the QR code
    ).pipe(
      tap(response => {
        console.log('QR code generated:', response);
        
        // Verify the QR code contains the required data
        if (response.qrCode) {
          try {
            // If it's a data URL, extract and parse the data
            if (response.qrCode.startsWith('data:image/')) {
              const base64Data = response.qrCode.split(',')[1];
              if (base64Data) {
                const qrCodeJson = atob(base64Data);
                const qrCodeData = JSON.parse(qrCodeJson);
                console.log('QR code data:', qrCodeData);
                
                // Verify required fields
                if (!qrCodeData.token || !qrCodeData.classId || !qrCodeData.expiresAt) {
                  console.warn('Generated QR code is missing required fields');
                }
              }
            }
          } catch (error) {
            console.warn('Error verifying QR code data:', error);
          }
        }
      }),
      map(response => ({
        qrCode: response.qrCode,
        expiresAt: new Date(response.expiresAt)
      })),
      catchError(error => {
        console.error('Error generating QR code:', error);
        // Return a more user-friendly error message
        let errorMessage = 'Failed to generate QR code. Please try again.';
        if (error?.error?.message) {
          errorMessage = error.error.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        return throwError(() => new Error(errorMessage));
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
