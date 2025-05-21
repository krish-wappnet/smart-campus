import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
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
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-edit-user',
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
        <h2 mat-dialog-title>{{ data ? 'Edit User' : 'Create New User' }}</h2>
        <button mat-icon-button (click)="onCancel()" class="close-button" aria-label="Close dialog">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <div class="dialog-content">
        <div class="form-container">
          <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="form-container">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Full Name</mat-label>
              <input matInput 
                    formControlName="name" 
                    placeholder="Enter user's full name"
                    required>
              <mat-icon matSuffix>person</mat-icon>
              <mat-hint>User's full name (3-50 characters)</mat-hint>
              <mat-error *ngIf="userForm.get('name')?.hasError('required')">
                Name is required
              </mat-error>
              <mat-error *ngIf="userForm.get('name')?.hasError('minlength')">
                Name must be at least 3 characters long
              </mat-error>
              <mat-error *ngIf="userForm.get('name')?.hasError('maxlength')">
                Name cannot exceed 50 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Email</mat-label>
              <input matInput 
                    type="email" 
                    formControlName="email" 
                    placeholder="user@example.com"
                    required>
              <mat-icon matSuffix>email</mat-icon>
              <mat-hint>User's email address</mat-hint>
              <mat-error *ngIf="userForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="userForm.get('email')?.hasError('email')">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Role</mat-label>
              <mat-select formControlName="role" required panelClass="role-select-panel" #roleSelect>
                <mat-select-trigger>
                  <span class="role-option">
                    <mat-icon>{{ getSelectedRoleIcon() }}</mat-icon>
                    <span>{{ getSelectedRoleName() }}</span>
                  </span>
                </mat-select-trigger>
                <mat-option *ngFor="let role of roles" [value]="role.value">
                  <span class="role-option">
                    <mat-icon>{{ role.icon }}</mat-icon>
                    <span>{{ role.viewValue }}</span>
                  </span>
                </mat-option>
              </mat-select>
              <mat-hint>Select user's role</mat-hint>
              <mat-error *ngIf="userForm.get('role')?.hasError('required')">
                Role is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Password</mat-label>
              <input matInput 
                    [type]="showPassword ? 'text' : 'password'" 
                    formControlName="password" 
                    [required]="!data"
                    placeholder="••••••••">
              <button type="button" mat-icon-button matSuffix (click)="togglePasswordVisibility()">
                <mat-icon>{{ showPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-hint *ngIf="!data">Minimum 8 characters</mat-hint>
              <mat-hint *ngIf="data">Leave blank to keep current password</mat-hint>
              <mat-error *ngIf="userForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="userForm.get('password')?.hasError('minlength')">
                Password must be at least 8 characters
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
                      [disabled]="!userForm.valid || isSubmitting"
                      class="submit-button">
                <mat-icon *ngIf="!isSubmitting">save</mat-icon>
                <mat-spinner *ngIf="isSubmitting" diameter="20"></mat-spinner>
                <span>{{ isSubmitting ? 'Saving...' : 'Save User' }}</span>
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
        
        .mat-mdc-select-arrow-wrapper {
          display: none; /* Hide the default arrow */
        }
        
        .mat-mdc-select-value {
          display: flex;
          align-items: center;
        }
        
        .mat-mdc-select-trigger {
          .mat-mdc-select-value-text {
            .role-option {
              display: flex;
              align-items: center;
              gap: 8px;
              
              mat-icon {
                font-size: 20px;
                height: 20px;
                width: 20px;
              }
            }
          }
        }
      }
      
      .role-select-panel {
        .mat-mdc-option {
          .role-option {
            display: flex;
            align-items: center;
            gap: 8px;
            
            mat-icon {
              font-size: 20px;
              height: 20px;
              width: 20px;
            }
          }
        }
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
      
      .role-option {
        display: flex;
        align-items: center;
        gap: 8px;
        
        mat-icon {
          font-size: 20px;
          height: 20px;
          width: 20px;
        }
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
        
        &[disabled] {
          background-color: rgba(0, 0, 0, 0.12);
          color: rgba(0, 0, 0, 0.38);
        }
      }
    }
  `]
})
export class EditUserComponent implements OnInit {
  userForm: FormGroup;
  isSubmitting = false;
  showPassword = false;
  
  roles = [
    { value: 'admin', viewValue: 'Admin', icon: 'admin_panel_settings' },
    { value: 'faculty', viewValue: 'Faculty', icon: 'school' },
    { value: 'student', viewValue: 'Student', icon: 'person' }
  ];

  getSelectedRoleIcon(): string {
    const selectedRole = this.roles.find(r => r.value === this.userForm.get('role')?.value);
    return selectedRole ? selectedRole.icon : 'person';
  }

  getSelectedRoleName(): string {
    const selectedRole = this.roles.find(r => r.value === this.userForm.get('role')?.value);
    return selectedRole ? selectedRole.viewValue : 'Select Role';
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      role: ['', [Validators.required]],
      password: ['', [
        ...(this.data ? [] : [Validators.required]),
        Validators.minLength(8)
      ]]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      // If data exists, we're editing an existing user
      this.userForm.patchValue({
        name: this.data.name,
        email: this.data.email,
        role: this.data.role
      });
    } else {
      // If no data, we're creating a new user
      this.userForm.patchValue({
        role: 'student' // Default role for new users
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // Mark all fields as touched to trigger validation messages
    this.userForm.markAllAsTouched();
    
    if (this.userForm.valid) {
      this.isSubmitting = true;
      const userData = { ...this.userForm.value };
      
      // If password is empty and we're editing, remove it from the update
      if (this.data && !userData.password) {
        delete userData.password;
      }
      
      const apiCall = this.data 
        ? this.api.updateUser(this.data.id, userData)
        : this.api.createUser(userData);
      
      apiCall.pipe(
        finalize(() => this.isSubmitting = false)
      ).subscribe({
        next: () => {
          this.snackBar.open(
            this.data ? 'User updated successfully!' : 'User created successfully!', 
            'Close', 
            { duration: 3000, panelClass: ['success-snackbar'] }
          );
          this.dialogRef.close(true);
        },
        error: (error: any) => {
          console.error('Error saving user:', error);
          this.snackBar.open(
            error.error?.message || 'Failed to save user. Please try again.',
            'Dismiss',
            { duration: 5000, panelClass: ['error-snackbar'] }
          );
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
