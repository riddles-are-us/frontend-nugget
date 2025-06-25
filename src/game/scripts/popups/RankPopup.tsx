import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./RankPopup.css";
import { selectUIState, setUIState, UIStateType } from "../../../data/ui";
import HorizontalExtendableImage from "../common/HorizontalExtendableImage";
import leftBackground from "../../images/popups/default/left.png";
import midBackground from "../../images/popups/default/mid.png";
import rightBackground from "../../images/popups/default/right.png";
import leftInputBackground from "../../images/popups/default/left_input.png";
import midInputBackground from "../../images/popups/default/mid_input.png";
import rightInputBackground from "../../images/popups/default/right_input.png";
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
  selectNuggetsForceUpdate,
  selectRankNuggetTab,
  setNuggetsForceUpdate,
} from "../../../data/nuggets";
import { getRankNuggetsAsync } from "../express";

const ELEMENT_PER_REQUEST = 30;
const RankPopup = () => {
  const dispatch = useAppDispatch();
  const uIState = useAppSelector(selectUIState);
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
    checkTabData();
  }, [page]);

  useEffect(() => {
    setPage(0);
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
        {/* <RankElement */}
      </div>
    </div>
  );
};

export default RankPopup;
