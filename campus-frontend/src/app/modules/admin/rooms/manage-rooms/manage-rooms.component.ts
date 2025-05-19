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

import { Room } from '../room.interface';
import { AddRoomComponent } from '../add-room/add-room.component';

@Component({
  selector: 'app-manage-rooms',
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
    AddRoomComponent
  ],
  template: `
    <div class="manage-rooms-container">
      <div class="header">
        <h2>Manage Rooms</h2>
        <button
          mat-raised-button
          color="primary"
          (click)="openAddRoomDialog()"
          class="add-button"
        >
          <mat-icon>add</mat-icon>
          Add Room
        </button>
      </div>

      <div class="table-container">
        <table mat-table [dataSource]="rooms" class="mat-elevation-z8">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let room">{{ room.name }}</td>
          </ng-container>

          <ng-container matColumnDef="capacity">
            <th mat-header-cell *matHeaderCellDef>Capacity</th>
            <td mat-cell *matCellDef="let room">{{ room.capacity }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let room">
              <button
                mat-icon-button
                [matTooltip]="'Delete room'"
                (click)="deleteRoom(room)"
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
    .manage-rooms-container {
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
export class ManageRoomsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'capacity', 'actions'];
  rooms: Room[] = [];

  constructor(
    private api: ApiService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.api.getRooms().subscribe({
      next: (data: Room[]) => {
        this.rooms = data;
      },
      error: (error: any) => {
        console.error('Error loading rooms:', error);
      }
    });
  }

  openAddRoomDialog(): void {
    const dialogRef = this.dialog.open(AddRoomComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRooms();
      }
    });
  }

  deleteRoom(room: Room): void {
    if (!room.id) {
      console.error('Room ID is required');
      return;
    }

    if (confirm(`Are you sure you want to delete room ${room.name}?`)) {
      this.api.deleteRoom(room.id).subscribe({
        next: () => {
          this.loadRooms();
        },
        error: (error: any) => {
          console.error('Error deleting room:', error);
        }
      });
    }
  }
}
