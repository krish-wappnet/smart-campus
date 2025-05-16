import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaveRequest } from '../../../models/leave-request.model';
import { CommonMaterialModule } from '../common-material.module';

@Component({
  selector: 'app-leave-request-dialog',
  template: `
    <h2 mat-dialog-title>{{ mode === 'edit' ? 'Edit Leave Request' : 'New Leave Request' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="leaveRequestForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Student ID</mat-label>
          <input matInput formControlName="studentId" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Start Date</mat-label>
          <input matInput [matDatepicker]="startDatePicker" formControlName="startDate" required>
          <mat-datepicker-toggle matSuffix [for]="startDatePicker"></mat-datepicker-toggle>
          <mat-datepicker #startDatePicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>End Date</mat-label>
          <input matInput [matDatepicker]="endDatePicker" formControlName="endDate" required>
          <mat-datepicker-toggle matSuffix [for]="endDatePicker"></mat-datepicker-toggle>
          <mat-datepicker #endDatePicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Reason</mat-label>
          <textarea matInput formControlName="reason" required></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" [disabled]="!leaveRequestForm.valid" (click)="onSubmit()">
        {{ mode === 'edit' ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CommonMaterialModule
  ]
})
export class LeaveRequestDialogComponent {
  leaveRequestForm: FormGroup;
  mode: 'add' | 'edit';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LeaveRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { mode: 'add' | 'edit'; leaveRequest?: LeaveRequest }
  ) {
    this.mode = data.mode;
    this.leaveRequestForm = this.fb.group({
      studentId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required]
    });

    if (data.leaveRequest) {
      this.leaveRequestForm.patchValue(data.leaveRequest);
    }
  }

  onSubmit() {
    if (this.leaveRequestForm.valid) {
      this.dialogRef.close(this.leaveRequestForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
