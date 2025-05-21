import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@services/api.service';
import { Class } from '../class.interface';
import { AddClassComponent } from '../add-class/add-class.component';
// Using MatDialog for confirmation instead of a separate component

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
        <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Class Name</th>
            <td mat-cell *matCellDef="let cls">{{ cls.name }}</td>
          </ng-container>

          <!-- Faculty Column -->
          <ng-container matColumnDef="faculty">
            <th mat-header-cell *matHeaderCellDef>Faculty</th>
            <td mat-cell *matCellDef="let cls">
              <div class="faculty-info">
                <div class="faculty-name">{{ cls.faculty?.name }}</div>
                <div class="faculty-email" *ngIf="cls.faculty?.email">{{ cls.faculty.email }}</div>
              </div>
            </td>
          </ng-container>

          <!-- Room Column -->
          <ng-container matColumnDef="room">
            <th mat-header-cell *matHeaderCellDef>Room</th>
            <td mat-cell *matCellDef="let cls">
              <div *ngIf="cls.room">
                <div class="room-name">{{ cls.room.name }}</div>
                <div class="room-capacity" *ngIf="cls.room.capacity">
                  Capacity: {{ cls.room.capacity }}
                </div>
              </div>
              <div *ngIf="!cls.room">
                -
              </div>
            </td>
          </ng-container>

          <!-- Timeslot Column -->
          <ng-container matColumnDef="timeslot">
            <th mat-header-cell *matHeaderCellDef>Schedule</th>
            <td mat-cell *matCellDef="let cls">
              <div *ngIf="cls.timeslot" class="timeslot-info">
                <div class="day">
                  <mat-icon>event</mat-icon>
                  {{ cls.timeslot.dayOfWeek ? (cls.timeslot.dayOfWeek | titlecase) : '' }}
                </div>
                <div class="time" *ngIf="cls.timeslot.startTime && cls.timeslot.endTime">
                  <mat-icon>schedule</mat-icon>
                  {{ cls.timeslot.startTime }} - {{ cls.timeslot.endTime }}
                </div>
              </div>
              <div *ngIf="!cls.timeslot">Not scheduled</div>
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
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header h2 {
      margin: 0;
      font-weight: 500;
      color: #3f51b5;
    }

    .add-button {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: #3f51b5;
      color: white;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    }

    .mat-table {
      width: 100%;
      table-layout: fixed;
    }

    th.mat-header-cell {
      font-weight: 600;
      color: rgba(0, 0, 0, 0.87);
      font-size: 14px;
      background-color: #f5f5f5;
      padding: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    td.mat-cell {
      padding: 20px 16px;
      border-bottom-width: 1px;
      border-bottom-style: solid;
      border-bottom-color: rgba(0, 0, 0, 0.08);
      vertical-align: top;
      word-wrap: break-word;
    }

    /* Column specific styles */
    .mat-column-name {
      width: 22%;
      min-width: 180px;
      padding-right: 16px;
    }

    .mat-column-faculty {
      width: 28%;
      min-width: 200px;
      padding-right: 16px;
    }

    .mat-column-room {
      width: 18%;
      min-width: 120px;
      padding-right: 16px;
    }

    .mat-column-timeslot {
      width: 22%;
      min-width: 180px;
      padding-right: 16px;
    }


    
    /* Ensure table container has proper width */
    .table-container {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .faculty-info {
      display: flex;
      flex-direction: column;
    }

    .faculty-name {
      font-weight: 500;
    }

    .faculty-email {
      font-size: 0.8em;
      color: #666;
    }

    .room-name {
      font-weight: 500;
    }

    .room-capacity {
      font-size: 0.8em;
      color: #666;
    }

    .timeslot-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .day, .time {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .day mat-icon, .time mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #3f51b5;
    }

    .actions-cell {
      display: flex;
      gap: 8px;
    }

    .action-button {
      transition: all 0.2s;
    }

    .action-button:hover {
      transform: scale(1.1);
    }

    .mat-paginator {
      background-color: #fafafa;
      border-top: 1px solid rgba(0, 0, 0, 0.06);
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      gap: 16px;
    }

    .loading-spinner p {
      color: rgba(0, 0, 0, 0.54);
      margin: 0;
    }

    .no-data {
      padding: 24px;
      text-align: center;
      color: rgba(0, 0, 0, 0.54);
    }
  `]
})
export class ManageClassesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['name', 'faculty', 'room', 'timeslot'];
  dataSource = new MatTableDataSource<Class>([]);
  loading: boolean = true;
  selectedRow: Class | null = null;
  selectedClass: Class | null = null;
  searchTerm: string = '';
  currentFilter: string = '';
  classes: Class[] = [];

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.searchTerm;
  }

  filterByDay(day: string) {
    this.currentFilter = day;
    this.dataSource.filter = day;
  }

  clearFilters() {
    this.currentFilter = '';
    this.searchTerm = '';
    this.dataSource.filter = '';
  }

  getStatusClass(cls: Class): string {
    // Implement status logic based on current time and class schedule
    return 'upcoming';
  }

  getStatusText(cls: Class): string {
    // Return status text based on class schedule
    return 'Upcoming';
  }

  getStatusTooltip(cls: Class): string {
    // Return tooltip text for status
    return 'Class is scheduled for the future';
  }

  selectRow(row: Class) {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  editClass(cls: Class) {
    // Implement edit functionality
    console.log('Edit class:', cls);
  }

  confirmDelete(cls: Class) {
    this.selectedClass = cls;
    // Open confirmation dialog using MatDialog directly
    const dialogRef = this.dialog.open(MatDialog, {
      width: '400px',
      data: {
        title: 'Delete Class',
        message: `Are you sure you want to delete ${cls.name}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteClass();
      }
    });
  }

  deleteClass() {
    if (!this.selectedClass?.id) return;
    
    this.api.deleteClass(this.selectedClass.id).subscribe({
      next: () => {
        this.snackBar.open('Class deleted successfully', 'Close', { duration: 3000 });
        this.loadClasses();
      },
      error: (error) => {
        console.error('Error deleting class:', error);
        this.snackBar.open('Error deleting class', 'Close', { duration: 3000 });
      }
    });
  }

  loadClasses(): void {
    this.loading = true;
    this.api.getClasses().subscribe({
      next: (data: Class[]) => {
        this.classes = data;
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading classes:', error);
        this.loading = false;
        this.snackBar.open('Error loading classes', 'Close', { duration: 3000 });
      }
    });
  }

  onRowClicked(row: Class) {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  exportToExcel() {
    this.snackBar.open('Export to Excel functionality will be implemented soon', 'Close', { duration: 3000 });
  }

  openAddClassDialog() {
    const dialogRef = this.dialog.open(AddClassComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClasses();
      }
    });
  }
}
