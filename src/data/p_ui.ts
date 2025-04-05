import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestError } from 'zkwasm-minirollup-browser';
import { RootState } from '../app/store';
import { Nugget } from './model';
import { getNuggets, getNugget, getBids } from '../components/request';

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
  nugget: Nugget,
  index: number | null
}

interface NuggetsData {
  nuggets: Nugget[]
  inventory: Nugget[]
  bids: Nugget[]
  focus: FocusNugget | null
}

export interface PropertiesUIState {
    uiState: UIState;
    nuggets: NuggetsData;
    uiModal: null | ModalIndicator;
    lastError: RequestError | null,
    lastResponse: string | null,
}

const initialState: PropertiesUIState = {
	uiState: UIState.WelcomePage,
  nuggets: {
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
      state.nuggets.focus = d.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getNuggets.fulfilled, (state, action) => {
        state.nuggets.nuggets = action.payload;
      })
      .addCase(getNuggets.rejected, (state, action) => {
        state.lastError = {
          errorInfo:`send transaction rejected: ${action.payload}`,
          payload: action.payload,
        }
      })
      .addCase(getNugget.fulfilled, (state, action) => {
        const nugget = action.payload[0];
        state.nuggets.inventory[action.meta.arg.index] = nugget;
      })
      .addCase(getNugget.rejected, (state, action) => {
        state.lastError = {
          errorInfo:`send transaction rejected: ${action.payload}`,
          payload: action.payload,
        }
      })
      .addCase(getBids.fulfilled, (state, action) => {
        state.nuggets.bids = action.payload;
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
export const selectNuggets = (state: RootState) => state.ui.nuggets;
export const selectUIModal = (state: RootState) => state.ui.uiModal;
export const selectUIResponse = (state: RootState) => state.ui.lastResponse;
export const { setUIModal, setUIResponse, setFocus } = uiSlice.actions;
export default uiSlice.reducer;
