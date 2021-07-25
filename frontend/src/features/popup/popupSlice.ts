import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../app/store';

export type popUpCameraID = number;

export interface PopUpState {
  open: boolean;
  popUpCameraID: popUpCameraID;
}

const initialState: PopUpState = {
  open: false,
  popUpCameraID: 0,
};

export const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    openPopUp: (state, action: PayloadAction<popUpCameraID>) => {
      state.popUpCameraID = action.payload;
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
export const getPopUpCameraID = (state: RootState) => state.popup.popUpCameraID;

export default popupSlice.reducer;
