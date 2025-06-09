import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import {
  emptyNuggetData,
  emptyNuggetTabData,
  NuggetData,
  NuggetPageData,
  NuggetTabData,
} from "./model";
import { queryState } from "../game/scripts/request";
import { sendTransaction } from "zkwasm-minirollup-browser/src/connect";
import { TabState } from "./ui";
import { isEqual } from "../game/scripts/common/Utility";

export interface NuggetsState {
  inventory: number[];
  inventoryCache: number[] | null;
  inventoryNuggetTab: NuggetTabData;
  sellingNuggetTab: NuggetTabData;
  auctionNuggetTab: NuggetTabData;
  lotNuggetTab: NuggetTabData;
  forceUpdate: boolean;
}

const initialState: NuggetsState = {
  inventory: [],
  inventoryCache: null,
  inventoryNuggetTab: emptyNuggetTabData,
  sellingNuggetTab: emptyNuggetTabData,
  auctionNuggetTab: emptyNuggetTabData,
  lotNuggetTab: emptyNuggetTabData,
  forceUpdate: false,
};

const nuggetsSlice = createSlice({
  name: "nuggets",
  initialState,
  reducers: {
    setNugget: (state, d: PayloadAction<NuggetData>) => {
      const index = state.inventoryNuggetTab.nuggets.findIndex(
        (nugget) => nugget.id === d.payload.id
      );
      if (index !== -1) {
        state.inventoryNuggetTab.nuggets[index] = d.payload;
      }
    },
    setInventoryNuggetTab: (state, d: PayloadAction<NuggetTabData>) => {
      state.inventoryCache = state.inventory;
      state.inventoryNuggetTab = d.payload;
    },
    resetSellingNuggetTab: (state) => {
      state.sellingNuggetTab = emptyNuggetTabData;
    },
    addSellingNuggetTab: (state, d: PayloadAction<NuggetTabData>) => {
      state.sellingNuggetTab.nuggets.push(...d.payload.nuggets);
      state.sellingNuggetTab.nuggetCount = d.payload.nuggetCount;
    },
    resetAuctionNuggetTab: (state) => {
      state.auctionNuggetTab = emptyNuggetTabData;
    },
    addAuctionNuggetTab: (state, d: PayloadAction<NuggetTabData>) => {
      state.auctionNuggetTab.nuggets.push(...d.payload.nuggets);
      state.auctionNuggetTab.nuggetCount = d.payload.nuggetCount;
    },
    resetLotNuggetTab: (state) => {
      state.lotNuggetTab = emptyNuggetTabData;
    },
    addLotNuggetTab: (state, d: PayloadAction<NuggetTabData>) => {
      state.lotNuggetTab.nuggets.push(...d.payload.nuggets);
      state.lotNuggetTab.nuggetCount = d.payload.nuggetCount;
    },
    setNuggetsForceUpdate: (state, d: PayloadAction<boolean>) => {
      state.forceUpdate = d.payload;
    },
    clearInventoryCache: (state) => {
      state.inventoryCache = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(queryState.fulfilled, (state, action) => {
        if (action.payload.player) {
          state.inventory = action.payload.player.data.inventory;
        }
      })
      .addCase(sendTransaction.fulfilled, (state, action) => {
        if (action.payload.player) {
          state.inventory = action.payload.player.data.inventory;
        }
      });
  },
});

export const selectNugget =
  (tabState: TabState, nuggetIndex: number) => (state: RootState) => {
    if (tabState == TabState.Inventory) {
      return state.nuggets.inventoryNuggetTab.nuggets[nuggetIndex];
    } else if (tabState == TabState.Selling) {
      return state.nuggets.sellingNuggetTab.nuggets[nuggetIndex];
    } else if (tabState == TabState.Auction) {
      return state.nuggets.auctionNuggetTab.nuggets[nuggetIndex];
    } else if (tabState == TabState.Lot) {
      return state.nuggets.lotNuggetTab.nuggets[nuggetIndex];
    }
    return emptyNuggetData;
  };
export const selectIsInventoryChanged = (state: RootState): boolean =>
  state.nuggets.inventoryCache == null ||
  !isEqual(state.nuggets.inventory, state.nuggets.inventoryCache);
export const selectInventoryNuggetTab = (state: RootState): NuggetTabData =>
  state.nuggets.inventoryNuggetTab;
export const selectSellingNuggetTab = (state: RootState): NuggetTabData =>
  state.nuggets.sellingNuggetTab;
export const selectAuctionNuggetTab = (state: RootState): NuggetTabData =>
  state.nuggets.auctionNuggetTab;
export const selectLotNuggetTab = (state: RootState): NuggetTabData =>
  state.nuggets.lotNuggetTab;
export const selectNuggetsForceUpdate = (state: RootState): boolean =>
  state.nuggets.forceUpdate;

export const {
  setNugget,
  setInventoryNuggetTab,
  resetSellingNuggetTab,
  addSellingNuggetTab,
  resetAuctionNuggetTab,
  addAuctionNuggetTab,
  resetLotNuggetTab,
  addLotNuggetTab,
  setNuggetsForceUpdate,
  clearInventoryCache,
} = nuggetsSlice.actions;
export default nuggetsSlice.reducer;
