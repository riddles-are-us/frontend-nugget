import React, { useEffect, useRef, useState } from "react";
import Grid from "../../common/Grid";
import "./NuggetGrid.css";
import Nugget from "./Nugget";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectNuggetsData,
  selectTabState,
  selectUIState,
  setUIState,
  TabState,
  UIStateType,
} from "../../../../data/ui";
import { NuggetData } from "../../../../data/model";

const NuggetGrid = () => {
  const dispatch = useAppDispatch();
  const uIState = useAppSelector(selectUIState);
  const nuggetsData = useAppSelector(selectNuggetsData);
  const tabState = useAppSelector(selectTabState);
  const nuggets =
    tabState == TabState.Inventory
      ? nuggetsData.inventory
      : tabState == TabState.Market
      ? nuggetsData.market
      : tabState == TabState.Bid
      ? nuggetsData.bid
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

  const onClickMore = (nuggetData: NuggetData) => {
    if (uIState.type == UIStateType.Idle) {
      dispatch(setUIState({ type: UIStateType.NuggetInfoPopup, nuggetData }));
    }
  };

  return (
    <div ref={containerRef} className="nugget-grid-container">
      <Grid
        elementWidth={elementWidth}
        elementHeight={elementHeight}
        columnCount={3}
        rowCount={rowCount}
        elements={nuggets.map((nuggetData, index) => (
          <Nugget
            key={index}
            nuggetData={nuggetData}
            onClickMore={() => onClickMore(nuggetData)}
          />
        ))}
      />
    </div>
  );
};

export default NuggetGrid;
