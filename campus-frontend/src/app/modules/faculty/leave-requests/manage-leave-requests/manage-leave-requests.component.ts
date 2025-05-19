import { Component, OnInit } from '@angular/core';
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
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ApiService } from '@services/api.service';
import { LeaveRequest } from '../leave-request.interface';

@Component({
  selector: 'app-manage-leave-requests',
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
    ReactiveFormsModule,
    FormsModule
  ],
  template: `
    <div class="container">
      <h2>Leave Requests</h2>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Start Date</mat-label>
          <input matInput [matDatepicker]="startDatePicker" [(ngModel)]="leaveRequest.startDate">
          <mat-datepicker-toggle matSuffix [for]="startDatePicker"></mat-datepicker-toggle>
          <mat-datepicker #startDatePicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>End Date</mat-label>
          <input matInput [matDatepicker]="endDatePicker" [(ngModel)]="leaveRequest.endDate">
          <mat-datepicker-toggle matSuffix [for]="endDatePicker"></mat-datepicker-toggle>
          <mat-datepicker #endDatePicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Reason</mat-label>
          <textarea matInput [(ngModel)]="leaveRequest.reason" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Substitute Faculty</mat-label>
          <mat-select [(ngModel)]="leaveRequest.substituteId">
            <mat-option *ngFor="let faculty of facultyList" [value]="faculty.id">
              {{ faculty.name }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <button
          mat-raised-button
          color="primary"
          (click)="submitLeaveRequest()"
          [disabled]="!canSubmit"
        >
          Submit Leave Request
        </button>
      </div>

      <div class="leave-requests-table">
        <table mat-table [dataSource]="leaveRequests" class="mat-elevation-z8">
          <ng-container matColumnDef="startDate">
            <th mat-header-cell *matHeaderCellDef> Start Date </th>
            <td mat-cell *matCellDef="let element"> {{element.startDate | date}} </td>
          </ng-container>

          <ng-container matColumnDef="endDate">
            <th mat-header-cell *matHeaderCellDef> End Date </th>
            <td mat-cell *matCellDef="let element"> {{element.endDate | date}} </td>
          </ng-container>

          <ng-container matColumnDef="reason">
            <th mat-header-cell *matHeaderCellDef> Reason </th>
            <td mat-cell *matCellDef="let element"> {{element.reason}} </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Status </th>
            <td mat-cell *matCellDef="let element">
              <span [class]="'status-badge ' + element.status">
                {{element.status | titlecase}}
              </span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <mat-paginator [pageSizeOptions]="[5, 10, 25]" showFirstLastButtons></mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 24px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    h2 {
      color: #333;
      margin-bottom: 32px;
      text-align: center;
    }

    .filters {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 32px;
    }

    mat-form-field {
      width: 100%;
    }

    button {
      width: 100%;
      padding: 12px;
      font-size: 16px;
    }

    .leave-requests-table {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.pending {
      background: #ffebee;
      color: #ef5350;
    }

    .status-badge.approved {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status-badge.rejected {
      background: #fff3e0;
      color: #f4511e;
    }
  `]
})
export class ManageLeaveRequestsComponent implements OnInit {
  displayedColumns: string[] = ['startDate', 'endDate', 'reason', 'status'];
  leaveRequests: LeaveRequest[] = [];
  leaveRequest: Partial<LeaveRequest> = {
    startDate: '',
    endDate: '',
    reason: '',
    substituteId: ''
  };
  facultyList: any[] = [];

  constructor(private api: ApiService) {}

  private extractFacultyIdFromToken(token: string): string | null {
    try {
      // Split the token into header, payload, and signature
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      // Decode the payload
      const payload = JSON.parse(atob(parts[1]));
      
      // Return the faculty ID from the sub claim
      return payload.sub || null;
    } catch (error) {
      console.error('Error extracting faculty ID from token:', error);
      return null;
    }
  }

  ngOnInit() {
    this.loadLeaveRequests();
    this.loadFacultyList();
  }

  get canSubmit(): boolean {
    return !!this.leaveRequest.startDate &&
           !!this.leaveRequest.endDate &&
           !!this.leaveRequest.reason;
  }

  loadLeaveRequests(): void {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Authentication token not found');
      return;
    }

    this.api.getLeaveRequestsFaculty().subscribe({
      next: (data: any) => {
        this.leaveRequests = data;
      },
      error: (error: any) => {
        console.error('Error loading leave requests:', error);
        alert('Error loading leave requests');
      }
    });
  }

  loadFacultyList(): void {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Authentication token not found');
      return;
    }

    this.api.getUsers().subscribe({
      next: (data: any) => {
        this.facultyList = data.filter((user: any) => user.role === 'faculty');
      },
      error: (error: any) => {
        console.error('Error loading faculty list:', error);
        alert('Error loading faculty list');
      }
    });
  }

  submitLeaveRequest(): void {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Authentication token not found');
      return;
    }

    // Extract facultyId from token
    const facultyId = this.extractFacultyIdFromToken(token);
    if (!facultyId) {
      alert('Faculty ID not found in token');
      return;
    }

    const leaveRequestData = {
      facultyId,
      startDate: this.leaveRequest.startDate,
      endDate: this.leaveRequest.endDate,
      reason: this.leaveRequest.reason,
      substituteId: this.leaveRequest.substituteId
    };

    this.api.submitLeaveRequest(leaveRequestData).subscribe({
      next: () => {
        alert('Leave request submitted successfully');
        this.leaveRequest = {
          startDate: '',
          endDate: '',
          reason: '',
          substituteId: ''
        };
        this.loadLeaveRequests();
      },
      error: (error: any) => {
        console.error('Error submitting leave request:', error);
        alert('Error submitting leave request');
      }
    });
  }
}
