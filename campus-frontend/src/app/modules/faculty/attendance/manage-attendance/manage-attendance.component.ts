import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-manage-attendance',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="container">
      <h2>Attendance Management</h2>
      
      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Select Class</mat-label>
          <mat-select [(value)]="selectedClass" (selectionChange)="loadStudents()">
            <mat-option *ngFor="let cls of classes" [value]="cls.id">
              {{ cls.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Select Date</mat-label>
          <input matInput [matDatepicker]="picker" [(ngModel)]="selectedDate" (dateChange)="loadAttendance()">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </div>

      <div class="student-list" *ngIf="students.length > 0">
        <h3>Students in Class</h3>
        <mat-selection-list>
          <mat-list-option *ngFor="let student of students">
            {{ student.name }}
          </mat-list-option>
        </mat-selection-list>
      </div>

      <table mat-table [dataSource]="attendance" class="mat-elevation-z8">
        <ng-container matColumnDef="studentName">
          <th mat-header-cell *matHeaderCellDef>Student Name</th>
          <td mat-cell *matCellDef="let student">{{ student.name }}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let student">
            <mat-form-field appearance="outline" class="status-field">
              <mat-label>Status</mat-label>
              <mat-select [(value)]="student.status">
                <mat-option value="present">Present</mat-option>
                <mat-option value="absent">Absent</mat-option>
                <mat-option value="late">Late</mat-option>
              </mat-select>
            </mat-form-field>
          </td>
        </ng-container>

        <ng-container matColumnDef="remarks">
          <th mat-header-cell *matHeaderCellDef>Remarks</th>
          <td mat-cell *matCellDef="let student">
            <mat-form-field appearance="outline" class="remarks-field">
              <mat-label>Remarks</mat-label>
              <input matInput [(ngModel)]="student.remarks">
            </mat-form-field>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>

      <mat-paginator
        [pageSizeOptions]="[5, 10, 25, 100]"
        showFirstLastButtons
      ></mat-paginator>

      <button
        mat-raised-button
        color="primary"
        (click)="saveAttendance()"
        class="save-button"
        [disabled]="isSaving"
      >
        <span *ngIf="!isSaving">Save Attendance</span>
        <span *ngIf="isSaving">
          <mat-progress-spinner
            mode="indeterminate"
            diameter="20"
            strokeWidth="2"
            color="accent"
          ></mat-progress-spinner>
          Saving...
        </span>
      </button>
    </div>
  `,
  styles: [`
    .container {
      padding: 24px;
      background: #f8f9fa;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h2 {
      color: #333;
      margin-bottom: 32px;
      text-align: center;
    }

    .filters {
      display: flex;
      gap: 24px;
      margin-bottom: 32px;
      justify-content: center;
    }

    .student-list {
      margin: 24px 0;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .student-list h3 {
      color: #4a4a4a;
      margin-bottom: 16px;
    }

    mat-form-field {
      width: 100%;
      max-width: 350px;
    }

    table {
      width: 100%;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .status-field,
    .remarks-field {
      width: 100%;
      max-width: 250px;
    }

    .save-button {
      margin-top: 32px;
      display: block;
      width: 200px;
      margin-left: auto;
      margin-right: auto;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: 500;
      background: #1976d2 !important;
      color: white !important;
      border-radius: 6px;
      border: none;
      transition: all 0.2s ease;
    }

    .save-button:hover {
      background: #1557b0 !important;
      transform: translateY(-1px);
    }

    .save-button:active {
      transform: translateY(0);
    }

    .save-button[disabled] {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .save-button .mat-spinner {
      margin-right: 8px;
    }

    .mat-paginator {
      margin-top: 24px;
      padding: 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .mat-form-field-appearance-outline .mat-form-field-wrapper {
      margin-bottom: 0;
    }

    .mat-selection-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .mat-list-option {
      padding: 12px 16px;
    }

    .mat-list-option.mat-selected {
      background: #e3f2fd;
    }

    .mat-list-option:hover {
      background: #f1f8ff;
    }

    .mat-header-row {
      background: #f8f9fa;
    }

    .mat-row {
      transition: background-color 0.2s ease;
    }

    .mat-row:hover {
      background: #f8f9fa;
    }
  `]
})
export class ManageAttendanceComponent {
  displayedColumns: string[] = ['studentName', 'status', 'remarks'];
  attendance: any[] = [];
  classes: any[] = [];
  students: any[] = [];
  selectedClass: string = '';
  selectedDate: Date = new Date();
  isSaving: boolean = false;

  constructor(private api: ApiService) {
    this.loadClasses();
  }

  loadStudents(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.api.getUsers().subscribe({
        next: (data: any) => {
          // Filter students (assuming role is 'student')
          this.students = data.filter((user: { role: string; }) => user.role === 'student');
        },
        error: (error: any) => {
          console.error('Error loading students:', error);
        }
      });
    }
  }

  loadClasses(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.api.getFacultyClasses().subscribe({
        next: (data: any) => {
          this.classes = data;
        },
        error: (error: any) => {
          console.error('Error loading classes:', error);
        }
      });
    }
  }

  loadAttendance(): void {
    if (!this.selectedClass) return;

    const token = localStorage.getItem('auth_token');
    if (token) {
      this.api.getClassAttendance(this.selectedClass, this.selectedDate.toISOString().split('T')[0]).subscribe({
        next: (data: any) => {
          // Get existing attendance records for selected class and date
          const existingAttendance = data.filter((item: any) => 
            item.classId === this.selectedClass && 
            new Date(item.date).toDateString() === new Date(this.selectedDate).toDateString()
          );

          // Initialize attendance array with all students
          this.attendance = this.students.map(student => ({
            id: student.id,
            name: student.name,
            status: existingAttendance.find((att: any) => att.studentId === student.id)?.status || 'present',
            remarks: existingAttendance.find((att: any) => att.studentId === student.id)?.remarks || ''
          }));
        },
        error: (error: any) => {
          console.error('Error loading attendance:', error);
          // Initialize with all students if no attendance data exists
          this.attendance = this.students.map(student => ({
            id: student.id,
            name: student.name,
            status: 'present',
            remarks: ''
          }));
        }
      });
    }
  }

  saveAttendance(): void {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Authentication token not found');
      return;
    }

    // Validate attendance data
    const invalidRecords = this.attendance.filter(student => 
      !student.id || !student.status || !['present', 'absent', 'late'].includes(student.status)
    );

    if (invalidRecords.length > 0) {
      alert('Please ensure all students have valid IDs and status (present/absent/late)');
      return;
    }

    this.isSaving = true;

    const attendanceData = {
      classId: this.selectedClass,
      date: this.selectedDate.toISOString().split('T')[0],
      students: this.attendance.map(student => ({
        studentId: student.id,
        status: student.status,
        remarks: student.remarks || ''
      }))
    };

    this.api.markAttendance(attendanceData).subscribe({
      next: () => {
        this.isSaving = false;
        alert('Attendance saved successfully');
        this.loadAttendance(); // Refresh the attendance list
      },
      error: (error: any) => {
        this.isSaving = false;
        console.error('Error saving attendance:', error);
        alert('Error saving attendance');
      }
    });
  }
  }

