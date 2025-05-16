import { createReducer, on } from '@ngrx/store';
import { authActions } from './auth.actions';

export interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(authActions.login, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(authActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null
  })),
  on(authActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(authActions.logout, () => initialState)
);

export const authFeatureKey = 'auth';
