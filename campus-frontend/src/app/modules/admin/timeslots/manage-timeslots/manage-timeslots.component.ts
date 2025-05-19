import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '@services/api.service';

import { Timeslot } from '../timeslot.interface';
import { AddTimeslotComponent } from '../add-timeslot/add-timeslot.component';

@Component({
  selector: 'app-manage-timeslots',
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
    AddTimeslotComponent
  ],
  template: `
    <div class="manage-timeslots-container">
      <div class="header">
        <h2>Manage Timeslots</h2>
        <button
          mat-raised-button
          color="primary"
          (click)="openAddTimeslotDialog()"
          class="add-button"
        >
          <mat-icon>add</mat-icon>
          Add Timeslot
        </button>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="timeslots" class="mat-elevation-z8">
          <ng-container matColumnDef="dayOfWeek">
            <th mat-header-cell *matHeaderCellDef>Day</th>
            <td mat-cell *matCellDef="let timeslot">
              {{ timeslot.dayOfWeek.charAt(0).toUpperCase() + timeslot.dayOfWeek.slice(1) }}
            </td>
          </ng-container>

          <ng-container matColumnDef="startTime">
            <th mat-header-cell *matHeaderCellDef>Start Time</th>
            <td mat-cell *matCellDef="let timeslot">{{ timeslot.startTime }}</td>
          </ng-container>

          <ng-container matColumnDef="endTime">
            <th mat-header-cell *matHeaderCellDef>End Time</th>
            <td mat-cell *matCellDef="let timeslot">{{ timeslot.endTime }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let timeslot">
              <button
                mat-icon-button
                [matTooltip]="'Delete timeslot'"
                (click)="deleteTimeslot(timeslot)"
              >
                <mat-icon>delete</mat-icon>
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
      </div>
    </div>
  `,
  styles: [`
    .manage-timeslots-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .add-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    table {
      width: 100%;
    }

    th.mat-header-cell {
      font-weight: 600;
      color: rgba(0, 0, 0, 0.87);
    }

    td.mat-cell {
      padding: 16px;
    }

    button.mat-icon-button {
      margin: 0 4px;
    }

    mat-paginator {
      padding: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
    }
  `]
})
export class ManageTimeslotsComponent implements OnInit {
  displayedColumns: string[] = ['dayOfWeek', 'startTime', 'endTime', 'actions'];
  timeslots: Timeslot[] = [];

  constructor(
    private api: ApiService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTimeslots();
  }

  loadTimeslots(): void {
    this.api.getTimeslots().subscribe({
      next: (data: Timeslot[]) => {
        this.timeslots = data;
      },
      error: (error: any) => {
        console.error('Error loading timeslots:', error);
      }
    });
  }

  openAddTimeslotDialog(): void {
    const dialogRef = this.dialog.open(AddTimeslotComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTimeslots();
      }
    });
  }

  deleteTimeslot(timeslot: Timeslot): void {
    if (!timeslot.id) {
      console.error('Timeslot ID is required');
      return;
    }

    if (confirm(`Are you sure you want to delete timeslot on ${timeslot.dayOfWeek}?`)) {
      this.api.deleteTimeslot(timeslot.id).subscribe({
        next: () => {
          this.loadTimeslots();
        },
        error: (error: any) => {
          console.error('Error deleting timeslot:', error);
        }
      });
    }
  }
}
