import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestError } from "zkwasm-minirollup-browser";
import { RootState } from "../app/store";

export enum UIStateType {
  Idle,
  WelcomePage,
  TemplatePopup,
  WithdrawPopup,
  DepositPopup,
  ConfirmPopup,
  ErrorPopup,
  InventoryNuggetInfoPopup,
  SellingNuggetInfoPopup,
  AuctionNuggetInfoPopup,
  LotNuggetInfoPopup,
  LeaderRankPopup,
  EarningRankPopup,
}

export type UIState =
  | { type: UIStateType.Idle }
  | { type: UIStateType.WelcomePage }
  | { type: UIStateType.TemplatePopup }
  | { type: UIStateType.WithdrawPopup }
  | { type: UIStateType.DepositPopup }
  | { type: UIStateType.ConfirmPopup; title: string; description: string }
  | { type: UIStateType.ErrorPopup }
  | {
      type: UIStateType.InventoryNuggetInfoPopup;
      nuggetIndex: number;
      isShowingListAmountPopup: boolean;
    }
  | { type: UIStateType.SellingNuggetInfoPopup; nuggetIndex: number }
  | {
      type: UIStateType.AuctionNuggetInfoPopup;
      nuggetIndex: number;
      isShowingBidAmountPopup: boolean;
    }
  | {
      type: UIStateType.LotNuggetInfoPopup;
      nuggetIndex: number;
      isShowingBidAmountPopup: boolean;
    }
  | { type: UIStateType.LeaderRankPopup }
  | { type: UIStateType.EarningRankPopup };

export enum TabState {
  Inventory,
  Selling,
  Auction,
  Lot,
}

export interface PropertiesUIState {
  uiState: UIState;
  tabState: TabState;
  lastError: RequestError | null;
}

const initialState: PropertiesUIState = {
  uiState: { type: UIStateType.WelcomePage },
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
});

export const selectUIState = (state: RootState) => state.ui.uiState;
export const selectTabState = (state: RootState) => state.ui.tabState;
export const { setUIState, setTabState } = uiSlice.actions;
export default uiSlice.reducer;
