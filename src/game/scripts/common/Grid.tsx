import React from "react";
import "./Grid.css";

interface Props {
  elementWidth?: number | null;
  elementHeight?: number | null;
  columnCount: number;
  rowCount: number;
  elements: Array<JSX.Element>;
  paddingTop?: string;
  isMobile?: boolean;
}

const Grid = ({
  elementWidth = null,
  elementHeight = null,
  columnCount,
  rowCount,
  elements,
  isMobile = false
}: Props) => {
  return (
    <div
      className="grid-contianer"
      style={{
        width:
          elementWidth == null ? "100%" : `${elementWidth * columnCount}px`,
        height:
          elementHeight == null ? "100%" : `${elementHeight * rowCount}px`,
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gridTemplateRows: `repeat(${rowCount}, 1fr)`
      }}
    >
      {elements.map((element) => element)}
    </div>
  );
};

export default Grid;
