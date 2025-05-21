import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { ApiService } from '@services/api.service';
import { Room } from '../room.interface';

@Component({
  selector: 'app-add-room',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
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
        <h2 mat-dialog-title>Add New Room</h2>
        <button mat-icon-button (click)="onCancel()" class="close-button" aria-label="Close dialog">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <div class="dialog-content">
        <div class="form-container">
          <form [formGroup]="roomForm" (ngSubmit)="onSubmit()" class="form-container">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Room Name</mat-label>
              <input matInput 
                    formControlName="name" 
                    placeholder="e.g., Computer Lab 101"
                    required>
              <mat-icon matSuffix>meeting_room</mat-icon>
              <mat-hint>Enter a descriptive name for the room (3-50 characters)</mat-hint>
              <mat-error *ngIf="roomForm.get('name')?.hasError('required')">
                Room name is required
              </mat-error>
              <mat-error *ngIf="roomForm.get('name')?.hasError('minlength')">
                Room name must be at least 3 characters long
              </mat-error>
              <mat-error *ngIf="roomForm.get('name')?.hasError('maxlength')">
                Room name cannot exceed 50 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Capacity</mat-label>
              <input matInput 
                    type="number" 
                    formControlName="capacity" 
                    placeholder="e.g., 30"
                    min="1"
                    max="1000"
                    required>
              <mat-icon matSuffix>people</mat-icon>
              <mat-hint>Enter the maximum capacity (1-1000 people)</mat-hint>
              <mat-error *ngIf="roomForm.get('capacity')?.hasError('required')">
                Capacity is required
              </mat-error>
              <mat-error *ngIf="roomForm.get('capacity')?.hasError('min')">
                Minimum capacity is 1
              </mat-error>
              <mat-error *ngIf="roomForm.get('capacity')?.hasError('max')">
                Maximum capacity is 1000
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
                      [disabled]="!roomForm.valid || isSubmitting"
                      class="submit-button">
                <mat-icon *ngIf="!isSubmitting">add_circle</mat-icon>
                <mat-spinner *ngIf="isSubmitting" diameter="20"></mat-spinner>
                <span>{{ isSubmitting ? 'Adding...' : 'Add Room' }}</span>
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
      box-shadow: 0 11px 15px -7px rgba(0,0,0,.2), 0 24px 38px 3px rgba(0,0,0,.14), 0 9px 46px 8px rgba(0,0,0,.12);
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
export class AddRoomComponent implements OnInit {
  roomForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddRoomComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.roomForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      capacity: ['', [
        Validators.required, 
        Validators.min(1),
        Validators.max(1000)
      ]]
    }, { updateOn: 'blur' });
  }

  ngOnInit(): void {
    // Any initialization logic can go here
  }

  onSubmit(): void {
    // Mark all fields as touched to trigger validation messages
    this.roomForm.markAllAsTouched();
    
    if (this.roomForm.valid) {
      this.isSubmitting = true;
      const roomData: Room = this.roomForm.value;
      
      this.api.createRoom(roomData)
        .pipe(
          finalize(() => this.isSubmitting = false)
        )
        .subscribe({
          next: () => {
            this.snackBar.open('Room added successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            console.error('Error creating room:', error);
            this.snackBar.open(
              error.error?.message || 'Failed to add room. Please try again.',
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