import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestError, rpc } from 'zkwasm-minirollup-browser';
import { LeHexBN, query } from 'zkwasm-minirollup-rpc';
import { RootState } from '../app/store';
import { Nugget } from './state';

async function queryData(url: string) {
  try {
    const data: any = await rpc.queryData(url)
    return data.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 500) {
        throw new Error("QueryStateError");
      } else {
        throw new Error("UnknownError");
      }
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      throw new Error("No response was received from the server, please check your network connection.");
    } else {
      throw new Error("UnknownError");
    }
  }
}

async function queryBidsI(key: string) {
  const pubkey = new LeHexBN(query(key).pkx).toU64Array();
  return await queryData(`bid/${pubkey[1]}/${pubkey[2]}`);
}

async function queryNuggetsI(page: number) {
  return await queryData(`nuggets`);
}

async function queryNuggetI(nuggetId: number) {
  return await queryData(`nugget/${nuggetId}`);
}

export const getBids = createAsyncThunk(
  'client/getBids',
  async (key: string, { rejectWithValue }) => {
    try {
      const res: any = await queryBidsI(key);
      return res;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
)



export const getNuggets = createAsyncThunk(
  'client/getNuggets',
  async (page: number, { rejectWithValue }) => {
    try {
      const res: any = await queryNuggetsI(page);
      return res;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
)

export const getNugget = createAsyncThunk(
  'client/getNugget',
  async (params: {index: number, nuggetId: number}, { rejectWithValue }) => {
    try {
      const res: any = await queryNuggetI(params.nuggetId);
      return res;
    } catch (err: any) {
      return rejectWithValue(err);
    }
  }
)

export enum ModalIndicator {
  WITHDRAW,
  DEPOSIT,
  RESPONSE,
}

interface UIState {
  modal: null | ModalIndicator;
}

export interface FocusNugget {
  nugget: Nugget,
  index: number | null
}

interface NuggetsState {
  nuggets: Nugget[]
  inventory: Nugget[]
  bids: Nugget[]
  focus: FocusNugget | null
}

export interface PropertiesState {
    nuggets: NuggetsState;
    uiState: UIState;
    lastError: RequestError | null,
    lastResponse: string | null,
}

const initialState: PropertiesState = {
  nuggets: {
    nuggets: [],
    inventory: [], 
    bids:[],
    focus: null,
  },
  lastError: null,
  lastResponse: null,
  uiState: {
    modal: null,
  }
}

const uiSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setUIState: (state, d: PayloadAction<UIState>) => {
      state.uiState = d.payload;
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

export const selectNuggets = (state: RootState) => state.extra.nuggets;
export const selectUIState = (state: RootState) => state.extra.uiState;
export const selectUIResponse = (state: RootState) => state.extra.lastResponse;
export const { setUIState, setUIResponse, setFocus } = uiSlice.actions;
export default uiSlice.reducer;
