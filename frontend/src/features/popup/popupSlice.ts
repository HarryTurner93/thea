import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type popUpInfo = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  numImages: number;
};

export interface PopUpState {
  open: boolean;
  popUpInfo: popUpInfo;
}

const initialState: PopUpState = {
  open: false,
  popUpInfo: {
    id: 0,
    name: "",
    latitude: 0,
    longitude: 0,
    numImages: 0,
  },
};

export const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    openPopUp: (state, action: PayloadAction<popUpInfo>) => {
      state.popUpInfo = action.payload;
      state.open = true;
    },
    closePopUp: (state) => {
      state.open = false;
    },
  },
});

export const { openPopUp, closePopUp } = popupSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const getPopUpStatus = (state: RootState) => state.popup.open;
export const getPopUpInfo = (state: RootState) => state.popup.popUpInfo;

export default popupSlice.reducer;
