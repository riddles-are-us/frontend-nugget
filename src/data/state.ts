import {
  createStateSlice,
  PropertiesState,
  ConnectState,
} from "zkwasm-minirollup-browser";
import { RootState } from "../app/store";
import { NuggetData } from "./model";

export interface PlayerInfo {
  nonce: number;
  data: {
    balance: number;
    inventory_size: number;
    inventory: number[];
  };
}

export interface GlobalState {
  cash: number;
  counter: number;
  total: number;
  treasure: number;
  leaderboard: { nuggets: NuggetData[] };
}

const initialState: PropertiesState<PlayerInfo, GlobalState, any> = {
  connectState: ConnectState.OnStart,
  isConnected: false,
  userState: null,
  lastError: null,
  config: null,
};

export const stateSlice = createStateSlice(initialState);

export const selectConnectState = (state: RootState) =>
  state.state.connectState;
export const selectNullableUserState = (state: RootState) =>
  state.state.userState;
export const selectUserState = (state: RootState) => state.state.userState!;
export const selectLastError = (state: RootState) => state.state.lastError;
export const selectNullableConfig = (state: RootState) => state.state.config;
export const selectConfig = (state: RootState) => state.state.config!;

export const { setLastTransactionError, setConnectState } = stateSlice.actions;
export default stateSlice.reducer;
