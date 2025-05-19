import { createAction, props } from '@ngrx/store';
import { User } from './auth.interface';

export const authActions = {
  login: createAction(
    '[Auth] Login',
    props<{ email: string; password: string }>()
  ),

  loginSuccess: createAction(
    '[Auth] Login Success',
    props<{ user: User; token: string }>()
  ),

  loginFailure: createAction(
    '[Auth] Login Failure',
    props<{ error: string }>()
  ),

  logout: createAction('[Auth] Logout'),

  clearError: createAction('[Auth] Clear Error')
};
