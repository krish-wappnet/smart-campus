import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule, DatePipe } from '@angular/common';
import { ClassService } from '../../../services/class.service';
import { AuthService } from '../../../services/auth.service';
import { forkJoin } from 'rxjs';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { QrCodeDialogComponent, QrCodeDialogData } from './qr-code-dialog.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subscription, timer } from 'rxjs';
import { finalize } from 'rxjs/operators';
import * as QRCode from 'qrcode';


declare module 'qrcode' {
  export function toDataURL(
    text: string,
    options: any,
    callback: (err: Error | null, url: string | undefined) => void
  ): void;
}

export interface IClass {
  id: string;
  name: string;
  facultyId: string;
  faculty?: {
    id: string;
    name: string;
  };
  roomId: string;
  room?: {
    id: string;
    name: string;
    capacity?: number;
  };
  timeslotId: string;
  timeslot?: {
    id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  };
  startTime?: string;
  endTime?: string;
  facultyName?: string;
  roomName?: string;
  dayOfWeek?: string;
  enrolledStudents?: any[];
  maxCapacity?: number;
  currentEnrollment?: number;
  isEnrollmentFull?: boolean;
  isEnrollmentOpen?: boolean;
  enrollmentStartDate?: string;
  enrollmentEndDate?: string;
  description?: string;
  credits?: number;
  department?: string;
  section?: string;
  location?: string;
  instructor?: string;
  status?: string;
  isActive?: boolean;
  currentQrCode?: string | null;
  qrCodeExpiresAt?: string | null;
  __enrollments__?: Array<{
    id: string;
    studentId: string;
    classId: string;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  lectureStatus?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

@Component({
  selector: 'app-class-enrollment',
  templateUrl: './class-enrollment.component.html',
  styleUrls: ['./class-enrollment.component.scss', './class-enrollment.styles.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DatePipe,
    MatDialogModule,
    MatSnackBarModule,
    HttpClientModule
  ],
  providers: [DatePipe]
})
export class ClassEnrollmentComponent implements OnInit, OnDestroy {
  classes: IClass[] = [];
  enrolledClasses: IClass[] = [];
  isLoading = false;
  hasError = false;
  errorMessage = '';
  today = new Date().toISOString().split('T')[0];
  attendanceStatus: { [key: string]: boolean } = {};
  private apiUrl = 'http://localhost:3000';
  private classesUrl = 'http://localhost:3000/classes';
  private subscriptions = new Subscription();

  constructor(
    private classService: ClassService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private http: HttpClient
  ) {}

  // Helper method to check if QR code is expired
  isQrCodeExpired(expiryDate: string | null | undefined): boolean {
    if (!expiryDate) return true;
    return new Date() > new Date(expiryDate);
  }

  // Format the expiry date for display
  formatExpiryDate(expiryDate: string | null | undefined): string {
    if (!expiryDate) return 'Attendance closed';
    
    const date = new Date(expiryDate);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return `Attendance open until ${this.datePipe.transform(date, 'shortTime')}`;
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

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  loadData(): void {
    this.isLoading = true;
    this.hasError = false;
  
    forkJoin([
      this.classService.getStudentClasses(),
      this.classService.getAllClasses(),
    ]).subscribe({
      next: ([enrolledClasses, allClasses]: [IClass[], IClass[]]) => {
        console.log('Enrolled classes:', enrolledClasses);
        console.log('All classes:', allClasses);
  
        // Process enrolled classes
        this.enrolledClasses = enrolledClasses.map((cls) =>
          this.ensureCompleteClassData(cls)
        );
  
        // Process all classes and mark enrolled ones
        this.classes = allClasses.map((cls) => {
          const isEnrolled = this.enrolledClasses.some((ec) => ec.id === cls.id);
          return {
            ...this.ensureCompleteClassData(cls),
            isEnrolled,
            // Add isActive status from the API
            isActive: cls.isActive,
            currentQrCode: cls.currentQrCode,
            qrCodeExpiresAt: cls.qrCodeExpiresAt
          };
        });
  
        console.log('Final enrolled classes:', this.enrolledClasses);
        console.log('Final classes with attendance data:', this.classes);
  
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading data:', error);
        this.hasError = true;
        this.errorMessage = 'Failed to load class data. Please try again later.';
        this.isLoading = false;
        this.snackBar.open(this.errorMessage, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
  
  // Helper method to ensure class data has the complete structure
  private ensureCompleteClassData(cls: IClass): IClass {
    const processedClass: IClass = { ...cls };
  
    // Log the class data for debugging
    console.log('Processing class:', processedClass);
  
    // Handle faculty data
    if (!processedClass.faculty && processedClass.facultyId) {
      processedClass.faculty = {
        id: processedClass.facultyId,
        name: processedClass.facultyName || `Faculty ${processedClass.facultyId.substring(0, 4)}`,
      };
    }
  
    // Handle room data
    if (!processedClass.room && processedClass.roomId) {
      processedClass.room = {
        id: processedClass.roomId,
        name: processedClass.roomName || `Room ${processedClass.roomId.substring(0, 4)}`,
      };
    }
  
    // Handle timeslot data
    if (!processedClass.timeslot && processedClass.timeslotId) {
      processedClass.timeslot = {
        id: processedClass.timeslotId,
        startTime: processedClass.startTime || '09:00',
        endTime: processedClass.endTime || '10:00',
        dayOfWeek: processedClass.dayOfWeek || 'Monday',
      };
    }
  
    // Fallback for missing fields
    processedClass.name = processedClass.name || 'Unnamed Class';
    processedClass.faculty = processedClass.faculty || {
      id: processedClass.facultyId || 'N/A',
      name: 'Unknown Faculty',
    };
    processedClass.room = processedClass.room || {
      id: processedClass.roomId || 'N/A',
      name: 'Room Not Assigned',
    };
    processedClass.timeslot = processedClass.timeslot || {
      id: processedClass.timeslotId || 'N/A',
      startTime: '09:00',
      endTime: '10:00',
      dayOfWeek: 'Monday',
    };
  
    // Log the processed class data
    console.log('Processed class:', processedClass);
  
    return processedClass;
  }

  refreshData(): void {
    this.loadData();
  }

  isEnrolled(classId: string): boolean {
    return this.enrolledClasses.some(c => c.id === classId);
  }

  formatTime(timeString: string): string {
    if (!timeString) return '--:--';
    
    // Handle various time string formats
    try {
      // Try to parse as ISO time string (HH:MM:SS)
      if (/^\d{1,2}:\d{2}(?::\d{2})?$/.test(timeString)) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
        return this.datePipe.transform(date, 'shortTime') || '--:--';
      }
      
      // Try to parse as Date string
      const date = new Date(timeString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return this.datePipe.transform(date, 'shortTime') || '--:--';
    } catch (error) {
      console.warn('Error formatting time:', timeString, error);
      return '--:--';
    }
  }

  openQrDialog(classId: string, qrCode: string) {
    this.dialog.open(QrCodeDialogComponent, {
      width: '350px',
      data: {
        classId,
        qrCode
      } as QrCodeDialogData,
      disableClose: true
    });
  }

  toggleEnrollment(classId: string): void {
    if (!classId) {
      console.error('No class ID provided for enrollment toggle');
      return;
    }

    const isEnrolled = this.isEnrolled(classId);
    this.isLoading = true;

    const request$ = isEnrolled 
      ? this.classService.unenrollFromClass(classId)
      : this.classService.enrollInClass(classId);

    request$.subscribe({
      next: () => {
        const message = isEnrolled 
          ? 'Successfully unenrolled from class' 
          : 'Successfully enrolled in class';
        
        this.snackBar.open(message, 'Close', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        
        // Refresh the data to reflect changes
        this.loadData();
      },
      error: (error: any) => {
        console.error(`Error ${isEnrolled ? 'un' : ''}enrolling:`, error);
        this.snackBar.open(
          `Failed to ${isEnrolled ? 'unenroll from' : 'enroll in'} class. Please try again.`, 
          'Close', 
          { 
            duration: 3000,
            panelClass: ['error-snackbar']
          }
        );
        this.isLoading = false;
      }
    });
  }
}
