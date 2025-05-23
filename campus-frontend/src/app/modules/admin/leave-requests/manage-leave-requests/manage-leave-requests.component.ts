import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '@services/api.service';
import { LeaveRequest, UpdateLeaveRequest } from '../leave-request.interface';
import { UpdateLeaveDialogComponent } from '../update-leave-dialog/update-leave-dialog.component';

@Component({
  selector: 'app-manage-leave-requests',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    UpdateLeaveDialogComponent
  ],
  template: `
    <div class="container">
      <h2>Leave Requests</h2>
      
      <table mat-table [dataSource]="leaveRequests" class="mat-elevation-z8">
        <ng-container matColumnDef="facultyName">
          <th mat-header-cell *matHeaderCellDef>Faculty</th>
          <td mat-cell *matCellDef="let request">
            {{ request.facultyName || 'Loading...' }}
          </td>
        </ng-container>

        <ng-container matColumnDef="dates">
          <th mat-header-cell *matHeaderCellDef>Dates</th>
          <td mat-cell *matCellDef="let request">
            {{ request.startDate }} to {{ request.endDate }}
          </td>
        </ng-container>

        <ng-container matColumnDef="reason">
          <th mat-header-cell *matHeaderCellDef>Reason</th>
          <td mat-cell *matCellDef="let request">{{ request.reason }}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let request">
            <span [class]="'status-badge ' + request.status">
              {{ request.status.charAt(0).toUpperCase() + request.status.slice(1) }}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="substitute">
          <th mat-header-cell *matHeaderCellDef>Substitute</th>
          <td mat-cell *matCellDef="let request">
            {{ request.substituteName || 'Not assigned' }}
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let request">
            <button
              mat-icon-button
              [matTooltip]="'Update leave request'"
              (click)="openUpdateDialog(request)"
            >
              <mat-icon>edit</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>

      <mat-paginator
        [pageSizeOptions]="[5, 10, 25, 100]"
        showFirstLastButtons
      ></mat-paginator>

      <div *ngIf="loading" class="loading-spinner">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Loading leave requests...</p>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px;
      width: 100%;
      box-sizing: border-box;
    }

    h2 {
      margin-bottom: 24px;
    }

    table {
      width: 100%;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.pending {
      background-color: #ffd700;
      color: #000;
    }

    .status-badge.approved {
      background-color: #4caf50;
      color: #fff;
    }

    .status-badge.rejected {
      background-color: #f44336;
      color: #fff;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      gap: 16px;
    }

    .loading-spinner p {
      color: rgba(0, 0, 0, 0.54);
    }
  `]
})
export class ManageLeaveRequestsComponent implements OnInit {
  displayedColumns: string[] = ['facultyName', 'dates', 'reason', 'status', 'substitute', 'actions'];
  leaveRequests: LeaveRequest[] = [];
  loading: boolean = true;

  constructor(
    private api: ApiService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadLeaveRequests();
  }

  loadLeaveRequests(): void {
    this.loading = true;
    this.api.getLeaveRequests().subscribe({
      next: (data: any) => {
        this.leaveRequests = data.map((request: any) => ({
          ...request,
          facultyName: 'Loading...', // Will be fetched from faculty ID
          substituteName: request.substituteId ? 'Loading...' : 'Not assigned'
        }));
        this.loadFacultyNames();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading leave requests:', error);
        this.loading = false;
      }
    });
  }

  loadFacultyNames(): void {
    this.leaveRequests.forEach((request: any) => {
      this.api.getUserById(request.facultyId).subscribe({
        next: (faculty: any) => {
          request.facultyName = faculty.name;
          if (request.substituteId) {
            this.api.getUserById(request.substituteId).subscribe({
              next: (substitute: any) => {
                request.substituteName = substitute.name;
              }
            });
          }
        }
      });
    });
  }

  openUpdateDialog(request: LeaveRequest): void {
    const dialogRef = this.dialog.open(UpdateLeaveDialogComponent, {
      width: '500px',
      data: request
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.updateLeaveRequest(request.id, result).subscribe({
          next: () => {
            this.loadLeaveRequests();
          },
          error: (error: any) => {
            console.error('Error updating leave request:', error);
          }
        });
      }
    });
  }
}
