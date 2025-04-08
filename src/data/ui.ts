import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestError } from 'zkwasm-minirollup-browser';
import { RootState } from '../app/store';
import { NuggetData } from './model';
import { getNuggets, getNugget, getBids } from '../old/request';

export enum UIState{
	Idle,
	WelcomePage,
	QueryWithdraw,
	WithdrawPopup,
	QueryDeposit,
	DepositPopup,
	ConfirmPopup,
	ErrorPopup,
}

export enum ModalIndicator {
  WITHDRAW,
  DEPOSIT,
  RESPONSE,
}

export interface FocusNugget {
  nugget: NuggetData,
  index: number | null
}

interface NuggetsData {
  nuggets: NuggetData[]
  inventory: NuggetData[]
  bids: NuggetData[]
  focus: FocusNugget | null
}

export interface PropertiesUIState {
    uiState: UIState;
    nuggetsData: NuggetsData;
    uiModal: null | ModalIndicator;
    lastError: RequestError | null,
    lastResponse: string | null,
}

const initialState: PropertiesUIState = {
	uiState: UIState.WelcomePage,
  nuggetsData: {
    nuggets: [],
    inventory: [], 
    bids:[],
    focus: null,
  },
  lastError: null,
  lastResponse: null,
  uiModal: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setUIModal: (state, d) => {
      state.uiModal = d.payload.modal;
    },
    setUIResponse: (state, d: PayloadAction<string>) => {
      state.lastResponse = d.payload;
    },
    setFocus: (state, d: PayloadAction<FocusNugget | null>) => {
      state.nuggetsData.focus = d.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getNuggets.fulfilled, (state, action) => {
        state.nuggetsData.nuggets = action.payload;
      })
      .addCase(getNuggets.rejected, (state, action) => {
        state.lastError = {
          errorInfo:`send transaction rejected: ${action.payload}`,
          payload: action.payload,
        }
      })
      .addCase(getNugget.fulfilled, (state, action) => {
        const nugget = action.payload[0];
        state.nuggetsData.inventory[action.meta.arg.index] = nugget;
      })
      .addCase(getNugget.rejected, (state, action) => {
        state.lastError = {
          errorInfo:`send transaction rejected: ${action.payload}`,
          payload: action.payload,
        }
      })
      .addCase(getBids.fulfilled, (state, action) => {
        state.nuggetsData.bids = action.payload;
      })
      .addCase(getBids.rejected, (state, action) => {
        state.lastError = {
          errorInfo:`send transaction rejected: ${action.payload}`,
          payload: action.payload,
        }
      })
  }
});

export const selectUIState = (state: RootState) => state.ui.uiState;
export const selectNuggetsData = (state: RootState) => state.ui.nuggetsData;
export const selectUIModal = (state: RootState) => state.ui.uiModal;
export const selectUIResponse = (state: RootState) => state.ui.lastResponse;
export const { setUIModal, setUIResponse, setFocus } = uiSlice.actions;
export default uiSlice.reducer;
