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
import { selectNuggetPageData, setNuggetPage } from "../../../../data/nuggets";
import { bnToHexLe } from "delphinus-curves/src/altjubjub";
import { LeHexBN } from "zkwasm-minirollup-rpc";
import { AccountSlice } from "zkwasm-minirollup-browser";
import { selectNullableUserState } from "../../../../data/state";
import {
  getNuggetsAsync,
  updateAuctionNuggetsAsync,
  updateLotNuggetsAsync,
  updateNuggetsAsync,
  updateSellingNuggetsAsync,
} from "../../express";
import PageSelector from "../../common/PageSelector";
import { NuggetData } from "../../../../data/model";
import { isEqual } from "../../common/Utility";

const NuggetGrid = () => {
  const dispatch = useAppDispatch();
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const userState = useAppSelector(selectNullableUserState);
  const uIState = useAppSelector(selectUIState);
  const pids = l2account?.pubkey
    ? new LeHexBN(bnToHexLe(l2account?.pubkey)).toU64Array()
    : ["", "", "", ""];
  const nuggetPage = useAppSelector(selectNuggetPageData);
  const elements = nuggetPage.nuggets.map((nuggetData, index) => (
    <Nugget
      key={index}
      nuggetData={nuggetData}
      onClickMore={() => onClickInventoryMore(index)}
      showBidPrice={false}
    />
  ));

  const [cacheInventory, setCacheInventory] = useState<number[]>([]);
  const inventory = userState?.player?.data.inventory ?? [];

  const tabState = useAppSelector(selectTabState);
  // const elements =
  //   tabState == TabState.Inventory
  //     ? inventoryNuggetsData.map((nuggetData, index) => (
  //         <Nugget
  //           key={index}
  //           nuggetData={nuggetData}
  //           onClickMore={() => onClickInventoryMore(index)}
  //           showBidPrice={false}
  //         />
  //       ))
  //     : tabState == TabState.Selling
  //     ? sellingNuggetsData.map((nuggetData, index) => (
  //         <Nugget
  //           key={index}
  //           nuggetData={nuggetData}
  //           onClickMore={() => onClickSellingMore(index)}
  //           showBidPrice={true}
  //         />
  //       ))
  //     : tabState == TabState.Auction
  //     ? auctionNuggetPageData.nuggets.map((nuggetData, index) => (
  //         <Nugget
  //           key={index}
  //           nuggetData={nuggetData}
  //           onClickMore={() => onClickMarketMore(index)}
  //           showBidPrice={true}
  //         />
  //       ))
  //     : tabState == TabState.Lot
  //     ? lotNuggetsData.map((nuggetData, index) => (
  //         <Nugget
  //           key={index}
  //           nuggetData={nuggetData}
  //           onClickMore={() => onClickBidMore(index)}
  //           showBidPrice={true}
  //         />
  //       ))
  //     : [];

  const elementRatio = 432 / 132;
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [elementWidth, setElementWidth] = useState<number>(0);
  const [elementHeight, setElementHeight] = useState<number>(0);
  const columnCount = 3;
  const [rowCount, setRowCount] = useState<number>(0);

  const adjustSize = () => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth / columnCount;
      const height = width / elementRatio + 10;
      setElementWidth(width);
      setElementHeight(height);
      // setRowCount(Math.floor(containerRef.current.offsetHeight / height));
      setRowCount(1);
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

  const setInventoryPage = async (page: number) => {
    const limit = columnCount * rowCount;
    const skip = page * limit;
    // const ids = inventory.slice(skip, skip + limit);

    const allNuggets = await getNuggetsAsync(inventory);
    const inventoryNuggets = allNuggets.filter(
      (nugget) => nugget.marketid == 0
    );
    dispatch(
      setNuggetPage({
        currentPage: page,
        totalPage: Math.max(Math.ceil(inventoryNuggets.length / limit), 1),
        nuggets: inventoryNuggets.slice(skip, skip + limit),
      })
    );
  };

  useEffect(() => {
    if (rowCount > 0) {
      console.log("inventory", tabState, rowCount, inventory);
      if (!isEqual(inventory, cacheInventory)) {
        setInventoryPage(0);
      }
      setCacheInventory(inventory);
    }
  }, [tabState, rowCount, inventory]);

  const onClickPrevPageButton = () => {
    setInventoryPage(nuggetPage.currentPage - 1);
  };

  const onClickNextPageButton = () => {
    setInventoryPage(nuggetPage.currentPage + 1);
  };

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
    <div className="nugget-grid-container">
      <div ref={containerRef} className="nugget-grid-grid-container">
        <Grid
          elementWidth={elementWidth}
          elementHeight={elementHeight}
          columnCount={columnCount}
          rowCount={rowCount}
          elements={elements}
        />
      </div>
      <div className="nugget-grid-page-selector-container">
        <PageSelector
          currentPage={nuggetPage.currentPage}
          totalPage={nuggetPage.totalPage}
          onClickPrevPageButton={onClickPrevPageButton}
          onClickNextPageButton={onClickNextPageButton}
        />
      </div>
    </div>
  );
};

export default NuggetGrid;
