import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { AccountSliceReducer } from 'zkwasm-minirollup-browser';
import stateReducer from "../data/state";
import uiReducer from "../data/ui";
import nuggetsReducer from "../data/nuggets";

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['acccount/deriveL2Account/fulfilled', 'acccount/deposit/pending', 'acccount/deposit/rejected'],
        ignoredActionPaths: ['payload.web3', 'payload.seed', 'payload.injector', 'meta.arg.cmd'],
        ignoredPaths: [
          "acccount/fetchAccount/fulfilled",
          "account.l1Account.web3",
          "endpoint.zkWasmServiceHelper",
          "status.config.latest_server_checksum",
          "account.l2account",
          "ui.player.data.action",
        ],
      },
    }),
  reducer: {
    account: AccountSliceReducer,
    state: stateReducer,
    ui: uiReducer,
    nuggets: nuggetsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
