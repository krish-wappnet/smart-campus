import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ApiService } from '@services/api.service';
import { Timeslot } from '../timeslot.interface';

@Component({
  selector: 'app-add-timeslot',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2 mat-dialog-title>Add New Timeslot</h2>
        <button mat-icon-button (click)="onCancel()" class="close-button" aria-label="Close dialog">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <div class="dialog-content">
        <div class="form-container">
          <form [formGroup]="timeslotForm" (ngSubmit)="onSubmit()" class="form-container">
            <div class="time-fields">
              <mat-form-field appearance="outline" class="form-field time-field">
                <mat-label>Start Time</mat-label>
                <input matInput 
                      type="time" 
                      formControlName="startTime" 
                      required>
                <mat-icon matSuffix>schedule</mat-icon>
                <mat-hint>Start time for this timeslot</mat-hint>
                <mat-error *ngIf="timeslotForm.get('startTime')?.hasError('required')">
                  Start time is required
                </mat-error>
                <mat-error *ngIf="timeslotForm.get('startTime')?.hasError('invalidTime')">
                  Invalid time format
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field time-field">
                <mat-label>End Time</mat-label>
                <input matInput 
                      type="time" 
                      formControlName="endTime" 
                      required>
                <mat-icon matSuffix>schedule</mat-icon>
                <mat-hint>End time for this timeslot</mat-hint>
                <mat-error *ngIf="timeslotForm.get('endTime')?.hasError('required')">
                  End time is required
                </mat-error>
                <mat-error *ngIf="timeslotForm.get('endTime')?.hasError('invalidTime')">
                  Invalid time format
                </mat-error>
                <mat-error *ngIf="timeslotForm.hasError('endTimeBeforeStart')">
                  End time must be after start time
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Day of Week</mat-label>
              <mat-select formControlName="dayOfWeek" required>
                <mat-option *ngFor="let day of daysOfWeek" [value]="day.value">
                  {{ day.viewValue }}
                </mat-option>
              </mat-select>
              <mat-icon matSuffix>event</mat-icon>
              <mat-hint>Select the day of the week</mat-hint>
              <mat-error *ngIf="timeslotForm.get('dayOfWeek')?.hasError('required')">
                Day of week is required
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
                      [disabled]="!timeslotForm.valid || isSubmitting"
                      class="submit-button">
                <mat-icon *ngIf="!isSubmitting">add_circle</mat-icon>
                <mat-spinner *ngIf="isSubmitting" diameter="20"></mat-spinner>
                <span>{{ isSubmitting ? 'Adding...' : 'Add Timeslot' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
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
      box-shadow: 0 11px 15px -7px rgba(0,0,0,.2), 
                  0 24px 38px 3px rgba(0,0,0,.14), 
                  0 9px 46px 8px rgba(0,0,0,.12);
    }


    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      background-color: #f5f5f5;
      
      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 500;
      }
      
      .close-button {
        color: #f44336;
      }
    }

    .dialog-content {
      padding: 24px;
      overflow-y: auto;
    }

    .form-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 0 8px;
    }

    .time-fields {
      display: flex;
      gap: 1rem;
      
      .time-field {
        flex: 1;
      }
    }

    .form-field {
      width: 100%;
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
      
      mat-icon[matSuffix] {
        margin-right: 8px;
        color: #3f51b5;
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
      
      button {
        display: flex;
        align-items: center;
        gap: 8px;
        
        mat-icon {
          font-size: 20px;
          height: 20px;
          width: 20px;
        }
      }
      
      .cancel-button {
        color: #f44336;
        
        &:hover {
          background-color: rgba(244, 67, 54, 0.04);
        }
      }
      
      .submit-button {
        background-color: #3f51b5;
        color: white;
        
        &:hover {
          background-color: #303f9f;
        }
      }
    }
  `]
})
export class AddTimeslotComponent implements OnInit {
  timeslotForm: FormGroup;
  isSubmitting = false;
  daysOfWeek = [
    { value: 'monday', viewValue: 'Monday' },
    { value: 'tuesday', viewValue: 'Tuesday' },
    { value: 'wednesday', viewValue: 'Wednesday' },
    { value: 'thursday', viewValue: 'Thursday' },
    { value: 'friday', viewValue: 'Friday' },
    { value: 'saturday', viewValue: 'Saturday' },
    { value: 'sunday', viewValue: 'Sunday' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTimeslotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.timeslotForm = this.fb.group({
      startTime: ['09:00', [
        Validators.required,
        this.timeValidator()
      ]],
      endTime: ['10:30', [
        Validators.required,
        this.timeValidator()
      ]],
      dayOfWeek: ['', [Validators.required]]
    }, { validators: this.timeRangeValidator });
  }

  ngOnInit(): void {
    // Any initialization logic can go here
  }

  private timeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      return timeRegex.test(control.value) ? null : { invalidTime: true };
    };
  }

  private timeRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;

    if (!startTime || !endTime) {
      return null;
    }

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0, 0);

    const endDate = new Date();
    endDate.setHours(endHours, endMinutes, 0, 0);

    return endDate > startDate ? null : { endTimeBeforeStart: true };
  };

  onSubmit(): void {
    // Mark all fields as touched to trigger validation messages
    this.timeslotForm.markAllAsTouched();
    
    if (this.timeslotForm.valid) {
      this.isSubmitting = true;
      const timeslotData: Timeslot = this.timeslotForm.value;
      
      this.api.createTimeslot(timeslotData)
        .pipe(
          finalize(() => this.isSubmitting = false)
        )
        .subscribe({
          next: () => {
            this.snackBar.open('Timeslot added successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            console.error('Error creating timeslot:', error);
            this.snackBar.open(
              error.error?.message || 'Failed to add timeslot. Please try again.',
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

  onCancel(): void {
    this.dialogRef.close();
  }
}