import { createReducer, on } from '@ngrx/store';
import { AuthState } from './auth.interface';
import { authActions } from './auth.actions';
import { StorageService } from '@services/storage.service';

export const authFeatureKey = 'auth';

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(authActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(authActions.loginSuccess, (state, { user, token }) => {
    // Store token and user in storage
    const storage = new StorageService();
    storage.set('auth_token', token);
    storage.set('auth_user', JSON.stringify(user));
    return {
      ...state,
      isAuthenticated: true,
      user,
      token,
      loading: false,
      error: null
    };
  }),
  on(authActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(authActions.logout, (state) => {
    // Clear token and user from storage
    const storage = new StorageService();
    storage.remove('auth_token');
    storage.remove('auth_user');
    return {
      ...state,
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null
    };
  })
);

// Effects to handle storage initialization
export const authEffects = [
  {
    ngrxOnRunInZone: false,
    ngrxOnRunInZoneOnInit: false,
    ngrxOnInit: (actions: any, store: any) => {
      const storage = new StorageService();
      const token = storage.get('auth_token');
      const user = storage.get('auth_user');
      
      if (token && user) {
        store.dispatch(authActions.loginSuccess({
          token,
          user: JSON.parse(user)
        }));
      }
    }
  }
];
