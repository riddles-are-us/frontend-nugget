import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export enum LoadingType {
  None,
  Default,
  PickNugget,
  ExploreNugget,
  ListNugget,
  RecycleNugget,
  SettleNugget,
  BidNugget,
}

export interface ErrorsState {
  messages: string[];
  loadingType: LoadingType;
}

const initialState: ErrorsState = {
  messages: [],
  loadingType: LoadingType.None,
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
    setLoadingType: (state, d: PayloadAction<LoadingType>) => {
      state.loadingType = d.payload;
    },
  },
});

export const selectError = (state: RootState) =>
  state.errors.messages.length > 0 ? state.errors.messages[0] : "";
export const selectIsLoading = (state: RootState) =>
  state.errors.loadingType != LoadingType.None;
export const selectLoadingType = (state: RootState) => state.errors.loadingType;
export const { pushError, popError, setLoadingType } = errorsSlice.actions;
export default errorsSlice.reducer;
