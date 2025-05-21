import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MatDialog, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ApiService } from '@services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Class } from '../class.interface';

@Component({
  selector: 'app-add-class',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2 mat-dialog-title>Add New Class</h2>
        <button mat-icon-button (click)="onCancel()" class="close-button" aria-label="Close dialog">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <div class="dialog-content">
        <div class="form-container">
        <form [formGroup]="classForm" (ngSubmit)="onSubmit()" class="form-container">
          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Class Name</mat-label>
            <input matInput 
                  formControlName="name" 
                  placeholder="e.g., Mathematics 101"
                  required>
            <mat-icon matSuffix>class</mat-icon>
            <mat-hint>Enter a descriptive name for the class (3-100 characters)</mat-hint>
            <mat-error *ngIf="classForm.get('name')?.hasError('required')">
              Class name is required
            </mat-error>
            <mat-error *ngIf="classForm.get('name')?.hasError('minlength')">
              Class name must be at least 3 characters long
            </mat-error>
            <mat-error *ngIf="classForm.get('name')?.hasError('maxlength')">
              Class name cannot exceed 100 characters
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Faculty</mat-label>
            <mat-select 
              formControlName="facultyId" 
              required
              [compareWith]="compareById"
              panelClass="faculty-select-panel">
              <mat-select-trigger>
                <div *ngIf="selectedFaculty" class="selected-option">
                  <mat-icon>account_circle</mat-icon>
                  <span>{{ selectedFaculty.name }}</span>
                </div>
              </mat-select-trigger>
              <mat-option *ngIf="isLoadingFaculty" [disabled]="true">
                <div class="loading-option">
                  <mat-spinner diameter="20" color="accent"></mat-spinner>
                  <span>Loading faculty...</span>
                </div>
              </mat-option>
              <mat-option *ngIf="!isLoadingFaculty && facultyList.length === 0" [disabled]="true">
                <div class="no-data-option">
                  <mat-icon>group_off</mat-icon>
                  <span>No faculty members available</span>
                </div>
              </mat-option>
              <mat-option *ngFor="let faculty of facultyList" [value]="faculty.id">
                <div class="faculty-option">
                  <mat-icon class="option-icon">account_circle</mat-icon>
                  <div class="faculty-details">
                    <span class="faculty-name">{{ faculty.name }}</span>
                    <span class="faculty-email">{{ faculty.email }}</span>
                  </div>
                </div>
              </mat-option>
            </mat-select>
            <mat-error *ngIf="facultyLoadError">
              <div class="error-message">
                <mat-icon>error_outline</mat-icon>
                <span>Failed to load faculty. Please try again.</span>
              </div>
            </mat-error>
            <button mat-icon-button matSuffix *ngIf="facultyLoadError" (click)="loadFacultyList()" matTooltip="Retry">
              <mat-icon>refresh</mat-icon>
            </button>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Room</mat-label>
            <mat-select 
              formControlName="roomId" 
              required
              [compareWith]="compareById"
              panelClass="room-select-panel">
              <mat-select-trigger>
                <div *ngIf="selectedRoom" class="selected-option">
                  <mat-icon>meeting_room</mat-icon>
                  <span>{{ selectedRoom.name }}</span>
                </div>
              </mat-select-trigger>
              <mat-option *ngFor="let room of roomList" [value]="room.id">
                <div class="room-option">
                  <mat-icon class="option-icon">meeting_room</mat-icon>
                  <span>{{ room.name }}</span>
                </div>
              </mat-option>
            </mat-select>
            <mat-hint>Select a room for the class</mat-hint>
            <mat-error *ngIf="classForm.get('roomId')?.hasError('required')">
              Please select a room
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-field">
            <mat-label>Timeslot</mat-label>
            <mat-select 
              formControlName="timeslotId" 
              required
              [compareWith]="compareById"
              panelClass="timeslot-select-panel">
              <mat-select-trigger>
                <div *ngIf="selectedTimeslot" class="selected-option">
                  <mat-icon>schedule</mat-icon>
                  <span>{{ selectedTimeslot.dayOfWeek | titlecase }} {{ selectedTimeslot.startTime }} - {{ selectedTimeslot.endTime }}</span>
                </div>
              </mat-select-trigger>
              <mat-option *ngFor="let timeslot of timeslotList" [value]="timeslot.id">
                <div class="timeslot-option">
                  <mat-icon class="option-icon">schedule</mat-icon>
                  <div class="timeslot-details">
                    <span class="timeslot-day">
                      {{ timeslot.dayOfWeek | titlecase }}
                    </span>
                    <span class="timeslot-time">
                      {{ timeslot.startTime }} - {{ timeslot.endTime }}
                    </span>
                  </div>
                </div>
              </mat-option>
            </mat-select>
            <mat-hint>Select a time slot for the class</mat-hint>
            <mat-error *ngIf="classForm.get('timeslotId')?.hasError('required')">
              Please select a timeslot
            </mat-error>
          </mat-form-field>

          <div class="form-actions">
            <button mat-button 
                    type="button" 
                    (click)="onCancel()" 
                    class="cancel-button">
              <mat-icon>cancel</mat-icon>
              <span>Cancel</span>
            </button>
            <button mat-raised-button 
                    color="primary" 
                    type="submit" 
                    [disabled]="!classForm.valid || isSubmitting"
                    class="submit-button">
              <mat-icon *ngIf="!isSubmitting">add_circle</mat-icon>
              <mat-spinner *ngIf="isSubmitting" diameter="20"></mat-spinner>
              <span>{{ isSubmitting ? 'Adding...' : 'Add Class' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    </div> <!-- Close form-container -->
  `,
  styles: [`
    .dialog-container {
      display: flex;
      flex-direction: column;
      min-width: 500px;
      width: 100%;
      max-width: 90vw;
      max-height: 90vh;
      overflow: hidden;
      border-radius: 12px;
      box-shadow: 0 11px 15px -7px rgba(0,0,0,.2), 0 24px 38px 3px rgba(0,0,0,.14), 0 9px 46px 8px rgba(0,0,0,.12);
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      background-color: #f5f5f5;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;

      h2 {
        margin: 0;
        color: #1a237e;
        font-weight: 500;
        font-size: 1.5rem;
      }

      
      .close-button {
        color: #f44336;
      }
    }

    .dialog-content {
      padding: 24px;
      overflow-y: auto;
      background: white;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 0 8px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      
      .form-field {
        flex: 1 1 300px;
        min-width: 0;
      }
    }

    .form-field {
      width: 100%;
      min-width: 300px;
      margin-bottom: 1.5rem;
      
      .mat-mdc-form-field-subscript-wrapper {
        margin-top: 4px;
      }
      
      .mat-mdc-form-field-error-wrapper {
        padding: 0;
      }
      
      .mat-mdc-form-field-error {
        font-size: 12px;
        line-height: 1.2;
        margin-top: 4px;
      }
      
      .mat-mdc-form-field-infix {
        min-height: 56px;
        display: flex;
        align-items: center;
      }
      
      .mat-mdc-select {
        width: 100%;
      }
      
      .mat-mdc-select-value {
        display: flex;
        align-items: center;
        min-height: 24px;
      }

      mat-icon[matPrefix] {
        margin-right: 8px;
        color: #3f51b5;
      }

      
      mat-hint {
        font-size: 0.75rem;
        color: #c51162;
      }

      mat-error {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.75rem;
        
        mat-icon {
          font-size: 1rem;
          height: 1rem;
          width: 1rem;
        }
      }
    }

    .timeslot-option {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;
      width: 100%;
      
      .timeslot-details {
        display: flex;
        flex-direction: column;
        min-width: 0;
        flex: 1;
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;

      button {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 0 16px;
        border-radius: 4px;
        transition: all 0.2s ease;

        mat-icon {
          margin-right: 4px;
        }
      }


      .submit-button {
        background-color: #3f51b5;
        color: white;

        &:hover:not([disabled]) {
          background-color: #303f9f;
          transform: translateY(-1px);
        }

        &:active:not([disabled]) {
          transform: translateY(0);
        }


        &[disabled] {
          background-color: rgba(0, 0, 0, 0.12);
          color: rgba(0, 0, 0, 0.38);
        }
      }

      .cancel-button {
        color: #f44336;

        &:hover {
          background-color: rgba(244, 67, 54, 0.04);
        }
      }
    }

    /* Custom select options */
    /* Selected option styles */
    .selected-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;
      
      mat-icon {
        color: #3f51b5;
        font-size: 20px;
        height: 20px;
        width: 20px;
      }
      
      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    /* Option styles in dropdown */
    .faculty-option, .room-option, .timeslot-option {
      display: flex;
      align-items: center;
      padding: 8px 0;
      width: 100%;
      white-space: normal;
      line-height: 1.4;
      gap: 8px;

      .faculty-details, .timeslot-details {
        display: flex;
        flex-direction: column;
        margin-left: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .faculty-name, .timeslot-day {
        font-weight: 500;
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .faculty-email, .timeslot-time {
        font-size: 0.75rem;
        color: rgba(0, 0, 0, 0.6);
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .no-data-option {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
      color: rgba(0, 0, 0, 0.6);
      font-style: italic;
    }

    /* Loading states */
    .loading-option {
      display: flex;
      align-items: center;
      &.mdc-list-item--selected:not(.mdc-list-item--disabled) {
        .mdc-list-item__primary-text {
          color: #3f51b5;
        }
      }
    }

    /* Responsive adjustments */
    @media (max-width: 600px) {
      .dialog-content {
        padding: 16px;
      }
      
      .form-actions {
        flex-direction: column;
        gap: 0.75rem;
        
        button {
          width: 100%;
          justify-content: center;
          padding: 8px 0;
        }
      }
    }

    /* Custom panel styles */
    .faculty-select-panel,
    .room-select-panel,
    .timeslot-select-panel {
      max-height: 300px !important;
      min-width: 300px !important;
      
      .mat-mdc-option {
        height: auto;
        min-height: 48px;
        padding: 8px 16px;
        
        .mdc-list-item__primary-text {
          width: 100%;
        }
      }
    }
  `]
})
export class AddClassComponent implements OnInit {
  // Component properties
  classForm: FormGroup;
  facultyList: any[] = [];
  roomList: any[] = [];
  timeslotList: any[] = [];
  isLoadingFaculty = false;
  facultyLoadError = false;
  isSubmitting = false;

  // Selected values for display
  selectedFaculty: any = null;
  selectedRoom: any = null;
  selectedTimeslot: any = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddClassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
    private snackBar: MatSnackBar
  ) { 
    this.classForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      facultyId: ['', [Validators.required]],
      roomId: ['', [Validators.required]],
      timeslotId: ['', [Validators.required]]
    }, { updateOn: 'blur' });
  }

  ngOnInit(): void {
    // Subscribe to form value changes to update display values
    this.classForm.get('facultyId')?.valueChanges.subscribe(id => {
      this.selectedFaculty = this.facultyList.find(f => f.id === id);
    });

    this.classForm.get('roomId')?.valueChanges.subscribe(id => {
      this.selectedRoom = this.roomList.find(r => r.id === id);
    });

    this.classForm.get('timeslotId')?.valueChanges.subscribe(id => {
      this.selectedTimeslot = this.timeslotList.find(t => t.id === id);
    });

    this.loadFacultyList();
    this.loadRoomList();
    this.loadTimeslotList();
  }

  loadFacultyList(): void {
    this.isLoadingFaculty = true;
    this.facultyLoadError = false;
    
    this.api.getFacultyUsers()
      .pipe(
        finalize(() => this.isLoadingFaculty = false)
      )
      .subscribe({
        next: (data: any) => {
          this.facultyList = Array.isArray(data) 
            ? data.filter(user => user.role === 'faculty')
            : [];
          
          // Update selected faculty display if a faculty is already selected
          if (this.classForm.get('facultyId')?.value) {
            this.selectedFaculty = this.facultyList.find(f => f.id === this.classForm.get('facultyId')?.value);
          }
        },
        error: (error: any) => {
          console.error('Error loading faculty:', error);
          this.facultyLoadError = true;
          this.snackBar.open('Failed to load faculty list. Please try again.', 'Dismiss', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  loadRoomList(): void {
    this.api.getRooms().subscribe({
      next: (data: any) => {
        this.roomList = data;
        // Update selected room display if a room is already selected
        if (this.classForm.get('roomId')?.value) {
          this.selectedRoom = this.roomList.find(r => r.id === this.classForm.get('roomId')?.value);
        }
      },
      error: (error: any) => {
        console.error('Error loading rooms:', error);
        this.snackBar.open('Failed to load rooms. Please try again.', 'Dismiss', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadTimeslotList(): void {
    this.api.getTimeslots().subscribe({
      next: (data: any) => {
        this.timeslotList = data;
        // Update selected timeslot display if a timeslot is already selected
        if (this.classForm.get('timeslotId')?.value) {
          this.selectedTimeslot = this.timeslotList.find(t => t.id === this.classForm.get('timeslotId')?.value);
        }
      },
      error: (error: any) => {
        console.error('Error loading timeslots:', error);
        this.snackBar.open('Failed to load timeslots. Please try again.', 'Dismiss', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onSubmit(): void {
    // Mark all fields as touched to trigger validation messages
    this.classForm.markAllAsTouched();
    
    if (this.classForm.valid) {
      this.isSubmitting = true;
      const classData: Class = this.classForm.value;
      
      this.api.createClass(classData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.snackBar.open('Class created successfully!', 'Dismiss', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error('Error creating class:', error);
          this.isSubmitting = false;
          this.snackBar.open(
            error.error?.message || 'Failed to create class. Please try again.',
            'Dismiss',
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
    }
  }

  // Helper function to compare objects by ID for mat-select
  compareById(item1: any, item2: any): boolean {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
