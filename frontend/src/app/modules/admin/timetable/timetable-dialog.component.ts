import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TimetableEntry } from '../../../models/timetable.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-timetable-dialog',
  template: `
    <h2 mat-dialog-title>{{ mode === 'add' ? 'Add Timetable Entry' : 'Edit Timetable Entry' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="timetableForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Day</mat-label>
          <mat-select formControlName="day" required>
            <mat-option value="monday">Monday</mat-option>
            <mat-option value="tuesday">Tuesday</mat-option>
            <mat-option value="wednesday">Wednesday</mat-option>
            <mat-option value="thursday">Thursday</mat-option>
            <mat-option value="friday">Friday</mat-option>
            <mat-option value="saturday">Saturday</mat-option>
            <mat-option value="sunday">Sunday</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Start Time</mat-label>
          <input matInput type="time" formControlName="startTime" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>End Time</mat-label>
          <input matInput type="time" formControlName="endTime" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Class</mat-label>
          <input matInput formControlName="className" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Room</mat-label>
          <input matInput formControlName="roomName" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Teacher</mat-label>
          <input matInput formControlName="teacherName" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" required></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button [mat-dialog-close]="timetableForm.value" [disabled]="!timetableForm.valid">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }
  `],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule,MatFormFieldModule,MatOptionModule]
})
export class TimetableDialogComponent {
  timetableForm: FormGroup;
  mode: 'add' | 'edit';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TimetableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit', entry?: TimetableEntry }
  ) {
    this.mode = data.mode;
    this.timetableForm = this.fb.group({
      day: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      className: ['', Validators.required],
      roomName: ['', Validators.required],
      teacherName: ['', Validators.required],
      description: ['', Validators.required]
    });

    if (data.entry) {
      this.timetableForm.patchValue(data.entry);
    }
  }

  onSubmit() {
    if (this.timetableForm.valid) {
      this.dialogRef.close(this.timetableForm.value);
    }
  }
}
