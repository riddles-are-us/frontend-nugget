import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestError } from "zkwasm-minirollup-browser/dist/store/app-slice";
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
  RankPopup,
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
  | { type: UIStateType.RankPopup };

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

  // extraReducers: (builder) => {
  //   builder
  //     .addCase(getNuggets.rejected, (state, action) => {
  //       state.lastError = {
  //         errorInfo: `send transaction rejected: ${action.payload}`,
  //         payload: action.payload,
  //       };
  //     })
  // },
});

export const selectUIState = (state: RootState) => state.ui.uiState;
export const selectTabState = (state: RootState) => state.ui.tabState;
export const { setUIState, setTabState } = uiSlice.actions;
export default uiSlice.reducer;
