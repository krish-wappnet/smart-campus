import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { authActions } from './auth.actions';

export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);

  constructor() { }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.login),
      exhaustMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map(({ user, token }) => authActions.loginSuccess({ user, token })),
          catchError(error => of(authActions.loginFailure({ error: error.message })))
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.register),
      exhaustMap(({ name, email, password, role }) =>
        this.authService.register(name, email, password, role).pipe(
          map(({ user, token }) => authActions.registerSuccess({ user, token })),
          catchError(error => of(authActions.registerFailure({ error: error.message })))
        )
      )
    )
  );
}