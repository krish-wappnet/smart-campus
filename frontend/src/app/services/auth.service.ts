import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../store/auth/auth.interface';

interface LoginResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ user: User; token: string }> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(response => {
        const { user, token } = response;
        localStorage.setItem('token', token);
        return { user, token };
      }),
      catchError(error => {
        return throwError(() => error.error.message || 'An error occurred');
      })
    );
  }

  register(name: string, email: string, password: string, role: string): Observable<{ user: User; token: string }> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, { name, email, password, role }).pipe(
      map(response => {
        const { user, token } = response;
        localStorage.setItem('token', token);
        return { user, token };
      }),
      catchError(error => {
        return throwError(() => error.error.message || 'An error occurred');
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getHeaders(): { headers: { Authorization: string } } {
    const token = this.getToken();
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }
}
