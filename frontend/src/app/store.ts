import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import browserReducer from '../features/browser/browserSlice';
import loginReducer from '../features/login/loginSlice';
import popupReducer from '../features/popup/popupSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
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
