import { createEntityAdapter, EntityState } from '@ngrx/entity';
import * as KonpayActions from 'src/app/model/actions/v-hospitality.action';
import { Actions } from 'src/app/model/actions/v-hospitality.action';
import { Profile } from 'src/app/model/v-hospitality';

interface ProfileState extends EntityState<Profile> {
  total: number;
}

export interface State {
  profile: ProfileState;
}

const adapterProfile = createEntityAdapter<Profile>();

const ProfileInitialState: ProfileState = adapterProfile.getInitialState({
  total: 0,
});

const initialState = {
  profile: ProfileInitialState,
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    // Profile
    case KonpayActions.ExampleActionTypes.GetProfile:
      return {
        ...state,
        profile: adapterProfile.addMany(action.Profilepayload, state.profile),
      };

    case KonpayActions.ExampleActionTypes2.GetProfile:
      return { ...state, profile: adapterProfile.removeOne(1, state.profile) };

    default:
      return state;
  }
}

export const selectProfileState = (state: State) => state.profile;

export const { selectAll: selectAllProfile } = adapterProfile.getSelectors();
