import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import loginReducer from "../features/login/loginSlice";
import counterReducer from "../features/counter/counterSlice";
import popupReducer from "../features/popup/popupSlice";
import browserReducer from "../features/browser/browserSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    counter: counterReducer,
    popup: popupReducer,
    browser: browserReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
