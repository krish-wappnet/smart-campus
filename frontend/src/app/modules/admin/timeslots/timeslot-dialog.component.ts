import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Timeslot } from '../../../models/timeslot.model';
import { CommonMaterialModule } from '../common-material.module';

@Component({
  selector: 'app-timeslot-dialog',
  template: `
    <h2 mat-dialog-title>{{ mode === 'add' ? 'Add Timeslot' : 'Edit Timeslot' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="timeslotForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Timeslot Name</mat-label>
          <input matInput formControlName="name" required>
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
          <mat-label>Days</mat-label>
          <mat-select formControlName="days" multiple required>
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
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" required></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button [mat-dialog-close]="timeslotForm.value" [disabled]="!timeslotForm.valid">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CommonMaterialModule
  ]
})
export class TimeslotDialogComponent {
  timeslotForm: FormGroup;
  mode: 'add' | 'edit';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TimeslotDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit', timeslot?: Timeslot }
  ) {
    this.mode = data.mode;
    this.timeslotForm = this.fb.group({
      name: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      days: ['', Validators.required],
      description: ['', Validators.required]
    });

    if (data.timeslot) {
      this.timeslotForm.patchValue(data.timeslot);
    }
  }

  onSubmit() {
    if (this.timeslotForm.valid) {
      this.dialogRef.close(this.timeslotForm.value);
    }
  }
}
