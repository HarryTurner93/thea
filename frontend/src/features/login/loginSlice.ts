import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface LoginState {
  token: string;
}

const initialState: LoginState = {
  token: "",
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    }
  }
});

export const { setToken } = loginSlice.actions;
export const getToken = (state: RootState) => state.login.token;

export default loginSlice.reducer;
