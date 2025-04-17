import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface ErrorsState {
  messages: string[];
}

const initialState: ErrorsState = {
  messages: [],
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
    }
  },
});

export const selectError = (state: RootState) => state.errors.messages.length > 0 ? state.errors.messages[0] : "";
export const { pushError, popError } = errorsSlice.actions;
export default errorsSlice.reducer;
