import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestError } from "zkwasm-minirollup-browser";
import { RootState } from "../app/store";
import { NuggetData } from "./model";
import { getNuggets, getNugget, getBids, queryState } from "../game/scripts/request";

export interface NuggetsState {
  nuggets: Record<number, NuggetData>;
  bidNuggets: NuggetData[];
  inventory: number[];
}

const initialState: NuggetsState = {
  nuggets: {},
  bidNuggets: [],
  inventory: [],
};

const nuggetsSlice = createSlice({
  name: "nuggets",
  initialState,
  reducers: {
    // setNuggets: (state, d: PayloadAction<UIState>) => {
    //   state.uiState = d.payload;
    // },
  },

  extraReducers: (builder) => {
    builder
      .addCase(queryState.fulfilled, (state, action) => {
        // console.log("queryState", action.payload.player.data.inventory);
        state.inventory = action.payload.player.data.inventory;
      })
      .addCase(getNuggets.fulfilled, (state, action) => {
        state.nuggets = action.payload.reduce((acc: any, nugget: any) => {
          acc[nugget.id] = nugget;
          return acc;
        }, {} as Record<string, NuggetData>);
        console.log("nuggets", state.nuggets);
      })
      // .addCase(getNugget.fulfilled, (state, action) => {
      //   const nugget = action.payload[0];
      //   state.nuggetsData.inventory[action.meta.arg.index] = nugget;
      // })
      .addCase(getBids.fulfilled, (state, action) => {
        state.bidNuggets = action.payload;
      });
  },
});

export const selectInventoryNuggetsData = (state: RootState) => {
  return state.nuggets.inventory.map((id) => state.nuggets.nuggets[id]).filter(nugget => nugget);
};

export const selectMarketNuggetsData = (state: RootState) => {
  return Object.values(state.nuggets.nuggets).filter(
    (nugget) => nugget && !state.nuggets.inventory.includes(nugget.id)
  );
};
export const selectBidNuggetsData = (state: RootState) => state.nuggets.bidNuggets;
// export const { /* */ } = nuggetsSlice.actions;
export default nuggetsSlice.reducer;
