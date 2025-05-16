import { createFeatureSelector } from '@ngrx/store';
import { RouterState } from '@ngrx/router-store';

export interface RouterStateUrl {
  url: string;
  queryParams: any;
  params: any;
}

export const selectRouter = createFeatureSelector<RouterState>('router');
