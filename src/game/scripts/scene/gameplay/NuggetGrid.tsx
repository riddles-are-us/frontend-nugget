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
  selectAuctionNuggetTab,
  selectNuggetsForceUpdate,
  selectInventoryNuggetTab,
  selectIsInventoryChanged,
  selectLotNuggetTab,
  selectNuggetPage,
  selectNuggetPageNeedsUpdate,
  selectSellingNuggetTab,
  setNuggetsForceUpdate,
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
  const [totalPage, setTotalPage] = useState<number>(0);
  const pageSize = rowCount * columnCount;

  const isInventoryChanged = useAppSelector(selectIsInventoryChanged);
  const inventoryNuggetTab = useAppSelector(selectInventoryNuggetTab);
  const sellingNuggetTab = useAppSelector(selectSellingNuggetTab);
  const auctionNuggetTab = useAppSelector(selectAuctionNuggetTab);
  const lotNuggetTab = useAppSelector(selectLotNuggetTab);
  const nuggetsForceUpdate = useAppSelector(selectNuggetsForceUpdate);
  const [elements, setElements] = useState<JSX.Element[]>([]);

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

  useEffect(() => {
    checkTabData();
  }, [tabState, page]);

  useEffect(() => {
    if (nuggetsForceUpdate) {
      dispatch(setNuggetsForceUpdate(false));
      checkTabData();
    }
  }, [nuggetsForceUpdate]);

  useEffect(() => {
    setPage(0);
  }, [pageSize]);

  const checkTabData = async () => {
    if (isloading) {
      return;
    }

    if (needUpdateTabData()) {
      await updateTabData();
      dispatch(setNuggetsForceUpdate(true));
    } else {
      updateElements();
    }
  };

  const updateElements = () => {
    if (tabState == TabState.Inventory) {
      setElements(
        inventoryNuggetTab.nuggets
          .slice(page * pageSize, (page + 1) * pageSize)
          .map((nuggetData, index) => (
            <Nugget
              key={index}
              nuggetData={nuggetData}
              onClickMore={() => onClickInventoryMore(index)}
              showBidPrice={false}
            />
          ))
      );
      setTotalPage(
        Math.max(Math.ceil(inventoryNuggetTab.nuggetCount / pageSize), 1)
      );
    } else if (tabState == TabState.Selling) {
      setElements(
        sellingNuggetTab.nuggets
          .slice(page * pageSize, (page + 1) * pageSize)
          .map((nuggetData, index) => (
            <Nugget
              key={index}
              nuggetData={nuggetData}
              onClickMore={() => onClickSellingMore(index)}
              showBidPrice={true}
            />
          ))
      );

      setTotalPage(
        Math.max(Math.ceil(sellingNuggetTab.nuggetCount / pageSize), 1)
      );
    } else if (tabState == TabState.Auction) {
      setElements(
        auctionNuggetTab.nuggets
          .slice(page * pageSize, (page + 1) * pageSize)
          .map((nuggetData, index) => (
            <Nugget
              key={index}
              nuggetData={nuggetData}
              onClickMore={() => onClickMarketMore(index)}
              showBidPrice={true}
            />
          ))
      );
      setTotalPage(
        Math.max(Math.ceil(auctionNuggetTab.nuggetCount / pageSize), 1)
      );
    } else if (tabState == TabState.Lot) {
      setElements(
        lotNuggetTab.nuggets
          .slice(page * pageSize, (page + 1) * pageSize)
          .map((nuggetData, index) => (
            <Nugget
              key={index}
              nuggetData={nuggetData}
              onClickMore={() => onClickBidMore(index)}
              showBidPrice={true}
            />
          ))
      );
      setTotalPage(Math.max(Math.ceil(lotNuggetTab.nuggetCount / pageSize), 1));
    }
  };

  const needUpdateTabData = () => {
    if (tabState == TabState.Inventory) {
      return inventoryNuggetTab.nuggetCount == -1 || isInventoryChanged;
    } else if (tabState == TabState.Selling) {
      return (
        sellingNuggetTab.nuggetCount == -1 ||
        (sellingNuggetTab.nuggetCount > sellingNuggetTab.nuggets.length &&
          (page + 1) * pageSize >= sellingNuggetTab.nuggets.length)
      );
    } else if (tabState == TabState.Auction) {
      return (
        auctionNuggetTab.nuggetCount == -1 ||
        (auctionNuggetTab.nuggetCount > auctionNuggetTab.nuggets.length &&
          (page + 1) * pageSize >= auctionNuggetTab.nuggets.length)
      );
    } else if (tabState == TabState.Lot) {
      return (
        lotNuggetTab.nuggetCount == -1 ||
        (lotNuggetTab.nuggetCount > lotNuggetTab.nuggets.length &&
          (page + 1) * pageSize >= lotNuggetTab.nuggets.length)
      );
    }
    return false;
  };

  const updateTabData = async () => {
    dispatch(setIsLoading(true));
    if (tabState == TabState.Inventory) {
      await updateInventoryPage();
    } else if (tabState == TabState.Selling) {
      await addSellingPage(
        Math.max(sellingNuggetTab.nuggetCount, 0),
        ELEMENT_PER_REQUEST
      );
    } else if (tabState == TabState.Auction) {
      await addAuctionPage(
        Math.max(auctionNuggetTab.nuggetCount, 0),
        ELEMENT_PER_REQUEST
      );
    } else if (tabState == TabState.Lot) {
      await addLotPage(
        Math.max(lotNuggetTab.nuggetCount, 0),
        ELEMENT_PER_REQUEST
      );
    }
    dispatch(setIsLoading(false));
  };

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

  const addAuctionPage = async (skip: number, limit: number) => {
    const auctionNuggetTabData = await getAuctionNuggetsAsync(skip, limit);
    dispatch(
      addAuctionNuggetTab({
        nuggets: auctionNuggetTabData.nuggets,
        nuggetCount: auctionNuggetTabData.nuggetCount,
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
          currentPage={page}
          totalPage={totalPage}
          onClickPrevPageButton={onClickPrevPageButton}
          onClickNextPageButton={onClickNextPageButton}
        />
      </div>
    </div>
  );
};

export default NuggetGrid;
