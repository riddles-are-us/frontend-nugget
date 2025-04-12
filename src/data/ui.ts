import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestError } from "zkwasm-minirollup-browser";
import { RootState } from "../app/store";
import { NuggetData } from "./model";
import { getNuggets, getNugget, getBids } from "../game/scripts/request";

export enum UIStateType {
  Idle,
  WelcomePage,
  TemplatePopup,
  WithdrawPopup,
  DepositPopup,
  ConfirmPopup,
  ErrorPopup,
  InventoryNuggetInfoPopup,
  MarketNuggetInfoPopup,
  BidNuggetInfoPopup,
}

export type UIState = 
  { type: UIStateType.Idle} |
  { type: UIStateType.WelcomePage} |
  { type: UIStateType.TemplatePopup} |
  { type: UIStateType.WithdrawPopup} |
  { type: UIStateType.DepositPopup} |
  { type: UIStateType.ConfirmPopup} |
  { type: UIStateType.ErrorPopup} |
  { type: UIStateType.InventoryNuggetInfoPopup; nuggetIndex: number; } |
  { type: UIStateType.MarketNuggetInfoPopup; nuggetIndex: number; } |
  { type: UIStateType.BidNuggetInfoPopup; nuggetIndex: number; };

export enum TabState {
  Inventory,
  Market,
  Bid,
}

export interface PropertiesUIState {
  uiState: UIState;
  tabState: TabState;
  lastError: RequestError | null;
}

const initialState: PropertiesUIState = {
  uiState: {type: UIStateType.WelcomePage},
  tabState: TabState.Inventory,
  lastError: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setUIState: (state, d: PayloadAction<UIState>) => {
      state.uiState = d.payload;
    },
    setTabState: (state, d: PayloadAction<TabState>) => {
      state.tabState = d.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getNuggets.rejected, (state, action) => {
        state.lastError = {
          errorInfo: `send transaction rejected: ${action.payload}`,
          payload: action.payload,
        };
      })
      .addCase(getNugget.rejected, (state, action) => {
        state.lastError = {
          errorInfo: `send transaction rejected: ${action.payload}`,
          payload: action.payload,
        };
      })
      .addCase(getBids.rejected, (state, action) => {
        state.lastError = {
          errorInfo: `send transaction rejected: ${action.payload}`,
          payload: action.payload,
        };
      });
  },
});

export const selectUIState = (state: RootState) => state.ui.uiState;
export const selectTabState = (state: RootState) => state.ui.tabState;
export const { setUIState, setTabState } = uiSlice.actions;
export default uiSlice.reducer;
