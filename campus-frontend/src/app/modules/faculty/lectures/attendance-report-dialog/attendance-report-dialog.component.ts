import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

// Define the interface for the attendance data
interface AttendanceRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused'; // Assuming possible statuses
  biometricData: any | null; // Adjust type if biometric data structure is known
  student: {
    id: string;
    createdAt: string;
    updatedAt: string;
    email: string;
    password?: string; // Password might not be included in this payload, make it optional
    role: string;
    name: string;
  };
}

@Component({
  selector: 'app-attendance-report-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './attendance-report-dialog.component.html',
  styleUrls: ['./attendance-report-dialog.component.scss']
})
export class AttendanceReportDialogComponent implements OnInit {
  displayedColumns: string[] = ['studentName', 'date', 'status'];
  dataSource = new MatTableDataSource<AttendanceRecord>([]);
  classId: string;

  constructor(
    public dialogRef: MatDialogRef<AttendanceReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { attendanceData: AttendanceRecord[], classId: string }
  ) {
    this.classId = data.classId;
  }

  ngOnInit(): void {
    if (this.data?.attendanceData) {
      this.dataSource.data = this.data.attendanceData;
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'present':
        return 'primary'; // Or a custom class for green
      case 'absent':
        return 'warn'; // Or a custom class for red
      case 'late':
        return 'accent'; // Or a custom class for orange/yellow
      case 'excused':
        return '#757575'; // Or a custom class for gray
      default:
        return '';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
} 