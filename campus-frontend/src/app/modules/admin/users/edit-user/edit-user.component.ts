import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
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
      <h2>Edit User</h2>
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role">
            <mat-option value="admin">Admin</mat-option>
            <mat-option value="faculty">Faculty</mat-option>
            <mat-option value="student">Student</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" [required]="!data">
          <mat-error *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched">
            Password is required for new users
          </mat-error>
        </mat-form-field>

        <div class="dialog-actions">
          <button mat-button type="button" (click)="onCancel()">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!userForm.valid">Save</button>
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
export class EditUserComponent {
  userForm: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      name: ['', { nonNullable: true }],
      email: ['', { nonNullable: true }],
      role: ['', { nonNullable: true }],
      password: ['', { nonNullable: true }]
    });

    if (data) {
      // If data exists, we're editing an existing user
      this.userForm.patchValue({
        name: data.name,
        email: data.email,
        role: data.role
      });
    } else {
      // If no data, we're creating a new user
      this.userForm.patchValue({
        role: 'student' // Default role for new users
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
