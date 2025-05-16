import { ActionReducer, MetaReducer, ActionReducerMap } from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromAuth from './auth';
import * as fromAdmin from '../modules/admin/store';
import { RouterStateUrl } from './router.state';

export interface AppState {
  auth: fromAuth.AuthState;
  admin: fromAdmin.AdminState;
  router: RouterStateUrl;
}

import { routerReducer } from '@ngrx/router-store';

export const reducers: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  admin: fromAdmin.adminReducer,
  router: routerReducer
};

export const authFeatureKey = 'auth';
export const adminFeatureKey = 'admin';

// Export feature store reducers
export const authReducer = fromAuth.authReducer;
export const adminReducer = fromAdmin.adminReducer;

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];

// Export appReducers as an alias for reducers for backward compatibility
export const appReducers = reducers;

export * from './auth';

// Export types
export * from '@ngrx/store';

export interface Action {
  type: string;
  payload?: any;
}
