import { ThunkAction, Action } from '@reduxjs/toolkit';
import stateReducer from "../data/state";
import uiReducer from "../data/ui";
import nuggetsReducer from "../data/nuggets";
import errorsReducer from "../data/errors";
import { createDelphinusStore } from 'zkwasm-minirollup-browser';

export const store = createDelphinusStore({
  state: stateReducer,
  ui: uiReducer,
  nuggets: nuggetsReducer,
  errors: errorsReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;