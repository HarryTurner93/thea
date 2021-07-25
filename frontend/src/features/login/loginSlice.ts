import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../app/store';

export interface LoginState {
  token: string;
  id: number;
}

const initialState: LoginState = {
  token: '',
  id: 0,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<LoginState>) => {
      state.token = action.payload.token;
      state.id = action.payload.id;
    },
  },
});

export const { setLogin } = loginSlice.actions;
export const getLogin = (state: RootState) => {
  return { token: state.login.token, id: state.login.id };
};

export default loginSlice.reducer;
