import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./RankPopup.css";
import { selectUIState, setUIState, UIStateType } from "../../../data/ui";
import HorizontalExtendableImage from "../common/HorizontalExtendableImage";
import leftBackground from "../../images/popups/default/left.png";
import midBackground from "../../images/popups/default/mid.png";
import rightBackground from "../../images/popups/default/right.png";
import nextPageNormalImage from "../../images/buttons/next_page_button/right_arrow.png";
import nextPageHoverImage from "../../images/buttons/next_page_button/right_arrow_hv.png";
import nextPageClickImage from "../../images/buttons/next_page_button/right_arrow_click.png";
import prevPageNormalImage from "../../images/buttons/prev_page_button/left_arrow.png";
import prevPageHoverImage from "../../images/buttons/prev_page_button/left_arrow_hv.png";
import prevPageClickImage from "../../images/buttons/prev_page_button/left_arrow_click.png";
import pageSelectorFrame from "../../images/scene/gameplay/rank/rank_frame.png";
import PopupCloseButton from "../buttons/PopupCloseButton";
import DefaultButton from "../buttons/DefaultButton";
import { getTextShadowStyle } from "../common/Utility";
import { AccountSlice } from "zkwasm-minirollup-browser";
import {
  LoadingType,
  pushError,
  selectIsLoading,
  setLoadingType,
} from "../../../data/errors";
import RankElement from "../scene/gameplay/RankElement";
import Grid from "../common/Grid";
import {
  addRankNuggetTab,
  resetRankNuggetTab,
  selectNuggetsForceUpdate,
  selectRankNuggetTab,
  setNuggetsForceUpdate,
} from "../../../data/nuggets";
import { getRankNuggetsAsync } from "../express";
import PageSelector from "../common/PageSelector";

const ELEMENT_PER_REQUEST = 30;
const RankPopup = () => {
  const isFirst = useRef(false);
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const isLoading = useAppSelector(selectIsLoading);

  const elementRatio = 13 / 1;
  const gridContainerRef = useRef<HTMLParagraphElement>(null);
  const [elementWidth, setElementWidth] = useState<number>(0);
  const [elementHeight, setElementHeight] = useState<number>(0);
  const columnCount = 1;
  const [rowCount, setRowCount] = useState<number>(0);

  const [page, setPage] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const pageSize = rowCount * columnCount;
  const rankNuggetTab = useAppSelector(selectRankNuggetTab);
  const nuggetsForceUpdate = useAppSelector(selectNuggetsForceUpdate);
  const [elements, setElements] = useState<JSX.Element[]>([]);

  const adjustSize = () => {
    if (containerRef.current) {
      setTitleFontSize(containerRef.current.offsetHeight / 15);
    }

    if (gridContainerRef.current) {
      const width = gridContainerRef.current.offsetWidth / columnCount;
      const height = width / elementRatio + 10;
      setElementWidth(width);
      setElementHeight(height);
      setRowCount(Math.floor(gridContainerRef.current.offsetHeight / height));
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, [containerRef.current]);

  useEffect(() => {
    if (!isFirst.current) {
      isFirst.current = true;
      checkTabData();
    }
  }, [page]);

  useEffect(() => {
    setPage(0);
    reloadTabData();
  }, [pageSize]);

  useEffect(() => {
    if (nuggetsForceUpdate) {
      dispatch(setNuggetsForceUpdate(false));
      checkTabData();
    }
  }, [nuggetsForceUpdate]);

  const checkTabData = async () => {
    if (isLoading) {
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
    setElements(
      rankNuggetTab.nuggets
        .slice(page * pageSize, (page + 1) * pageSize)
        .map((nuggetData, index) => (
          <RankElement key={index} rank={index + 1} nuggetData={nuggetData} />
        ))
    );
    setTotalPage(Math.max(Math.ceil(rankNuggetTab.nuggetCount / pageSize), 1));
  };

  const needUpdateTabData = () => {
    return (
      rankNuggetTab.nuggetCount == -1 ||
      (rankNuggetTab.nuggetCount > rankNuggetTab.nuggets.length &&
        (page + 1) * pageSize >= rankNuggetTab.nuggets.length)
    );
  };

  const reloadTabData = async () => {
    dispatch(resetRankNuggetTab());

    if (page == 0) {
      dispatch(setNuggetsForceUpdate(true));
    } else {
      setPage(0);
    }
  };

  const updateTabData = async () => {
    dispatch(setLoadingType(LoadingType.Default));
    await addRankPage(rankNuggetTab.nuggets.length, ELEMENT_PER_REQUEST);
    dispatch(setLoadingType(LoadingType.None));
  };

  const addRankPage = async (skip: number, limit: number) => {
    const rankNuggetTabData = await getRankNuggetsAsync(skip, limit);
    dispatch(
      addRankNuggetTab({
        nuggets: rankNuggetTabData.nuggets,
        nuggetCount: rankNuggetTabData.nuggetCount,
      })
    );
  };

  const onClickCancel = () => {
    if (!isLoading) {
      dispatch(setUIState({ type: UIStateType.Idle }));
    }
  };

  const onClickPrevPageButton = () => {
    setPage(page - 1);
  };

  const onClickNextPageButton = () => {
    setPage(page + 1);
  };

  return (
    <div className="rank-popup-container">
      <div onClick={onClickCancel} className="rank-popup-mask" />
      <div ref={containerRef} className="rank-popup-main-container">
        <div className="rank-popup-main-background">
          <HorizontalExtendableImage
            leftRatio={58 / 238}
            rightRatio={58 / 238}
            leftImage={leftBackground}
            midImage={midBackground}
            rightImage={rightBackground}
          />
        </div>
        <div className="rank-popup-close-button">
          <PopupCloseButton onClick={onClickCancel} isDisabled={false} />
        </div>
        <p
          className="rank-popup-title-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          Recycle Ranking
        </p>
        <div ref={gridContainerRef} className="rank-popup-grid-container">
          <Grid
            elementWidth={elementWidth}
            elementHeight={elementHeight}
            columnCount={columnCount}
            rowCount={rowCount}
            elements={elements}
          />
        </div>
        <div className="rank-popup-page-selector-container">
          <PageSelector
            currentPage={page}
            totalPage={totalPage}
            nextPageNormalImage={nextPageNormalImage}
            nextPageHoverImage={nextPageHoverImage}
            nextPageClickImage={nextPageClickImage}
            prevPageNormalImage={prevPageNormalImage}
            prevPageHoverImage={prevPageHoverImage}
            prevPageClickImage={prevPageClickImage}
            pageSelectorFrame={pageSelectorFrame}
            onClickPrevPageButton={onClickPrevPageButton}
            onClickNextPageButton={onClickNextPageButton}
          />
        </div>
      </div>
    </div>
  );
};

export default RankPopup;
