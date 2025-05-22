import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../store/auth/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api/auth';
  private userSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    console.log('Initializing AuthService...');
    
    // Check for token in both possible locations
    const authToken = localStorage.getItem('auth_token');
    const legacyToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    console.log('Found tokens - auth_token:', !!authToken, 'token:', !!legacyToken);
    console.log('Found saved user:', savedUser);
    
    // Use auth_token if available, otherwise fall back to token
    const token = authToken || legacyToken;
    
    if (token) {
      console.log('Token found, processing...');
      this.tokenSubject.next(token);
      
      try {
        // Try to decode the token to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Decoded token payload:', payload);
        
        if (payload && (payload.sub || payload.userId)) {
          const userId = payload.sub || payload.userId;
          console.log('User ID from token:', userId);
          
          // If we have a saved user, use it
          if (savedUser) {
            try {
              const user = JSON.parse(savedUser);
              console.log('Loaded user from localStorage:', user);
              this.userSubject.next(user);
            } catch (e) {
              console.error('Error parsing saved user:', e);
            }
          } else {
            // Otherwise create a minimal user from the token
            const user: User = {
              id: userId,
              email: payload.email || 'unknown@example.com',
              name: payload.name || payload.email?.split('@')[0] || 'User',
              role: payload.role || 'STUDENT',
              status: 'ACTIVE',
              createdAt: new Date(),
              updatedAt: new Date()
            };
            console.log('Created user from token:', user);
            this.userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));
          }
        }
      } catch (e) {
        console.error('Error processing token:', e);
      }
    } else {
      console.log('No token found in localStorage');
    }
  }

  get user$(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  get token$(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  login(email: string, password: string): Observable<{ user: User; token: string }> {
    return this.http.post<{ user: User; token: string }>(`${this.API_URL}/login`, {
      email,
      password
    }).pipe(
      map((response: { user: User; token: string }) => {
        this.setUser(response.user);
        this.setToken(response.token);
        return response;
      })
    );
  }

  logout(): void {
    this.clearAuth();
  }

  clearAuth(): void {
    this.userSubject.next(null);
    this.tokenSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  private setUser(user: User): void {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private setToken(token: string): void {
    this.tokenSubject.next(token);
    // Store in both 'token' and 'auth_token' for compatibility
    localStorage.setItem('token', token);
    localStorage.setItem('auth_token', token);
  }
  
  // Add a method to get the current user synchronously
  getCurrentUser(): User | null {
    return this.userSubject.value;
  }
}
