import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.interface';
import { authActions } from './auth.actions';

export const authFeatureKey = 'auth';

export const authReducer = createReducer(
  initialAuthState,
  on(authActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(authActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false,
    error: null
  })),
  on(authActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(authActions.register, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(authActions.registerSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    isAuthenticated: true,
    loading: false,
    error: null
  })),
  on(authActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(authActions.logout, () => initialAuthState)
);
