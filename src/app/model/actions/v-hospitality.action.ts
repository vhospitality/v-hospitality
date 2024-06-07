import { Action } from '@ngrx/store';
import {
  Profile,
} from '../v-hospitality';

export enum ExampleActionTypes {
  GetProfile = '[Profile API] Get Profile',
}

export enum ExampleActionTypes2 {
  GetProfile = '[Profile API] Remove Profile',
}

// Profile

// Section 2
export const ADD_PROFILE = '[PROFILE] Add';
export const REMOVE_PROFILE = '[PROFILE] Remove';

// Section 3
export class AddProfile implements Action {
  public readonly type = ExampleActionTypes.GetProfile;

  constructor(public Profilepayload: Profile[]) {}
}

export class RemoveProfile implements Action {
  public readonly type = ExampleActionTypes2.GetProfile;

  constructor(public Profilepayload: any) {}
}


export type Actions =
  | AddProfile
  | RemoveProfile