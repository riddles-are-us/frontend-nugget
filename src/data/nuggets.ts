import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import { emptyNuggetData, emptyNuggetPageData, NuggetData, NuggetPageData } from "./model";
import { queryState } from "../game/scripts/request";
import { sendTransaction } from "zkwasm-minirollup-browser/src/connect";

export interface NuggetsState {
  nuggets: Record<number, NuggetData>;
  nuggetPage: NuggetPageData;
  auctionNuggetPage: NuggetPageData;
  lotNuggets:NuggetData[];
  sellingNuggets:NuggetData[];
  inventory: number[];
}

const initialState: NuggetsState = {
  nuggets: {},
  nuggetPage: emptyNuggetPageData,
  auctionNuggetPage: emptyNuggetPageData,
  lotNuggets: [],
  sellingNuggets: [],
  inventory: [],
};

const nuggetsSlice = createSlice({
  name: "nuggets",
  initialState,
  reducers: {
    setNuggetPage: (state, d: PayloadAction<NuggetPageData>) => {
      state.nuggetPage = d.payload;
    },
    setNuggets: (state, d: PayloadAction<NuggetData[]>) => {
      state.nuggets = d.payload.reduce((acc: any, nugget: any) => {
        acc[nugget.id] = nugget;
        return acc;
      }, {} as Record<string, NuggetData>);
    },
    setNugget: (state, d: PayloadAction<NuggetData>) => {
      const nugget = d.payload;
      state.nuggets[nugget.id] = nugget;
    },
    setAuctionNuggetPage: (state, d: PayloadAction<NuggetPageData>) => {
      state.auctionNuggetPage = d.payload;
    },
    setLotNuggets: (state, d: PayloadAction<NuggetData[]>) => {
      state.lotNuggets = d.payload;
    },
    setSellingNuggets: (state, d: PayloadAction<NuggetData[]>) => {
      state.sellingNuggets = d.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(queryState.fulfilled, (state, action) => {
        if (action.payload.player){
          state.inventory = action.payload.player.data.inventory;
        }
      })
      .addCase(sendTransaction.fulfilled, (state, action) => {
        if (action.payload.player){
          state.inventory = action.payload.player.data.inventory;
        }
      })
  },
});

export const selectInventoryNuggetsData = (state: RootState) => {
  return state.nuggets.inventory.map((id) => state.nuggets.nuggets[id]).filter(nugget => nugget && nugget.marketid == 0);
};
export const selectInventoryNuggetData = (index: number) => (state: RootState) => {
  return state.nuggets.nuggets[state.nuggets.inventory[index]] ?? emptyNuggetData;
};

export const selectNuggetPageData = (state: RootState) => state.nuggets.nuggetPage;
export const selectAuctionNuggetPageData = (state: RootState) => state.nuggets.auctionNuggetPage;
export const selectAuctionNuggetData = (index: number) => (state: RootState) => state.nuggets.auctionNuggetPage.nuggets[index] ?? emptyNuggetData;
export const selectLotNuggetsData = (state: RootState) => state.nuggets.lotNuggets;
export const selectLotNuggetData = (index: number) => (state: RootState) => state.nuggets.lotNuggets[index] ?? emptyNuggetData;
export const selectSellingNuggetsData = (state: RootState) => state.nuggets.sellingNuggets;
export const selectSellingNuggetData = (index: number) => (state: RootState) => state.nuggets.sellingNuggets[index] ?? emptyNuggetData;
export const { setNuggetPage, setNuggets, setNugget, setAuctionNuggetPage, setLotNuggets, setSellingNuggets} = nuggetsSlice.actions;
export default nuggetsSlice.reducer;
