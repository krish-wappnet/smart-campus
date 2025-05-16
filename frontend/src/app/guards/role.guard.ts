import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { Role } from '../core/models/role.enum';
import { selectUserRole } from '../store/auth/auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private store: Store) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const allowedRoles = next.data['roles'] as Role[];
    
    return this.store.select(selectUserRole).pipe(
      map(userRole => {
        if (!userRole) {
          return false;
        }
        return allowedRoles.includes(userRole);
      })
    );
  }
}
