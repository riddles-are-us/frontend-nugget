import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import {
  emptyNuggetData,
  emptyNuggetPageData,
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
  inventoryCache: number[];
  inventoryNuggetTab: NuggetTabData;
  sellingNuggetTab: NuggetTabData;
  auctionNuggetTab: NuggetTabData;
  lotNuggetTab: NuggetTabData;
}

const initialState: NuggetsState = {
  inventory: [],
  inventoryCache: [],
  inventoryNuggetTab: emptyNuggetTabData,
  sellingNuggetTab: emptyNuggetTabData,
  auctionNuggetTab: emptyNuggetTabData,
  lotNuggetTab: emptyNuggetTabData,
};

const nuggetsSlice = createSlice({
  name: "nuggets",
  initialState,
  reducers: {
    setNugget: (state, d: PayloadAction<NuggetData>) => {
      // const nugget = d.payload;
      // state.nuggets[nugget.id] = nugget;
    },
    setInventoryNuggetTab: (state, d: PayloadAction<NuggetTabData>) => {
      state.inventoryCache = state.inventory;
      state.inventoryNuggetTab = d.payload;
    },
    resetSellingNuggetTab: (state, d: PayloadAction<NuggetTabData>) => {
      state.sellingNuggetTab.nuggets = d.payload.nuggets;
      state.sellingNuggetTab.nuggetCount = d.payload.nuggetCount;
    },
    addSellingNuggetTab: (state, d: PayloadAction<NuggetTabData>) => {
      state.sellingNuggetTab.nuggets.push(...d.payload.nuggets);
      state.sellingNuggetTab.nuggetCount = d.payload.nuggetCount;
    },
    resetAuctionNuggetTab: (state, d: PayloadAction<NuggetTabData>) => {
      state.auctionNuggetTab.nuggets = d.payload.nuggets;
      state.auctionNuggetTab.nuggetCount = d.payload.nuggetCount;
    },
    addAuctionNuggetTab: (state, d: PayloadAction<NuggetTabData>) => {
      state.auctionNuggetTab.nuggets.push(...d.payload.nuggets);
      state.auctionNuggetTab.nuggetCount = d.payload.nuggetCount;
    },
    resetLotNuggetTab: (state, d: PayloadAction<NuggetTabData>) => {
      state.lotNuggetTab.nuggets = d.payload.nuggets;
      state.lotNuggetTab.nuggetCount = d.payload.nuggetCount;
    },
    addLotNuggetTab: (state, d: PayloadAction<NuggetTabData>) => {
      state.lotNuggetTab.nuggets.push(...d.payload.nuggets);
      state.lotNuggetTab.nuggetCount = d.payload.nuggetCount;
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

export const selectNuggetPageNeedsUpdate =
  (tabState: TabState, page: number, pageSize: number) =>
  (state: RootState) => {
    if (tabState == TabState.Inventory) {
      return (
        state.nuggets.inventoryNuggetTab.nuggetCount == -1 ||
        !isEqual(state.nuggets.inventory, state.nuggets.inventoryCache)
      );
    } else if (tabState == TabState.Selling) {
      return (
        state.nuggets.sellingNuggetTab.nuggetCount == -1 ||
        (state.nuggets.sellingNuggetTab.nuggetCount >
          state.nuggets.sellingNuggetTab.nuggets.length &&
          (page + 1) * pageSize >=
            state.nuggets.sellingNuggetTab.nuggets.length)
      );
    } else if (tabState == TabState.Auction) {
      return (
        state.nuggets.auctionNuggetTab.nuggetCount == -1 ||
        (state.nuggets.auctionNuggetTab.nuggetCount >
          state.nuggets.auctionNuggetTab.nuggets.length &&
          (page + 1) * pageSize >=
            state.nuggets.auctionNuggetTab.nuggets.length)
      );
    } else if (tabState == TabState.Lot) {
      return (
        state.nuggets.lotNuggetTab.nuggetCount == -1 ||
        (state.nuggets.lotNuggetTab.nuggetCount >
          state.nuggets.lotNuggetTab.nuggets.length &&
          (page + 1) * pageSize >= state.nuggets.lotNuggetTab.nuggets.length)
      );
    }
    return false;
  };
export const selectNuggetPage =
  (tabState: TabState, page: number, pageSize: number) =>
  (state: RootState): NuggetPageData => {
    const currentTab =
      tabState == TabState.Inventory
        ? state.nuggets.inventoryNuggetTab
        : tabState == TabState.Selling
        ? state.nuggets.sellingNuggetTab
        : tabState == TabState.Auction
        ? state.nuggets.auctionNuggetTab
        : tabState == TabState.Lot
        ? state.nuggets.lotNuggetTab
        : emptyNuggetTabData;
    return {
      nuggets: currentTab.nuggets.slice(page * pageSize, (page + 1) * pageSize),
      page,
      pageCount: Math.max(Math.ceil(currentTab.nuggetCount / pageSize), 1),
    };
  };
export const selectNuggetTab =
  (tabState: TabState) =>
  (state: RootState): NuggetTabData => {
    return tabState == TabState.Inventory
      ? state.nuggets.inventoryNuggetTab
      : tabState == TabState.Selling
      ? state.nuggets.sellingNuggetTab
      : tabState == TabState.Auction
      ? state.nuggets.auctionNuggetTab
      : tabState == TabState.Lot
      ? state.nuggets.lotNuggetTab
      : emptyNuggetTabData;
  };
export const selectNugget =
  (tabState: TabState, nuggetIndex: number) => (state: RootState) => {
    if (tabState == TabState.Inventory) {
      const nuggetId = state.nuggets.inventory[nuggetIndex];
      return (
        state.nuggets.inventoryNuggetTab.nuggets.find(
          (nugget) => nugget.id === nuggetId
        ) ?? emptyNuggetData
      );
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
  !isEqual(state.nuggets.inventory, state.nuggets.inventoryCache);
export const selectInventoryNuggetTab = (state: RootState): NuggetTabData =>
  state.nuggets.inventoryNuggetTab;
export const selectSellingNuggetTab = (state: RootState): NuggetTabData =>
  state.nuggets.sellingNuggetTab;
export const selectAuctionNuggetTab = (state: RootState): NuggetTabData =>
  state.nuggets.auctionNuggetTab;
export const selectLotNuggetTab = (state: RootState): NuggetTabData =>
  state.nuggets.lotNuggetTab;

export const {
  setNugget,
  setInventoryNuggetTab,
  resetSellingNuggetTab,
  addSellingNuggetTab,
  resetAuctionNuggetTab,
  addAuctionNuggetTab,
  resetLotNuggetTab,
  addLotNuggetTab,
} = nuggetsSlice.actions;
export default nuggetsSlice.reducer;
