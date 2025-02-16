import { RootState } from "../app/store";
import { createStateSlice, PropertiesState, ConnectState } from "zkwasm-minirollup-browser";

export interface PlayerInfo {
  nonce: number;
  data: {
    balance: number;
    inventory_size: number;
    inventory: number[];
  };
}

export interface GlobalState {
  total: number;
  counter: number;
}

export interface Bid {
  bidprice: number;
}

export interface Nugget {
  id: number;
  attributes: number[];
  cycle: number;
  sysprice: number;
  askprice: number;
  bid: Bid | null;
}

const initialState: PropertiesState<PlayerInfo, GlobalState, any> = {
    connectState: ConnectState.Init,
    userState: null,
    lastError: null,
    config: null,
};

export const propertiesSlice = createStateSlice(initialState);

export const selectConnectState = (state: RootState) => state.state.connectState;
export const selectUserState = (state: RootState) => state.state.userState;

export const { setConnectState } = propertiesSlice.actions;
export default propertiesSlice.reducer;
