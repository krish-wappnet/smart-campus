import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.store.select(selectIsAuthenticated).subscribe(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}
