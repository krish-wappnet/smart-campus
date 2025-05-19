import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { authActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.login),
      switchMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map(({ user, token }) => authActions.loginSuccess({ user, token })),
          catchError(error => of(authActions.loginFailure({ error: error.message })))
        )
      )
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logout),
      map(() => {
        this.authService.clearAuth();
        return authActions.logout();
      })
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService
  ) {}
}
