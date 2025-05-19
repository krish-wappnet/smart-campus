import { Injectable } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const requiredRoles = route.data['roles'] as string[];
    
    // If user has a role but doesn't match required roles
    if (decoded.role && !requiredRoles?.includes(decoded.role)) {
      // Redirect based on role
      switch (decoded.role) {
        case 'faculty':
          this.router.navigate(['/faculty/dashboard']);
          break;
        case 'student':
          this.router.navigate(['/student/dashboard']);
          break;
        case 'admin':
          this.router.navigate(['/admin/dashboard']);
          break;
        default:
          this.router.navigate(['/auth/login']);
      }
      return false;
    }
    return true;
  }
}
