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
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule
  ],
  template: `
    <div class="container">
      <h2 class="page-title">Leave Requests</h2>

      <mat-card class="filters-card" appearance="outlined">
        <mat-card-content>
          <div class="filters">
            <div class="date-fields">
              <mat-form-field appearance="outline" class="filter-field">
                <mat-label>Start Date</mat-label>
                <input matInput [matDatepicker]="startDatePicker" [(ngModel)]="leaveRequest.startDate">
                <mat-datepicker-toggle matSuffix [for]="startDatePicker"></mat-datepicker-toggle>
                <mat-datepicker #startDatePicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline" class="filter-field">
                <mat-label>End Date</mat-label>
                <input matInput [matDatepicker]="endDatePicker" [(ngModel)]="leaveRequest.endDate">
                <mat-datepicker-toggle matSuffix [for]="endDatePicker"></mat-datepicker-toggle>
                <mat-datepicker #endDatePicker></mat-datepicker>
              </mat-form-field>
            </div>

            <div class="other-fields">
              <mat-form-field appearance="outline" class="filter-field">
                <mat-label>Reason</mat-label>
                <textarea matInput [(ngModel)]="leaveRequest.reason" rows="3"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="filter-field">
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
                class="submit-button"
                (click)="submitLeaveRequest()"
                [disabled]="!canSubmit"
              >
                Submit Leave Request
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="table-card" appearance="outlined">
        <mat-card-content>
          <table mat-table [dataSource]="leaveRequests" class="leave-requests-table">
            <ng-container matColumnDef="startDate">
              <th mat-header-cell *matHeaderCellDef>Start Date</th>
              <td mat-cell *matCellDef="let element">{{element.startDate | date:'mediumDate'}}</td>
            </ng-container>

            <ng-container matColumnDef="endDate">
              <th mat-header-cell *matHeaderCellDef>End Date</th>
              <td mat-cell *matCellDef="let element">{{element.endDate | date:'mediumDate'}}</td>
            </ng-container>

            <ng-container matColumnDef="reason">
              <th mat-header-cell *matHeaderCellDef>Reason</th>
              <td mat-cell *matCellDef="let element">{{element.reason}}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let element">
                <span class="status-badge" [ngClass]="{
                  'pending': element.status === 'pending',
                  'approved': element.status === 'approved',
                  'rejected': element.status === 'rejected'
                }">
                  {{element.status | titlecase}}
                </span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
          </table>

          <mat-paginator
            [pageSizeOptions]="[5, 10, 25]"
            showFirstLastButtons
            class="table-paginator"
          ></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 24px;
      background: #f8f9fa;
    }

    .page-title {
      color: #333;
      margin-bottom: 32px;
      font-size: 24px;
      font-weight: 600;
    }

    .filters-card {
      margin-bottom: 32px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .filters {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .date-fields {
      display: flex;
      gap: 16px;
    }

    .other-fields {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .filter-field {
      flex: 1;
    }

    .submit-button {
      width: 100%;
      margin-top: 16px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .table-card {
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .leave-requests-table {
      width: 100%;
      border-collapse: collapse;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      text-transform: capitalize;
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

    .table-paginator {
      margin-top: 24px;
      display: flex;
      justify-content: center;
    }

    .mat-header-cell {
      font-weight: 600;
      color: #333;
    }

    .mat-cell {
      padding: 16px;
    }

    .mat-row:nth-child(even) {
      background-color: #f8f9fa;
    }

    .mat-form-field-appearance-outline .mat-form-field-outline {
      border-radius: 8px;
    }

    .mat-form-field-wrapper {
      margin-bottom: 0;
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
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      const payload = JSON.parse(atob(parts[1]));
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