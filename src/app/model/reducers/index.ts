import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import * as fromExample from './v-hospitality.reducers';

export interface AppState {
  example: fromExample.State;
}

export const reducers: ActionReducerMap<AppState, any> = {
  example: fromExample.reducer,
};

// Example selectors
export const selectExampleModule =
  createFeatureSelector<fromExample.State>('example');

export const selectProfileState = createSelector(
  selectExampleModule,
  fromExample.selectProfileState
);

// //
export const selectAllProfile = createSelector(
  selectProfileState,
  fromExample.selectAllProfile
);
