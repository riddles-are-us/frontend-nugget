import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestError } from "zkwasm-minirollup-browser";
import { RootState } from "../app/store";
import { NuggetData } from "./model";
import { getNuggets, getNugget, getBids } from "../old/request";

export enum UIStateType {
  Idle,
  WelcomePage,
  TemplatePopup,
  QueryWithdraw,
  WithdrawPopup,
  QueryDeposit,
  DepositPopup,
  ConfirmPopup,
  ErrorPopup,
  NuggetInfoPopup,
}

export type UIState = 
  { type: UIStateType.Idle} |
  { type: UIStateType.WelcomePage} |
  { type: UIStateType.TemplatePopup} |
  { type: UIStateType.QueryWithdraw} |
  { type: UIStateType.WithdrawPopup} |
  { type: UIStateType.QueryDeposit} |
  { type: UIStateType.DepositPopup} |
  { type: UIStateType.ConfirmPopup} |
  { type: UIStateType.ErrorPopup} |
  { type: UIStateType.NuggetInfoPopup; nuggetData: NuggetData };

export enum TabState {
  Inventory,
  Market,
  Bid,
}

export enum ModalIndicator {
  WITHDRAW,
  DEPOSIT,
  RESPONSE,
}

export interface FocusNugget {
  nugget: NuggetData;
  index: number | null;
}

interface NuggetsData {
  market: NuggetData[];
  inventory: NuggetData[];
  bid: NuggetData[];
  focus: FocusNugget | null;
}

export interface PropertiesUIState {
  uiState: UIState;
  tabState: TabState;
  nuggetsData: NuggetsData;
  uiModal: null | ModalIndicator;
  lastError: RequestError | null;
  lastResponse: string | null;
}

const initialState: PropertiesUIState = {
  uiState: {type: UIStateType.WelcomePage},
  tabState: TabState.Inventory,
  nuggetsData: {
    market: [],
    inventory: [],
    bid: [],
    focus: null,
  },
  lastError: null,
  lastResponse: null,
  uiModal: null,
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
    setUIModal: (state, d) => {
      state.uiModal = d.payload.modal;
    },
    setUIResponse: (state, d: PayloadAction<string>) => {
      state.lastResponse = d.payload;
    },
    setFocus: (state, d: PayloadAction<FocusNugget | null>) => {
      state.nuggetsData.focus = d.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getNuggets.fulfilled, (state, action) => {
        state.nuggetsData.market = action.payload;
      })
      .addCase(getNuggets.rejected, (state, action) => {
        state.lastError = {
          errorInfo: `send transaction rejected: ${action.payload}`,
          payload: action.payload,
        };
      })
      .addCase(getNugget.fulfilled, (state, action) => {
        const nugget = action.payload[0];
        state.nuggetsData.inventory[action.meta.arg.index] = nugget;
      })
      .addCase(getNugget.rejected, (state, action) => {
        state.lastError = {
          errorInfo: `send transaction rejected: ${action.payload}`,
          payload: action.payload,
        };
      })
      .addCase(getBids.fulfilled, (state, action) => {
        state.nuggetsData.bid = action.payload;
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
export const selectNuggetsData = (state: RootState) => state.ui.nuggetsData;
export const selectUIModal = (state: RootState) => state.ui.uiModal;
export const selectUIResponse = (state: RootState) => state.ui.lastResponse;
export const { setUIState, setTabState, setUIModal, setUIResponse, setFocus } = uiSlice.actions;
export default uiSlice.reducer;
