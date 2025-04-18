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
import { NuggetData } from "../../../../data/model";
import Nugget from "./Nugget";
import {
  selectBidNuggetsData,
  selectInventoryNuggetsData,
  selectMarketNuggetsData,
} from "../../../../data/nuggets";

const NuggetGrid = () => {
  const dispatch = useAppDispatch();
  const uIState = useAppSelector(selectUIState);
  const inventoryNuggetsData = useAppSelector(selectInventoryNuggetsData);
  const marketNuggetsData = useAppSelector(selectMarketNuggetsData);
  const bidNuggetsData = useAppSelector(selectBidNuggetsData);

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
      : tabState == TabState.Market
      ? marketNuggetsData.map((nuggetData, index) => (
          <Nugget
            key={index}
            nuggetData={nuggetData}
            onClickMore={() => onClickMarketMore(index)}
          />
        ))
      : tabState == TabState.Bid
      ? bidNuggetsData.map((nuggetData, index) => (
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

  const onClickInventoryMore = (nuggetIndex: number) => {
    if (uIState.type == UIStateType.Idle) {
      dispatch(
        setUIState({
          type: UIStateType.InventoryNuggetInfoPopup,
          nuggetIndex,
        })
      );
    }
  };

  const onClickMarketMore = (nuggetIndex: number) => {
    if (uIState.type == UIStateType.Idle) {
      dispatch(
        setUIState({
          type: UIStateType.MarketNuggetInfoPopup,
          nuggetIndex,
          isShowingBidAmountPopup: false,
        })
      );
    }
  };

  const onClickBidMore = (nuggetIndex: number) => {
    if (uIState.type == UIStateType.Idle) {
      dispatch(
        setUIState({ type: UIStateType.BidNuggetInfoPopup, nuggetIndex })
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
