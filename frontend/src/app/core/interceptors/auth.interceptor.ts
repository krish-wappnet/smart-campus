import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, throwError } from 'rxjs';
import { authActions } from '../../store/auth/auth.actions';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const store = inject(Store);
  
  // Get the auth token from local storage
  const token = localStorage.getItem('token');
  let authReq = req;

  // Clone the request and add the authorization header if token exists
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Handle the request and catch any errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // If 401 Unauthorized, dispatch logout action and redirect to login
        store.dispatch(authActions.logout());
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
