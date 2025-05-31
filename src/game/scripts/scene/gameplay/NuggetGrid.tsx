import React, { useEffect, useRef, useState } from "react";
import Grid from "../../common/Grid";
import "./NuggetGrid.css";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectTabState,
  selectUIState,
  setUIState,
  TabState,
  UIStateType,
} from "../../../../data/ui";
import Nugget from "./Nugget";
import {
  selectLotNuggetsData,
  selectInventoryNuggetsData,
  selectSellingNuggetsData,
  selectAuctionNuggetsData,
} from "../../../../data/nuggets";
import { bnToHexLe } from "delphinus-curves/src/altjubjub";
import { LeHexBN } from "zkwasm-minirollup-rpc";
import { AccountSlice } from "zkwasm-minirollup-browser";
import { selectNullableUserState } from "../../../../data/state";
import {
  updateAuctionNuggetsAsync,
  updateLotNuggetsAsync,
  updateNuggetsAsync,
  updateSellingNuggetsAsync,
} from "../../express";

const NuggetGrid = () => {
  const dispatch = useAppDispatch();
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const userState = useAppSelector(selectNullableUserState);
  const uIState = useAppSelector(selectUIState);
  const inventoryNuggetsData = useAppSelector(selectInventoryNuggetsData);
  const sellingNuggetsData = useAppSelector(selectSellingNuggetsData);
  const auctionNuggetsData = useAppSelector(selectAuctionNuggetsData);
  const lotNuggetsData = useAppSelector(selectLotNuggetsData);
  const pids = l2account?.pubkey
    ? new LeHexBN(bnToHexLe(l2account?.pubkey)).toU64Array()
    : ["", "", "", ""];

  const tabState = useAppSelector(selectTabState);
  const elements =
    tabState == TabState.Inventory
      ? inventoryNuggetsData.map((nuggetData, index) => (
          <Nugget
            key={index}
            nuggetData={nuggetData}
            onClickMore={() => onClickInventoryMore(index)}
          />
        ))
      : tabState == TabState.Selling
      ? sellingNuggetsData.map((nuggetData, index) => (
          <Nugget
            key={index}
            nuggetData={nuggetData}
            onClickMore={() => onClickSellingMore(index)}
          />
        ))
      : tabState == TabState.Auction
      ? auctionNuggetsData.map((nuggetData, index) => (
          <Nugget
            key={index}
            nuggetData={nuggetData}
            onClickMore={() => onClickMarketMore(index)}
          />
        ))
      : tabState == TabState.Lot
      ? lotNuggetsData.map((nuggetData, index) => (
          <Nugget
            key={index}
            nuggetData={nuggetData}
            onClickMore={() => onClickBidMore(index)}
          />
        ))
      : [];

  const elementRatio = 432 / 132;
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [elementWidth, setElementWidth] = useState<number>(0);
  const [elementHeight, setElementHeight] = useState<number>(0);
  const [rowCount, setRowCount] = useState<number>(0);

  const adjustSize = () => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth / 3;
      const height = width / elementRatio + 10;
      setElementWidth(width);
      setElementHeight(height);
      setRowCount(Math.floor(containerRef.current.offsetHeight / height));
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, []);

  const initNuggets = async () => {
    await updateNuggetsAsync(dispatch);
    await updateAuctionNuggetsAsync(dispatch);
    await updateLotNuggetsAsync(
      dispatch,
      pids[1].toString(),
      pids[2].toString()
    );
    await updateSellingNuggetsAsync(
      dispatch,
      pids[1].toString(),
      pids[2].toString()
    );
  };

  useEffect(() => {
    if (userState) {
      initNuggets();
    }
  }, []);

  const onClickInventoryMore = (nuggetIndex: number) => {
    if (uIState.type == UIStateType.Idle) {
      dispatch(
        setUIState({
          type: UIStateType.InventoryNuggetInfoPopup,
          nuggetIndex,
          isShowingListAmountPopup: false,
        })
      );
    }
  };

  const onClickSellingMore = (nuggetIndex: number) => {
    if (uIState.type == UIStateType.Idle) {
      dispatch(
        setUIState({
          type: UIStateType.SellingNuggetInfoPopup,
          nuggetIndex,
        })
      );
    }
  };

  const onClickMarketMore = (nuggetIndex: number) => {
    if (uIState.type == UIStateType.Idle) {
      dispatch(
        setUIState({
          type: UIStateType.AuctionNuggetInfoPopup,
          nuggetIndex,
          isShowingBidAmountPopup: false,
        })
      );
    }
  };

  const onClickBidMore = (nuggetIndex: number) => {
    if (uIState.type == UIStateType.Idle) {
      dispatch(
        setUIState({
          type: UIStateType.LotNuggetInfoPopup,
          nuggetIndex,
          isShowingBidAmountPopup: false,
        })
      );
    }
  };

  return (
    <div ref={containerRef} className="nugget-grid-container">
      <Grid
        elementWidth={elementWidth}
        elementHeight={elementHeight}
        columnCount={3}
        rowCount={rowCount}
        elements={elements}
      />
    </div>
  );
};

export default NuggetGrid;
