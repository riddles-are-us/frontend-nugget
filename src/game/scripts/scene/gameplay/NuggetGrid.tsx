import React, { useEffect, useRef, useState } from "react";
import Grid from "../../common/Grid";
import "./NuggetGrid.css";
import Nugget from "./Nugget";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { selectNuggetsData } from "../../../../data/ui";

const NuggetGrid = () => {
  const dispatch = useAppDispatch();
  const nuggetsData = useAppSelector(selectNuggetsData);

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

  return (
    <div ref={containerRef} className="nugget-grid-container">
      <Grid
        elementWidth={elementWidth}
        elementHeight={elementHeight}
        columnCount={3}
        rowCount={rowCount}
        elements={nuggetsData.nuggets.map((nuggetData, index) => (
          <Nugget key={index} nuggetData={nuggetData} />
        ))}
      />
    </div>
  );
};

export default NuggetGrid;
