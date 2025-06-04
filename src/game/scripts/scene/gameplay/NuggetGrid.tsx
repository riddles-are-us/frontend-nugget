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
import { bnToHexLe } from "delphinus-curves/src/altjubjub";
import { LeHexBN } from "zkwasm-minirollup-rpc";
import { AccountSlice } from "zkwasm-minirollup-browser";
import { selectNullableUserState } from "../../../../data/state";
import {
  getAuctionNuggetsAsync,
  getLotNuggetsAsync,
  getNuggetsAsync,
  getSellingNuggetsAsync,
} from "../../express";
import PageSelector from "../../common/PageSelector";
import { isEqual } from "../../common/Utility";
import {
  addAuctionNuggetTab,
  addLotNuggetTab,
  addSellingNuggetTab,
  resetAuctionNuggetTab,
  resetLotNuggetTab,
  resetSellingNuggetTab,
  selectNuggetPage,
  selectNuggetPageNeedsUpdate,
  setInventoryNuggetTab,
} from "../../../../data/nuggets";
import { selectIsLoading, setIsLoading } from "../../../../data/errors";
import Nugget from "./Nugget";

const ELEMENT_PER_REQUEST = 30;
const NuggetGrid = () => {
  const dispatch = useAppDispatch();
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const userState = useAppSelector(selectNullableUserState);
  const uIState = useAppSelector(selectUIState);
  const isloading = useAppSelector(selectIsLoading);
  const [finishedRendering, setFinishedRendering] = useState<boolean>(false);
  const pids = l2account?.pubkey
    ? new LeHexBN(bnToHexLe(l2account?.pubkey)).toU64Array()
    : ["", "", "", ""];

  const elementRatio = 432 / 132;
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [elementWidth, setElementWidth] = useState<number>(0);
  const [elementHeight, setElementHeight] = useState<number>(0);
  const columnCount = 3;
  const [rowCount, setRowCount] = useState<number>(0);

  const tabState = useAppSelector(selectTabState);
  const [page, setPage] = useState<number>(0);
  const pageSize = rowCount * columnCount;
  const nuggetPageNeedsUpdate = useAppSelector(
    selectNuggetPageNeedsUpdate(tabState, page, pageSize)
  );
  const nuggetPage = useAppSelector(selectNuggetPage(tabState, page, pageSize));
  const elements =
    tabState == TabState.Inventory
      ? nuggetPage.nuggets.map((nuggetData, index) => (
          <Nugget
            key={index}
            nuggetData={nuggetData}
            onClickMore={() => onClickInventoryMore(index)}
            showBidPrice={false}
          />
        ))
      : tabState == TabState.Selling
      ? nuggetPage.nuggets.map((nuggetData, index) => (
          <Nugget
            key={index}
            nuggetData={nuggetData}
            onClickMore={() => onClickSellingMore(index)}
            showBidPrice={true}
          />
        ))
      : tabState == TabState.Auction
      ? nuggetPage.nuggets.map((nuggetData, index) => (
          <Nugget
            key={index}
            nuggetData={nuggetData}
            onClickMore={() => onClickMarketMore(index)}
            showBidPrice={true}
          />
        ))
      : tabState == TabState.Lot
      ? nuggetPage.nuggets.map((nuggetData, index) => (
          <Nugget
            key={index}
            nuggetData={nuggetData}
            onClickMore={() => onClickBidMore(index)}
            showBidPrice={true}
          />
        ))
      : [];

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
    dispatch(setIsLoading(true));
    await updateInventoryPage();
    await resetSellingPage(ELEMENT_PER_REQUEST);
    await resetAuctionPage(ELEMENT_PER_REQUEST);
    await resetLotPage(ELEMENT_PER_REQUEST);
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    if (userState) {
      if (!finishedRendering) {
        initNuggets();
        setFinishedRendering(true);
      }
    }
  }, []);

  const updateInventoryPage = async () => {
    const allNuggets = await getNuggetsAsync(
      userState!.player!.data.inventory ?? []
    );
    const inventoryNuggets = allNuggets.filter(
      (nugget) => nugget.marketid == 0
    );
    dispatch(
      setInventoryNuggetTab({
        nuggets: inventoryNuggets,
        nuggetCount: inventoryNuggets.length,
      })
    );
  };

  const resetSellingPage = async (limit: number) => {
    const sellingNuggetTabData = await getSellingNuggetsAsync(
      0,
      limit,
      pids[1].toString(),
      pids[2].toString()
    );
    dispatch(
      resetSellingNuggetTab({
        nuggets: sellingNuggetTabData.nuggets,
        nuggetCount: sellingNuggetTabData.nuggetCount,
      })
    );
  };

  const addSellingPage = async (skip: number, limit: number) => {
    const sellingNuggetTabData = await getSellingNuggetsAsync(
      skip,
      limit,
      pids[1].toString(),
      pids[2].toString()
    );
    dispatch(
      addSellingNuggetTab({
        nuggets: sellingNuggetTabData.nuggets,
        nuggetCount: sellingNuggetTabData.nuggetCount,
      })
    );
  };

  const resetAuctionPage = async (limit: number) => {
    const auctionNuggetTabData = await getAuctionNuggetsAsync(0, limit);
    dispatch(
      resetAuctionNuggetTab({
        nuggets: auctionNuggetTabData.nuggets,
        nuggetCount: auctionNuggetTabData.nuggetCount,
      })
    );
  };

  const addAuctionPage = async (skip: number, limit: number) => {
    const auctionNuggetTabData = await getAuctionNuggetsAsync(skip, limit);
    dispatch(
      addAuctionNuggetTab({
        nuggets: auctionNuggetTabData.nuggets,
        nuggetCount: auctionNuggetTabData.nuggetCount,
      })
    );
  };

  const resetLotPage = async (limit: number) => {
    const lotNuggetTabData = await getLotNuggetsAsync(
      0,
      limit,
      pids[1].toString(),
      pids[2].toString()
    );
    dispatch(
      resetLotNuggetTab({
        nuggets: lotNuggetTabData.nuggets,
        nuggetCount: lotNuggetTabData.nuggetCount,
      })
    );
  };

  const addLotPage = async (skip: number, limit: number) => {
    const lotNuggetTabData = await getLotNuggetsAsync(
      skip,
      limit,
      pids[1].toString(),
      pids[2].toString()
    );
    dispatch(
      addLotNuggetTab({
        nuggets: lotNuggetTabData.nuggets,
        nuggetCount: lotNuggetTabData.nuggetCount,
      })
    );
  };

  if (finishedRendering && !isloading) {
    if (nuggetPageNeedsUpdate) {
      console.log("nuggetPageNeedsUpdate");
      dispatch(setIsLoading(true));
      if (tabState == TabState.Inventory) {
        updateInventoryPage();
      } else if (tabState == TabState.Selling) {
        addSellingPage(nuggetPage.nuggetCount, ELEMENT_PER_REQUEST);
      } else if (tabState == TabState.Auction) {
        addAuctionPage(nuggetPage.nuggetCount, ELEMENT_PER_REQUEST);
      } else if (tabState == TabState.Lot) {
        addLotPage(nuggetPage.nuggetCount, ELEMENT_PER_REQUEST);
      }
      dispatch(setIsLoading(false));
    }
  }

  useEffect(() => {
    setPage(0);
  }, [pageSize]);

  const onClickPrevPageButton = () => {
    setPage(page - 1);
  };

  const onClickNextPageButton = () => {
    setPage(page + 1);
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
          currentPage={nuggetPage.page}
          totalPage={nuggetPage.pageCount}
          onClickPrevPageButton={onClickPrevPageButton}
          onClickNextPageButton={onClickNextPageButton}
        />
      </div>
    </div>
  );
};

export default NuggetGrid;
