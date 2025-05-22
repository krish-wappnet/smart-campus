import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '@environments/environment';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authReducer } from './store/auth/auth.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({
      auth: authReducer
    }),
    provideEffects(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false
    }),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withInterceptors([
        (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
          const authToken = localStorage.getItem('auth_token');
          if (authToken) {
            const authReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${authToken}`
              }
            });
            return next(authReq);
          }
          return next(req);
        }
      ])
    ),
    {
      provide: 'environment',
      useValue: environment
    }
  ]
};
