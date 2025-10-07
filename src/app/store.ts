import { ThunkAction, Action } from "@reduxjs/toolkit";
import stateReducer from "../data/state";
import uiReducer from "../data/ui";
import nuggetsReducer from "../data/nuggets";
import errorReducer from "../data/error";
import loadingReducer from "../data/loading";
import { createDelphinusStore } from "zkwasm-minirollup-browser";

export const store = createDelphinusStore({
  state: stateReducer,
  ui: uiReducer,
  nuggets: nuggetsReducer,
  error: errorReducer,
  loading: loadingReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
