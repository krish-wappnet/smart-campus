import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="add-user-container">
      <h2>Add New User</h2>
      
      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role" required>
            <mat-option value="ADMIN">Admin</mat-option>
            <mat-option value="FACULTY">Faculty</mat-option>
            <mat-option value="STUDENT">Student</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" type="password" required>
        </mat-form-field>

        <div class="form-actions">
          <button mat-raised-button color="primary" type="submit" [disabled]="!userForm.valid">
            Add User
          </button>
          <button mat-button type="button" (click)="cancel()">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .add-user-container {
      max-width: 600px;
      margin: 24px auto;
      padding: 24px;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      margin-top: 24px;
    }

    button {
      flex: 1;
    }
  `]
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = {
        name: this.userForm.value.name,
        email: this.userForm.value.email,
        role: this.userForm.value.role as 'admin' | 'faculty' | 'student',
        password: this.userForm.value.password
      };

      this.api.addUser(userData).subscribe({
        next: (response) => {
          this.router.navigate(['/admin/users/manage']);
        },
        error: (error: any) => {
          console.error('Error adding user:', error);
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/users/manage']);
  }
}
