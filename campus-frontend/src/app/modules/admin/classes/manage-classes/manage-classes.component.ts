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
import { ApiService } from '@services/api.service';

import { Class } from '../class.interface';
import { AddClassComponent } from '../add-class/add-class.component';

@Component({
  selector: 'app-manage-classes',
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
    AddClassComponent
  ],
  template: `
    <div class="manage-classes-container">
      <div class="header">
        <h2>Manage Classes</h2>
        <button
          mat-raised-button
          color="primary"
          (click)="openAddClassDialog()"
          class="add-button"
        >
          <mat-icon>add</mat-icon>
          Add Class
        </button>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="classes" class="mat-elevation-z8">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Class Name</th>
            <td mat-cell *matCellDef="let class">{{ class.name }}</td>
          </ng-container>

          <ng-container matColumnDef="facultyName">
            <th mat-header-cell *matHeaderCellDef>Faculty Name</th>
            <td mat-cell *matCellDef="let class">{{ class.faculty?.name }}</td>
          </ng-container>

          <ng-container matColumnDef="facultyEmail">
            <th mat-header-cell *matHeaderCellDef>Faculty Email</th>
            <td mat-cell *matCellDef="let class">{{ class.faculty?.email }}</td>
          </ng-container>

          <ng-container matColumnDef="roomName">
            <th mat-header-cell *matHeaderCellDef>Room</th>
            <td mat-cell *matCellDef="let class">{{ class.room?.name }}</td>
          </ng-container>

          <ng-container matColumnDef="timeslot">
            <th mat-header-cell *matHeaderCellDef>Timeslot</th>
            <td mat-cell *matCellDef="let class">
              {{ class.timeslot?.dayOfWeek.charAt(0).toUpperCase() + class.timeslot?.dayOfWeek.slice(1) }} -
              {{ class.timeslot?.startTime }} to {{ class.timeslot?.endTime }}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let class">
              <button
                mat-icon-button
                [matTooltip]="'Delete class'"
                (click)="deleteClass(class)"
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

        <div *ngIf="loading" class="loading-spinner">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading classes...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .manage-classes-container {
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

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 24px;
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
export class ManageClassesComponent implements OnInit {
  displayedColumns: string[] = ['name', 'facultyName', 'facultyEmail', 'roomName', 'timeslot', 'actions'];
  classes: any[] = [];
  loading: boolean = true;

  constructor(
    private api: ApiService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.loading = true;
    this.api.getClasses().subscribe({
      next: (data: any) => {
        this.classes = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading classes:', error);
        this.loading = false;
      }
    });
  }

  openAddClassDialog(): void {
    const dialogRef = this.dialog.open(AddClassComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClasses();
      }
    });
  }

  deleteClass(classData: any): void {
    if (!classData.id) {
      console.error('Class ID is required');
      return;
    }

    if (confirm(`Are you sure you want to delete class ${classData.name}?`)) {
      this.api.deleteClass(classData.id).subscribe({
        next: () => {
          this.loadClasses();
        },
        error: (error: any) => {
          console.error('Error deleting class:', error);
        }
      });
    }
  }
}
