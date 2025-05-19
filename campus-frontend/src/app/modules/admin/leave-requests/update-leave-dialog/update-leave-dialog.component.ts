import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogContent } from '@angular/material/dialog';
import { MatDialogActions } from '@angular/material/dialog';
import { ApiService } from '@services/api.service';
import { LeaveRequest, UpdateLeaveRequest } from '../leave-request.interface';

@Component({
  selector: 'app-update-leave-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogContent,
    MatDialogActions
  ],
  template: `
    <h2 mat-dialog-title>Update Leave Request</h2>
    <form [formGroup]="leaveForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="form-group">
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="pending">Pending</mat-option>
              <mat-option value="approved">Approved</mat-option>
              <mat-option value="rejected">Rejected</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-group">
          <mat-form-field appearance="outline">
            <mat-label>Substitute Faculty</mat-label>
            <mat-select formControlName="substituteId">
              <mat-option *ngFor="let faculty of facultyList" [value]="faculty.id">
                {{ faculty.name }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-group">
          <mat-form-field appearance="outline">
            <mat-label>Admin Comments</mat-label>
            <textarea
              matInput
              formControlName="adminComments"
              placeholder="Enter any comments"
              rows="3"
            ></textarea>
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-button color="primary" type="submit" [disabled]="!leaveForm.valid">Update</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .form-group {
      margin-bottom: 16px;
    }

    mat-form-field {
      width: 100%;
    }

    mat-dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})
export class UpdateLeaveDialogComponent {
  leaveForm: FormGroup;
  facultyList: any[] = [];
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    public dialogRef: MatDialogRef<UpdateLeaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LeaveRequest
  ) {
    this.leaveForm = this.fb.group({
      status: [data.status, Validators.required],
      substituteId: [data.substituteId],
      adminComments: [data.adminComments]
    });

    this.loadFacultyList();
  }

  loadFacultyList(): void {
    this.api.getFacultyUsers().subscribe({
      next: (data: any) => {
        this.facultyList = data;
      },
      error: (error: any) => {
        console.error('Error loading faculty:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.leaveForm.valid) {
      this.dialogRef.close(this.leaveForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
