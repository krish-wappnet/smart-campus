import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '@services/api.service';
import { LeaveRequest, UpdateLeaveRequest } from '../../../admin/leave-requests/leave-request.interface';
import { LeaveDialogComponent } from '../leave-dialog/leave-dialog.component';

@Component({
  selector: 'app-manage-leave',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    LeaveDialogComponent
  ],
  template: `
    <div class="container">
      <h2>Leave Requests</h2>
      
      <button
        mat-raised-button
        color="primary"
        (click)="openLeaveDialog()"
        class="add-button"
      >
        <mat-icon>add</mat-icon>
        Request Leave
      </button>

      <table mat-table [dataSource]="leaveRequests" class="mat-elevation-z8">
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
              [matTooltip]="'View Details'"
              (click)="openLeaveDialog(request)"
            >
              <mat-icon>visibility</mat-icon>
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
      padding: 24px;
    }

    h2 {
      margin-bottom: 24px;
    }

    .add-button {
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
export class ManageLeaveComponent implements OnInit {
  displayedColumns: string[] = ['dates', 'reason', 'status', 'substitute', 'actions'];
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
          substituteName: request.substituteId ? request.substituteName : 'Not assigned'
        }));
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading leave requests:', error);
        this.loading = false;
      }
    });
  }

  openLeaveDialog(request?: LeaveRequest): void {
    const dialogRef = this.dialog.open(LeaveDialogComponent, {
      width: '500px',
      data: request
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadLeaveRequests();
      }
    });
  }
}
