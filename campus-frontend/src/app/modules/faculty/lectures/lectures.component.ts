import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Subscription, timer, of, forkJoin } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

import { QrCodeDialogComponent } from './qr-code-dialog/qr-code-dialog.component';
import { AttendanceReportDialogComponent } from './attendance-report-dialog/attendance-report-dialog.component';

interface FacultyClass {
  id: string;
  name: string;
  courseCode: string;
  facultyId: string;
  roomId: string;
  timeslotId: string;
  lectureStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  currentQrCode: string | null;
  qrCodeExpiresAt: string | null;
  faculty: {
    id: string;
    name: string;
    email: string;
  };
  room: {
    id: string;
    name: string;
    capacity: number;
  };
  timeslot: {
    id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  };
  __enrollments__: Array<{
    id: string;
    studentId: string;
    classId: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

@Component({
  selector: 'app-faculty-lectures',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSnackBarModule,
    HttpClientModule
  ],
  templateUrl: './lectures.component.html',
  styleUrls: ['./lectures.component.scss']
})
export class LecturesComponent implements OnInit, OnDestroy {
  classes: FacultyClass[] = [];
  loading = true;
  error: string | null = null;
  private apiUrl = 'http://localhost:3000';
  private classesUrl = 'http://localhost:3000/classes';
  private subscriptions = new Subscription();

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  loadClasses(): void {
    this.loading = true;
    this.http.get<FacultyClass[]>(`${this.classesUrl}/faculty`, {
      headers: this.getAuthHeaders()
    })
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (classes) => {
          this.classes = classes;
        },
        error: (error) => {
          console.error('Error loading classes:', error);
          this.snackBar.open('Failed to load classes. Please try again.', 'Dismiss', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  startLecture(classId: string): void {
    const classToUpdate = this.classes.find(c => c.id === classId);
    if (!classToUpdate) return;

    this.http.post<{ qrCode: string; expiresAt: string }>(
      `${this.classesUrl}/${classId}/start-lecture`,
      { duration: 15 },
      { headers: this.getAuthHeaders() }
    ).subscribe({
      next: (response) => {
        const expiresAt = new Date(response.expiresAt);
        this.updateClassStatus(classId, 'IN_PROGRESS', response.qrCode, expiresAt);
        this.setupQrCodeRefresh(classId);
        
        // Show QR code dialog
        this.showQrCodeDialog(response.qrCode, expiresAt);
        
        this.snackBar.open('Lecture started successfully!', 'Dismiss', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error starting lecture:', error);
        this.snackBar.open(
          error.error?.message || 'Failed to start lecture. Please try again.',
          'Dismiss',
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  endLecture(classId: string): void {
    const classToUpdate = this.classes.find(c => c.id === classId);
    if (!classToUpdate) return;

    this.http.post(
      `${this.classesUrl}/${classId}/end-lecture`,
      {},
      { headers: this.getAuthHeaders() }
    ).subscribe({
      next: () => {
        this.updateClassStatus(classId, 'COMPLETED');
        this.snackBar.open('Lecture ended successfully!', 'Dismiss', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error ending lecture:', error);
        this.snackBar.open(
          error.error?.message || 'Failed to end lecture. Please try again.',
          'Dismiss',
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  private setupQrCodeRefresh(classId: string): void {
    const classToUpdate = this.classes.find(c => c.id === classId);
    if (!classToUpdate || !classToUpdate.qrCodeExpiresAt) return;
    
    // Refresh 5 minutes before expiration
    const timeUntilRefresh = new Date(classToUpdate.qrCodeExpiresAt).getTime() - Date.now() - (5 * 60 * 1000);
    
    if (timeUntilRefresh > 0) {
      const refreshSub = timer(timeUntilRefresh).pipe(
        switchMap(() => this.http.post<{ qrCode: string; expiresAt: string }>(
          `${this.classesUrl}/${classId}/start-lecture`,
          { duration: 15 },
          { headers: this.getAuthHeaders() }
        ))
      ).subscribe({
        next: (response) => {
          if (response) {
            const expiresAt = new Date(response.expiresAt);
            this.updateClassStatus(
              classId,
              'IN_PROGRESS',
              response.qrCode,
              expiresAt
            );
            this.setupQrCodeRefresh(classId);
          }
        },
        error: (error) => {
          console.error('Error refreshing QR code:', error);
          this.updateClassStatus(classId, 'COMPLETED');
        }
      });
      
      this.subscriptions.add(refreshSub);
    }
  }

  private updateClassStatus(
    classId: string,
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED',
    qrCode?: string,
    expiresAt?: Date
  ) {
    const classToUpdate = this.classes.find(c => c.id === classId);
    if (classToUpdate) {
      classToUpdate.lectureStatus = status;
      classToUpdate.currentQrCode = qrCode || null;
      classToUpdate.qrCodeExpiresAt = expiresAt?.toISOString() || null;
    }
  }

  private showQrCodeDialog(qrCode: string, expiresAt: Date) {
    this.dialog.open(QrCodeDialogComponent, {
      data: { qrCode, expiresAt },
      width: '400px',
      disableClose: true
    });
  }

  getTimeRemainingPercentage(expiresAt: string | null): number {
    if (!expiresAt) return 0;
    const now = new Date().getTime();
    const end = new Date(expiresAt).getTime();
    const start = end - (15 * 60 * 1000); // 15 minutes before end
    const total = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }

  viewAttendanceReport(classId: string): void {
    console.log(`Fetching attendance report for class ID: ${classId}`);
    const url = `${this.apiUrl}/attendance/class/${classId}`;

    this.http.get<any>(url, { headers: this.getAuthHeaders() }).subscribe({
      next: (report) => {
        console.log('Attendance Report:', report);
        this.dialog.open(AttendanceReportDialogComponent, {
          width: '600px',
          data: { attendanceData: report, classId: classId }
        });
      },
      error: (error) => {
        console.error('Error fetching attendance report:', error);
        this.snackBar.open(
          error.error?.message || 'Failed to fetch attendance report. Please try again.',
          'Dismiss',
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }
}
