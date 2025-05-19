import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../store/auth/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api/auth';
  private userSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      this.userSubject.next(JSON.parse(savedUser));
      this.tokenSubject.next(savedToken);
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
      map(response => {
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
    localStorage.setItem('token', token);
  }
}
