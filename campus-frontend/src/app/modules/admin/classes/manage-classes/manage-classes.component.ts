import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Angular Material Modules
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatCommonModule } from '@angular/material/core';

import { ApiService } from '@services/api.service';
import { Class } from '../class.interface';
import { AddClassComponent } from '../add-class/add-class.component';

// Simple confirm dialog component since we don't have the shared one
@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title || 'Confirm' }}</h2>
    <mat-dialog-content>
      {{ data.message || 'Are you sure you want to continue?' }}
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false" color="warn">
        {{ data.cancelText || 'Cancel' }}
      </button>
      <button 
        mat-button 
        [mat-dialog-close]="true" 
        [color]="data.confirmColor === 'warn' ? 'warn' : 'primary'"
        [class.mat-primary]="!data.confirmColor || data.confirmColor === 'primary'"
        [class.mat-warn]="data.confirmColor === 'warn'"
        [class.mat-accent]="data.confirmColor === 'accent'">
        {{ data.confirmText || 'Confirm' }}
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

@Component({
  selector: 'app-manage-classes',
  standalone: true,
  styleUrls: ['./manage-classes.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatCommonModule,
    
    // Material Modules
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
    MatMenuModule,
    MatSnackBarModule,
    MatCardModule,
    MatSelectModule,
    MatProgressBarModule,
    MatChipsModule,
    
    // Shared Components
    AddClassComponent,
    ConfirmDialogComponent
  ],
  template: `
    <div class="manage-classes">
      <!-- Page Header -->
      <div class="admin-page__header">
        <div class="header-content">
          <div class="header-title"></div>
          <!-- Search and Filters -->
          <div class="search-container">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search Classes</mat-label>
              <input matInput
                    #searchInput
                    type="text"
                    placeholder="Search by name, code, or instructor..."
                    (keyup)="applyFilter(searchInput.value)"
                    [disabled]="isLoading">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="openAddClassDialog()">
              <mat-icon>add</mat-icon>
              <span class="button-text">Add Class</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="admin-page__content">
        <div class="content-card">
          <!-- Table Toolbar (Search and Actions) -->
          <div class="table-toolbar">
            <div class="table-actions">
              <!-- Optional: Add filter/export buttons here if needed -->
              <!-- <button mat-stroked-button><mat-icon>filter_list</mat-icon>Filter</button> -->
              <button mat-stroked-button (click)="exportToExcel()" matTooltip="Export to Excel">
                <mat-icon>file_download</mat-icon>
                Export
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="isLoading" class="loading-spinner">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Loading classes...</p>
          </div>

          <!-- No Results -->
          <div *ngIf="!isLoading && dataSource.filteredData.length === 0" class="no-results">
            <mat-icon>search_off</mat-icon>
            <p>No classes found. Try adjusting your search or add a new class.</p>
            <button mat-stroked-button color="primary" (click)="openAddClassDialog()">
              <mat-icon>add</mat-icon>
              <span>Add New Class</span>
            </button>
          </div>

          <!-- Class Table -->
          <div class="table-responsive" *ngIf="!isLoading && dataSource.filteredData.length > 0">
            <table mat-table [dataSource]="dataSource" matSort>

              <!-- Name Column -->
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Class Name</th>
                <td mat-cell *matCellDef="let classItem">
                  <div class="class-info">
                    <div class="class-icon" [ngStyle]="{'background-color': classItem.color + '20', 'color': classItem.color}">
                       <mat-icon>class_</mat-icon>
                    </div>
                    <div>
                      <div class="class-name">{{classItem.name}}</div>
                      <div class="class-id">{{classItem.code}}</div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Instructor Column -->
              <ng-container matColumnDef="instructor">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Instructor</th>
                <td mat-cell *matCellDef="let classItem">
                  <div class="faculty-info">
                     <mat-icon>person</mat-icon>
                     <span>{{classItem.instructor || 'Not assigned'}}</span>
                  </div>
                </td>
              </ng-container>

              <!-- Schedule Column -->
              <ng-container matColumnDef="schedule">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Schedule</th>
                <td mat-cell *matCellDef="let classItem">
                  <div *ngIf="classItem.timeslot" class="schedule-info">
                    <div class="schedule-day">
                      <mat-icon>event</mat-icon>
                      {{ classItem.timeslot.dayOfWeek ? (classItem.timeslot.dayOfWeek | titlecase) : 'No day set' }}
                    </div>
                    <div class="schedule-time" *ngIf="classItem.timeslot.startTime && classItem.timeslot.endTime">
                      <mat-icon>schedule</mat-icon>
                      {{ classItem.timeslot.startTime }} - {{ classItem.timeslot.endTime }}
                    </div>
                  </div>
                  <div *ngIf="!classItem.timeslot">Not scheduled</div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
                <td mat-cell *matCellDef="let classItem">
                  <div class="status-container">
                    <mat-chip
                      [color]="classItem.isActive ? 'primary' : 'warn'"
                      class="status-chip"
                    >
                      {{ classItem.isActive ? 'Active' : 'Inactive' }}
                    </mat-chip>
                    <mat-chip
                      [color]="getLectureStatusColor(classItem.lectureStatus)"
                      class="status-chip"
                    >
                      {{ classItem.lectureStatus | titlecase }}
                    </mat-chip>
                  </div>
                </td>
              </ng-container>

              <!-- Students Column -->
              <ng-container matColumnDef="students">
                <th mat-header-cell *matHeaderCellDef>Students</th>
                <td mat-cell *matCellDef="let classItem">
                  <div class="students-info">
                    <mat-icon class="students-icon">people</mat-icon>
                    <span class="students-count">{{ classItem.__enrollments__?.length || 0 }} enrolled</span>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          </div>

          <mat-paginator
            [pageSizeOptions]="[5, 10, 25, 100]"
            showFirstLastButtons
          ></mat-paginator>

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

  // Component state
  isLoading = true;
  searchTerm = '';
  selectedRow: Class | null = null;

  // Table configuration
  displayedColumns: string[] = ['name', 'instructor', 'schedule', 'status', 'students'];
  dataSource = new MatTableDataSource<Class>([]);

  // Page title for the layout
  pageTitle = 'Manage Classes';

  // Status options for filtering
  statusOptions = [
    { value: 'active', viewValue: 'Active' },
    { value: 'upcoming', viewValue: 'Upcoming' },
    { value: 'completed', viewValue: 'Completed' },
    { value: 'cancelled', viewValue: 'Cancelled' }
  ];
  selectedStatus: string[] = [];

  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {
    // Set up custom filter predicate
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngOnInit(): void {
    // Initialize the filter with default values
    this.dataSource.filter = JSON.stringify({
      search: this.searchTerm,
      statuses: this.selectedStatus
    });
    
    // Load the classes
    this.loadClasses();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Apply filter to the table
   * @param filterValue The filter value from the input
   */
  applyFilter(filterValue: string | null | undefined): void {
    // Update the search term
    this.searchTerm = (filterValue || '').trim().toLowerCase();
    
    // Create a filter object that includes both search term and status filters
    const filter = JSON.stringify({
      search: this.searchTerm,
      statuses: this.selectedStatus
    });
    
    // Apply the filter
    this.dataSource.filter = filter;

    // Reset to first page when filtering
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Create custom filter predicate for the table
   */
  private createFilter(): (data: Class, filter: string) => boolean {
    return (data: Class, filter: string): boolean => {
      // Parse the filter string back to an object
      let filterObj: { search?: string; statuses?: string[] } = { search: '', statuses: [] };
      try {
        filterObj = JSON.parse(filter) || {};
      } catch (e) {
        // If parsing fails, treat it as a simple search string
        filterObj = { search: filter, statuses: [] };
      }

      // Ensure we have default values
      const searchTerm = (filterObj.search || '').toLowerCase();
      const statuses = Array.isArray(filterObj.statuses) ? filterObj.statuses : [];

      // Check if class matches search term
      const matchesSearch = !searchTerm || [
        data.name?.toLowerCase() || '',
        data.code?.toLowerCase() || '',
        data.instructor?.toLowerCase() || '',
        data.schedule?.toLowerCase() || ''
      ].some(value => value.includes(searchTerm));

      // Check if class matches any selected status
      const classStatus = this.getClassStatus(data);
      const matchesStatus = statuses.length === 0 || statuses.includes(classStatus);

      return matchesSearch && matchesStatus;
    };
  }

  /**
   * Get status of a class based on current date and schedule
   * @param cls The class to get the status for
   * @returns A valid status string: 'active', 'upcoming', 'completed', or 'cancelled'
   */
  private getClassStatus(cls: Class): 'active' | 'upcoming' | 'completed' | 'cancelled' {
    // If status is explicitly set and valid, use that
    if (cls.status && ['active', 'upcoming', 'completed', 'cancelled'].includes(cls.status)) {
      return cls.status as 'active' | 'upcoming' | 'completed' | 'cancelled';
    }
    
    // If class is explicitly cancelled, return that
    if (cls.status === 'cancelled') {
      return 'cancelled';
    }
    
    // Otherwise determine status based on dates
    try {
      const now = new Date();
      const startDate = cls.startDate ? new Date(cls.startDate) : null;
      const endDate = cls.endDate ? new Date(cls.endDate) : null;

      // If no start date, default to upcoming
      if (!startDate || isNaN(startDate.getTime())) {
        return 'upcoming';
      }

      // If end date is valid and current date is after end date, class is completed
      if (endDate && !isNaN(endDate.getTime()) && now > endDate) {
        return 'completed';
      }

      // If current date is after or equal to start date, class is active
      if (now >= startDate) {
        return 'active';
      }

      // Default to upcoming if none of the above conditions are met
      return 'upcoming';
    } catch (error) {
      console.error('Error determining class status:', error);
      return 'upcoming'; // Default to upcoming in case of any errors
    }
  }

  /**
   * Get status display text
   */
  getStatusText(cls: Class): string {
    const status = this.getClassStatus(cls);
    switch (status) {
      case 'active': return 'In Session';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Scheduled';
    }
  }

  /**
   * Get status class for styling
   */
  getStatusClass(cls: Class): string {
    const status = this.getClassStatus(cls);
    return `status-${status}`;
  }

  /**
   * Load classes from the API
   */
  loadClasses() {
    this.isLoading = true;

    // Simulate API call with timeout
    setTimeout(() => {
      this.api.getClasses().subscribe({
        next: (classes) => {
          this.dataSource.data = classes;
          
          // Initialize the filter with empty values
          this.dataSource.filter = JSON.stringify({
            search: this.searchTerm,
            statuses: this.selectedStatus
          });
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading classes:', error);
          this.showError('Failed to load classes. Please try again.');
          this.isLoading = false;
        }
      });
    }, 500); // Simulate network delay
  }

  /**
   * Show error message
   * @param message The error message to display
   */
  private showError(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Format date for display
   */
  private formatDate(date: string | Date | undefined): string {
    if (!date) return 'Not scheduled';
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'Invalid date' : d.toLocaleDateString();
  }

  /**
   * Open the add class dialog
   */
  openAddClassDialog(classToEdit?: Class): void {
    const dialogRef = this.dialog.open(AddClassComponent, {
      width: '600px',
      disableClose: true,
      data: classToEdit ? { ...classToEdit } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClasses();
      }
    });
  }
  
  /**
   * Edit a class
   * @param classToEdit The class to edit
   */
  editClass(classToEdit: Class): void {
    this.openAddClassDialog(classToEdit);
  }
  
  /**
   * View class details
   */
  viewClassDetails(cls: Class): void {
    // In a real app, you might navigate to a details page or open a dialog
    this.snackBar.open(`Viewing details for ${cls.name}`, 'Close', {
      duration: 3000
    });
  }

  /**
   * Delete a class after confirmation
   * @param classToDelete The class to delete
   */
  deleteClass(classToDelete: Class): void {
    if (!classToDelete.id) {
      this.showError('Cannot delete class: Invalid class ID');
      return;
    }
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete the class "${classToDelete.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && classToDelete.id) {
        this.performDelete(classToDelete.id);
      } else if (confirmed) {
        console.error('Cannot delete class: No class ID provided');
        this.showError('Cannot delete class: Invalid class ID');
      }
    });
  }
  
  /**
   * Perform the actual delete operation
   * @param classId The ID of the class to delete
   */
  private performDelete(classId: string): void {
    this.isLoading = true;
    
    // In a real app, you would call your API service
    // this.api.deleteClass(classId).subscribe({
    //   next: () => {
    //     this.showSuccess('Class deleted successfully');
    //     this.loadClasses();
    //   },
    //   error: (error) => {
    //     console.error('Error deleting class:', error);
    //     this.showError('Failed to delete class. Please try again.');
    //     this.isLoading = false;
    //   }
    // });
    
    // For demo purposes, simulate API call
    setTimeout(() => {
      this.showSuccess('Class deleted successfully');
      this.dataSource.data = this.dataSource.data.filter(c => c.id !== classId);
      this.isLoading = false;
    }, 1000);
  }
  
  /**
   * Show success message
   */
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
  
  /**
   * Apply status filters
   * @param status The status to filter by
   * @param event The checkbox change event
   */
  applyStatusFilter(status: 'active' | 'upcoming' | 'completed' | 'cancelled', event: { checked: boolean }): void {
    try {
      // Update selected statuses based on checkbox state
      if (event.checked) {
        // Only add the status if it's not already in the array
        if (!this.selectedStatus.includes(status)) {
          this.selectedStatus = [...this.selectedStatus, status];
        }
      } else {
        // Remove the status from the array
        this.selectedStatus = this.selectedStatus.filter(s => s !== status);
      }
      
      // Create a filter object with the current search term and selected statuses
      const filterValue = JSON.stringify({
        search: this.searchTerm || '',
        statuses: this.selectedStatus
      });
      
      // Apply the filter
      this.dataSource.filter = filterValue;
      
      // Reset to first page when filtering
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } catch (error) {
      console.error('Error applying status filter:', error);
      // Reset to default state if there's an error
      this.selectedStatus = [];
      this.dataSource.filter = '';
    }
  }

  getLectureStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'accent';
      case 'ongoing':
        return 'primary';
      case 'scheduled':
        return 'warn';
      default:
        return 'primary';
    }
  }

  exportToExcel() {
    // Implementation of exportToExcel method
  }
}
