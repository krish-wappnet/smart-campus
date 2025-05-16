import { RouterModule, Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authFeatureKey, authReducer } from '../../store';
import { AuthEffects } from '../../store/auth/auth.effects';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: LoginComponent,
    title: 'Login - Smart Campus'
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    title: 'Register - Smart Campus'
  }
];

export const authConfig = {
  providers: [
    provideRouter(routes),
    provideStore({ auth: authReducer }),
    provideEffects(AuthEffects)
  ]
};
export class AuthModule { }
