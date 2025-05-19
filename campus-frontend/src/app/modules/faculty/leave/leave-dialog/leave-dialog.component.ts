import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { LeaveRequest } from '../../../admin/leave-requests/leave-request.interface';

@Component({
  selector: 'app-leave-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Update Leave Request' : 'Request Leave' }}</h2>
    <form [formGroup]="leaveForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field appearance="outline">
          <mat-label>Start Date</mat-label>
          <input matInput [matDatepicker]="startDatePicker" formControlName="startDate">
          <mat-datepicker-toggle matSuffix [for]="startDatePicker"></mat-datepicker-toggle>
          <mat-datepicker #startDatePicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>End Date</mat-label>
          <input matInput [matDatepicker]="endDatePicker" formControlName="endDate">
          <mat-datepicker-toggle matSuffix [for]="endDatePicker"></mat-datepicker-toggle>
          <mat-datepicker #endDatePicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Reason</mat-label>
          <textarea matInput formControlName="reason" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status" [disabled]="true">
            <mat-option value="pending">Pending</mat-option>
            <mat-option value="approved">Approved</mat-option>
            <mat-option value="rejected">Rejected</mat-option>
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="dialogRef.close()">Cancel</button>
        <button mat-button color="primary" [disabled]="!leaveForm.valid" type="submit">
          {{ data ? 'Update' : 'Request' }}
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class LeaveDialogComponent {
  leaveForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    public dialogRef: MatDialogRef<LeaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LeaveRequest | undefined
  ) {
    this.leaveForm = this.fb.group({
      startDate: [data?.startDate || '', Validators.required],
      endDate: [data?.endDate || '', Validators.required],
      reason: [data?.reason || '', Validators.required],
      status: [data?.status || 'pending', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.leaveForm.valid) {
      const leaveRequest: LeaveRequest = {
        ...this.leaveForm.value,
        id: this.data?.id
      };

      if (this.data) {
        this.api.updateLeaveRequest(this.data.id, leaveRequest).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            console.error('Error updating leave request:', error);
            alert('Error updating leave request');
          }
        });
      } else {
        this.api.createLeaveRequest(leaveRequest).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (error: any) => {
            console.error('Error creating leave request:', error);
            alert('Error creating leave request');
          }
        });
      }
    }
  }
}
