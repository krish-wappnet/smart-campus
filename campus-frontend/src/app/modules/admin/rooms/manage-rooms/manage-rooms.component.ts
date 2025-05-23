import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule, FloatLabelType } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
    MatFormFieldModule,
    MatInputModule,
    AddRoomComponent
  ],
  template: `
    <div class="manage-rooms-container">
      <div class="header">
        <div class="header-content">
          <div class="header-text">
            <h2>Room Management</h2>
            <p class="subtitle">Manage all rooms and their capacities</p>
          </div>
          <button
            mat-raised-button
            color="primary"
            (click)="openAddRoomDialog()"
            class="add-button"
          >
            <mat-icon>add</mat-icon>
            Add New Room
          </button>
        </div>
      </div>

      <div class="content-card">
        <div class="table-toolbar">
          <div class="search-container">
            <mat-form-field appearance="outline" [floatLabel]="floatLabel" class="search-field">
              <mat-label>Search rooms</mat-label>
              <input 
                matInput 
                placeholder="Search by room name or capacity" 
                #searchInput
                (keyup)="applyFilter($event)"
                aria-label="Search rooms">
              <button mat-icon-button matSuffix aria-label="Search">
                <mat-icon>search</mat-icon>
              </button>
            </mat-form-field>
          </div>
          <div class="table-actions">
            <button mat-button color="primary" (click)="exportToExcel()">
              <mat-icon>download</mat-icon> Export
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table mat-table [dataSource]="filteredRooms" class="mat-elevation-z1">
            <!-- Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Room Name</th>
              <td mat-cell *matCellDef="let room">
                <div class="room-info">
                  <mat-icon class="room-icon">meeting_room</mat-icon>
                  <div>
                    <div class="room-name">{{ room.name }}</div>
                    <div class="room-id">ID: {{ room.id || 'N/A' }}</div>
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Capacity Column -->
            <ng-container matColumnDef="capacity">
              <th mat-header-cell *matHeaderCellDef>Capacity</th>
              <td mat-cell *matCellDef="let room">
                <div class="capacity-badge">
                  <mat-icon>people</mat-icon>
                  <span>{{ room.capacity || 0 }} <span class="capacity-text">people</span></span>
                </div>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let room">
                <span class="status-badge" [class.available]="isRoomAvailable(room)">
                  {{ isRoomAvailable(room) ? 'Available' : 'In Use' }}
                </span>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let room" class="actions-cell">
                <div class="action-buttons">
                  <button mat-icon-button (click)="editRoom(room)" matTooltip="Edit Room">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteRoom(room)" matTooltip="Delete Room" color="warn">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row 
                *matRowDef="let row; columns: displayedColumns;"
                [class.selected]="selectedRow === row"
                (click)="selectRow(row)">
            </tr>
          </table>
        </div>

        <mat-paginator
          [pageSize]="5"
          [pageSizeOptions]="[5, 10, 25]"
          showFirstLastButtons>
        </mat-paginator>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');
    
    :host {
      --primary-color: #3f51b5;
      --primary-light: #757de8;
      --primary-dark: #002984;
      --accent-color: #ff4081;
      --warn-color: #f44336;
      --success-color: #4caf50;
      --text-primary: rgba(0, 0, 0, 0.87);
      --text-secondary: rgba(0, 0, 0, 0.6);
      --divider-color: rgba(0, 0, 0, 0.12);
      --background: #f5f5f5;
      --card-bg: #ffffff;
    }

    .manage-rooms-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px;
      width: 100%;
      box-sizing: border-box;
      min-height: calc(100vh - 64px);
      background-color: var(--background);
    }

    .header {
      margin-bottom: 24px;
      
      .header-content {
        background: var(--card-bg);
        border-radius: 8px;
        padding: 20px 24px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
      }

      .header-text h2 {
        margin: 0;
        color: var(--text-primary);
        font-size: 24px;
        font-weight: 500;
      }

      .subtitle {
        margin: 4px 0 0;
        color: var(--text-secondary);
        font-size: 14px;
      }

      .add-button {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        border-radius: 4px;
        padding: 0 16px;
        height: 42px;
        
        mat-icon {
          margin-right: 4px;
        }
      }
    }

    .content-card {
      background: var(--card-bg);
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .table-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid var(--divider-color);
      flex-wrap: wrap;
      gap: 16px;
    }

    .search-container {
      flex: 1;
      min-width: 250px;
      max-width: 400px;
      
      .mat-mdc-form-field {
        width: 100%;
        margin: 0;
        font-size: 13px;
        
        .mdc-text-field {
          background-color: #fff;
          border-radius: 20px;
          padding: 0 12px;
          height: 40px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          
          &:hover, &.mdc-text-field--focused {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          .mdc-notched-outline {
            display: none;
          }
          
          .mat-mdc-form-field-infix {
            padding: 4px 0;
            min-height: 32px;
            width: auto;
          }
          
          .mat-mdc-form-field-flex {
            height: 100%;
            padding: 0;
            align-items: center;
          }
          
          .mat-mdc-form-field-icon-suffix {
            padding: 0;
            margin-left: 4px;
            opacity: 0.7;
            transition: opacity 0.2s ease;
            
            &:hover {
              opacity: 1;
            }
            
            button {
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              
              mat-icon {
                font-size: 18px;
                width: 18px;
                height: 18px;
                color: var(--primary-color);
              }
            }
          }
          
          input {
            padding: 4px 0;
            font-size: 13px;
            color: var(--text-primary);
            caret-color: var(--primary-color);
            
            &::placeholder {
              color: var(--text-secondary);
              opacity: 1;
              transition: opacity 0.2s ease;
            }
            
            &:focus::placeholder {
              opacity: 0.7;
            }
          }
          
          .mat-mdc-form-field-label {
            color: var(--text-secondary);
            font-size: 13px;
            padding-left: 8px;
          }
          
          &.mat-mdc-form-field-should-float .mat-mdc-form-field-label {
            display: none;
          }
        }
      }
    }

    .table-actions {
      display: flex;
      gap: 8px;
      
      button {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        font-weight: 500;
        
        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }
    }

    .table-responsive {
      overflow-x: auto;
      
      table {
        width: 100%;
        border-collapse: collapse;
        
        th.mat-header-cell {
          font-weight: 500;
          color: var(--text-secondary);
          font-size: 13px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--divider-color);
          white-space: nowrap;
        }
        
        td.mat-cell {
          padding: 16px;
          border-bottom: 1px solid var(--divider-color);
          vertical-align: middle;
        }
        
        tr.mat-row {
          transition: background-color 0.2s ease;
          
          &:hover {
            background-color: rgba(0, 0, 0, 0.01);
          }
          
          &.selected {
            background-color: rgba(63, 81, 181, 0.08);
          }
        }
      }
    }

    .room-info {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .room-icon {
        color: var(--primary-color);
        background: rgba(63, 81, 181, 0.1);
        border-radius: 50%;
        padding: 8px;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .room-name {
        font-weight: 500;
        color: var(--text-primary);
      }
      
      .room-id {
        font-size: 12px;
        color: var(--text-secondary);
        margin-top: 2px;
      }
    }

    .capacity-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(0, 0, 0, 0.04);
      padding: 6px 12px;
      border-radius: 16px;
      width: fit-content;
      font-size: 13px;
      
      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: var(--text-secondary);
      }
      
      .capacity-text {
        color: var(--text-secondary);
        font-size: 12px;
      }
    }

    .status-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      
      &.available {
        background-color: rgba(76, 175, 80, 0.1);
        color: #2e7d32;
      }
      
      &:not(.available) {
        background-color: rgba(255, 152, 0, 0.1);
        color: #ef6c00;
      }
    }

    .actions-cell {
      white-space: nowrap;
      
      .action-buttons {
        display: flex;
        gap: 4px;
        
        button {
          width: 32px;
          height: 32px;
          line-height: 32px;
          
          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }
        }
      }
    }

    mat-paginator {
      border-top: 1px solid var(--divider-color);
      background: transparent;
      
      ::ng-deep .mat-mdc-paginator-container {
        padding: 8px 16px;
        min-height: 56px;
      }
      
      ::ng-deep .mat-mdc-paginator-page-size {
        margin-right: 0;
      }
    }
  `]
})
export class ManageRoomsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  displayedColumns: string[] = ['name', 'capacity', 'status', 'actions'];
  rooms: Room[] = [];
  filteredRooms = new MatTableDataSource<Room>([]);
  selectedRow: Room | null = null;
  floatLabel: FloatLabelType = 'auto';
  searchTerm = '';

  constructor(
    private api: ApiService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.api.getRooms().subscribe({
      next: (data: Room[]) => {
        this.rooms = data;
        this.filteredRooms.data = [...this.rooms];
        this.filteredRooms.paginator = this.paginator;
        this.filteredRooms.sort = this.sort;
      },
      error: (error: any) => {
        console.error('Error loading rooms:', error);
        this.showError('Failed to load rooms. Please try again.');
      }
    });
  }
  
  ngAfterViewInit() {
    this.filteredRooms.paginator = this.paginator;
    this.filteredRooms.sort = this.sort;
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredRooms.filter = filterValue.trim().toLowerCase();
    
    if (this.filteredRooms.paginator) {
      this.filteredRooms.paginator.firstPage();
    }
  }
  
  isRoomAvailable(room: Room): boolean {
    // Implement your room availability logic here
    // This is a placeholder - replace with actual logic
    return Math.random() > 0.5;
  }
  
  selectRow(row: Room) {
    this.selectedRow = this.selectedRow === row ? null : row;
  }
  
  editRoom(room: Room) {
    // Implement edit functionality
    console.log('Edit room:', room);
  }
  
  exportToExcel() {
    // Implement export to Excel functionality
    console.log('Exporting rooms to Excel');
  }
  
  private showError(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
  
  private showSuccess(message: string) {
    this.snackBar.open(message, 'Dismiss', {
      duration: 3000,
      panelClass: ['success-snackbar']
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
