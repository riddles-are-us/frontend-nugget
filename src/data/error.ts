import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface ErrorState {
  messages: string[];
}

const initialState: ErrorState = {
  messages: [],
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    pushError: (state, d: PayloadAction<string>) => {
      state.messages.push(d.payload);
    },
    popError: (state) => {
      state.messages.shift();
    },
  },
});

export const selectError = (state: RootState) =>
  state.error.messages.length > 0 ? state.error.messages[0] : "";
export const { pushError, popError } = errorSlice.actions;
export default errorSlice.reducer;
