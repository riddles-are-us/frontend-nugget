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

export interface LoadingState {
  loadingType: LoadingType;
}

const initialState: LoadingState = {
  loadingType: LoadingType.None,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoadingType: (state, d: PayloadAction<LoadingType>) => {
      state.loadingType = d.payload;
    },
  },
});

export const selectIsLoading = (state: RootState) =>
  state.loading.loadingType != LoadingType.None;
export const selectLoadingType = (state: RootState) =>
  state.loading.loadingType;
export const { setLoadingType } = loadingSlice.actions;
export default loadingSlice.reducer;
