import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type browserInfo = {
  id: number;
  name: string;
};

export interface PopUpState {
  open: boolean;
  browserInfo: browserInfo;
}

const initialState: PopUpState = {
  open: true,
  browserInfo: {
    id: 0,
    name: "Test",
  },
};

export const browserSlice = createSlice({
  name: "browser",
  initialState,
  reducers: {
    openBrowser: (state, action: PayloadAction<browserInfo>) => {
      state.browserInfo = action.payload;
      state.open = true;
    },
    closeBrowser: (state) => {
      state.open = false;
    },
  },
});

export const { openBrowser, closeBrowser } = browserSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const getBrowserStatus = (state: RootState) => state.browser.open;
export const getBrowserInfo = (state: RootState) => state.browser.browserInfo;

export default browserSlice.reducer;
