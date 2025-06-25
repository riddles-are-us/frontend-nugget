import React, { useEffect, useRef, useState } from "react";
import "./PageSelector.css";
import NextPageButton from "../buttons/NextPageButton";
import PrevPageButton from "../buttons/PrevPageButton";

interface Props {
  currentPage: number;
  totalPage: number;
  nextPageNormalImage: string;
  nextPageHoverImage: string;
  nextPageClickImage: string;
  prevPageNormalImage: string;
  prevPageHoverImage: string;
  prevPageClickImage: string;
  pageSelectorFrame: string;
  onClickPrevPageButton: () => void;
  onClickNextPageButton: () => void;
}

const PageSelector = ({
  currentPage,
  totalPage,
  nextPageNormalImage,
  nextPageHoverImage,
  nextPageClickImage,
  prevPageNormalImage,
  prevPageHoverImage,
  prevPageClickImage,
  pageSelectorFrame,
  onClickPrevPageButton,
  onClickNextPageButton,
}: Props) => {
  const enableNextPageButton = currentPage < totalPage - 1;
  const enablePrevPageButton = currentPage > 0;
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState<number>(0);

  const adjustSize = () => {
    if (containerRef.current) {
      setFontSize(containerRef.current.offsetHeight / 3.5);
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, [containerRef.current]);

  return (
    <div className="page-selector-container" ref={containerRef}>
      <div className="page-selector-prev-button">
        <PrevPageButton
          isDisabled={!enablePrevPageButton}
          normalImage={prevPageNormalImage}
          hoverImage={prevPageHoverImage}
          clickImage={prevPageClickImage}
          onClick={onClickPrevPageButton}
        />
      </div>
      <img
        src={pageSelectorFrame}
        className="page-selector-page-number-background"
      ></img>

      <p
        className="page-selector-page-number-text"
        style={{ fontSize: fontSize }}
      >{`${currentPage + 1} / ${totalPage}`}</p>
      <div className="page-selector-next-button">
        <NextPageButton
          isDisabled={!enableNextPageButton}
          normalImage={nextPageNormalImage}
          hoverImage={nextPageHoverImage}
          clickImage={nextPageClickImage}
          onClick={onClickNextPageButton}
        />
      </div>
    </div>
  );
};

export default PageSelector;
