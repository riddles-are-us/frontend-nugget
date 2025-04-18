import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface ErrorsState {
  messages: string[];
  isloading: boolean;
}

const initialState: ErrorsState = {
  messages: [],
  isloading: false,
};

const errorsSlice = createSlice({
  name: "errors",
  initialState,
  reducers: {
    pushError: (state, d: PayloadAction<string>) => {
      state.messages.push(d.payload);
    },
    popError: (state) => {
      state.messages.shift();
    },
    setIsLoading: (state, d: PayloadAction<boolean>) => {
      state.isloading = d.payload;
    },
  },
});

export const selectError = (state: RootState) => state.errors.messages.length > 0 ? state.errors.messages[0] : "";
export const selectIsLoading = (state: RootState) => state.errors.isloading;
export const { pushError, popError, setIsLoading } = errorsSlice.actions;
export default errorsSlice.reducer;
