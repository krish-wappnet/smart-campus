import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.interface';
import { authFeatureKey } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

export const selectError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);
