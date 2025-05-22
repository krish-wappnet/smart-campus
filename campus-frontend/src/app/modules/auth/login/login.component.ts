import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from '@services/storage.service';

import { AuthState } from '../../../store/auth/auth.interface';
import { authActions } from '../../../store/auth/auth.actions';
import { selectError, selectIsAuthenticated, selectLoading } from '../../../store/auth/auth.selectors';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Welcome Back</mat-card-title>
          <mat-card-subtitle>Please sign in to continue</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" required>
              <mat-error *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" required>
              <mat-error *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                Password must be at least 6 characters long
              </mat-error>
            </mat-form-field>

            <mat-checkbox formControlName="remember">Remember me</mat-checkbox>

            <div class="form-actions">
              <button 
                mat-raised-button 
                color="primary" 
                type="submit" 
                [disabled]="!loginForm.valid || (loading$ | async)"
                [class.loading]="loading$ | async">
                <mat-spinner *ngIf="loading$ | async" diameter="20" class="spinner"></mat-spinner>
                <span *ngIf="!(loading$ | async)">Login</span>
              </button>
            </div>

            <div class="links">
              <a routerLink="/forgot-password">Forgot Password?</a>
              <a routerLink="/signup">Create Account</a>
            </div>
          </form>
        </mat-card-content>

        <mat-card-footer>
          <div class="error-message" *ngIf="error$ | async as error">
            <mat-icon>error_outline</mat-icon>
            {{ error }}
          </div>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    mat-card {
      width: 100%;
      max-width: 400px;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    mat-card-header {
      text-align: center;
      padding: 24px;
    }

    mat-card-title {
      font-size: 24px;
      font-weight: 600;
      color: #1a237e;
    }

    mat-card-subtitle {
      color: #666;
      margin-top: 8px;
    }

    mat-card-content {
      padding: 24px;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: center;
      margin-top: 24px;
    }

    button.loading {
      opacity: 0.8;
    }

    .spinner {
      margin-right: 8px;
    }

    .links {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      font-size: 14px;
    }

    .error-message {
      display: flex;
      align-items: center;
      color: #d32f2f;
      padding: 12px;
      background: #ffebee;
      border-radius: 4px;
      margin-top: 16px;
    }

    mat-icon {
      margin-right: 8px;
    }

    @media (max-width: 480px) {
      mat-card {
        margin: 16px;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error$: Observable<string | null>;
  loading$: Observable<boolean>;

  private fb = inject(FormBuilder);
  private store = inject(Store<{ auth: AuthState }>);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private http = inject(HttpClient);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
    this.error$ = this.store.select(selectError);
    this.loading$ = this.store.select(selectLoading);
  }

  ngOnInit(): void {
    this.store.select(selectIsAuthenticated).subscribe(authenticated => {
      if (authenticated) {
        this.router.navigate(['/admin']);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password, remember } = this.loginForm.value;
      this.http.post(`${environment.apiUrl}/auth/login`, {
        email,
        password
      }).subscribe({
        next: (response: any) => {
          // Store token in localStorage
          localStorage.setItem('auth_token', response.accessToken);
          
          // Store user data if remember me is checked
          if (remember) {
            localStorage.setItem('auth_user', JSON.stringify(response.user));
          }

          // Dispatch login success action
          this.store.dispatch(authActions.loginSuccess({
            user: response.user,
            token: response.accessToken
          }));

          // Navigate based on user role
          const redirectPath = response.user.role === 'admin' ? '/admin' : 
                             response.user.role === 'faculty' ? '/faculty' : 
                             response.user.role === 'student' ? '/student' : '/login';
          this.router.navigate([redirectPath]);
        },
        error: (error: any) => {
          this.snackBar.open('Login failed: ' + error.error?.message || 'An error occurred', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
