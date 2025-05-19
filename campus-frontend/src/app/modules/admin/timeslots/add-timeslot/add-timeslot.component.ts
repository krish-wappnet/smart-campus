import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@services/api.service';

import { Timeslot } from '../timeslot.interface';

@Component({
  selector: 'app-add-timeslot',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <div class="dialog-content">
      <h2>Add Timeslot</h2>
      <form [formGroup]="timeslotForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Start Time</mat-label>
          <input matInput type="time" formControlName="startTime" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>End Time</mat-label>
          <input matInput type="time" formControlName="endTime" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Day of Week</mat-label>
          <mat-select formControlName="dayOfWeek" required>
            <mat-option value="monday">Monday</mat-option>
            <mat-option value="tuesday">Tuesday</mat-option>
            <mat-option value="wednesday">Wednesday</mat-option>
            <mat-option value="thursday">Thursday</mat-option>
            <mat-option value="friday">Friday</mat-option>
            <mat-option value="saturday">Saturday</mat-option>
            <mat-option value="sunday">Sunday</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="dialog-actions">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!timeslotForm.valid">Add Timeslot</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-content {
      padding: 24px;
      max-width: 500px;
    }

    h2 {
      margin-bottom: 24px;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 24px;
    }
  `]
})
export class AddTimeslotComponent {
  timeslotForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTimeslotComponent>,
    private api: ApiService
  ) {
    this.timeslotForm = this.fb.group({
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      dayOfWeek: ['', [Validators.required]]
    });

    // Set default time values
    this.timeslotForm.patchValue({
      startTime: '09:00',
      endTime: '10:30'
    });
  }

  onSubmit(): void {
    if (this.timeslotForm.valid) {
      const timeslotData: Timeslot = this.timeslotForm.value;
      this.api.createTimeslot(timeslotData).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error('Error creating timeslot:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
