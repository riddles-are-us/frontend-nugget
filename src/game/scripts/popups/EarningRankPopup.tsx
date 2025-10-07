import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useIsMobile } from "../../../app/isMobileContext";
import "./EarningRankPopup.css";
import { setUIState, UIStateType } from "../../../data/ui";
import HorizontalExtendableImage from "../common/HorizontalExtendableImage";
import leftBackground from "../../images/popups/default/left.png";
import midBackground from "../../images/popups/default/mid.png";
import rightBackground from "../../images/popups/default/right.png";
import PopupCloseButton from "../buttons/PopupCloseButton";
import { getTextShadowStyle } from "../common/Utility";
import { pushError } from "../../../data/error";
import {
  LoadingType,
  selectIsLoading,
  setLoadingType,
} from "../../../data/loading";
import Grid from "../common/Grid";
import { selectEarningRankNuggets } from "../../../data/nuggets";
import EarningRankElement from "../scene/gameplay/EarningRankElement";
import {
  getClaimRewardTransactionCommandArray,
  sendTransaction,
} from "../request";
import { selectUserState } from "../../../data/state";
import { useWalletContext } from "zkwasm-minirollup-browser";
import { AnyAction } from "@reduxjs/toolkit";

const EarningRankPopup = () => {
  const dispatch = useAppDispatch();
  const { isMobile } = useIsMobile();
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const isLoading = useAppSelector(selectIsLoading);
  const userState = useAppSelector(selectUserState);
  const { l2Account } = useWalletContext();

  const elementRatio = 738 / 54;
  const gridContainerRef = useRef<HTMLParagraphElement>(null);
  const [elementWidth, setElementWidth] = useState<number>(0);
  const [elementHeight, setElementHeight] = useState<number>(0);
  const columnCount = 1;
  const [rowCount, setRowCount] = useState<number>(0);

  const nuggets = useAppSelector(selectEarningRankNuggets);
  const elements = nuggets.map((nuggetData, index) => (
    <EarningRankElement
      key={index}
      nuggetData={nuggetData}
      onCliamReward={() => onCliamReward(index)}
    />
  ));

  const adjustSize = () => {
    if (containerRef.current) {
      setTitleFontSize(containerRef.current.offsetHeight / 18);
    }

    if (gridContainerRef.current) {
      const width = gridContainerRef.current.offsetWidth / columnCount;
      const height = width / elementRatio + 5;
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

  const onClickCancel = () => {
    if (!isLoading) {
      dispatch(setUIState({ type: UIStateType.Idle }));
    }
  };

  const onCliamReward = (index: number) => {
    if (!isLoading) {
      dispatch(setLoadingType(LoadingType.ListNugget));
      dispatch(
        sendTransaction({
          cmd: getClaimRewardTransactionCommandArray(
            userState!.player!.nonce,
            BigInt(index)
          ),
          prikey: l2Account!.getPrivateKey(),
        })
      ).then(async (action: AnyAction) => {
        if (sendTransaction.fulfilled.match(action)) {
          console.log("claim reward successed");
          dispatch(setUIState({ type: UIStateType.Idle }));
          dispatch(setLoadingType(LoadingType.None));
        } else if (sendTransaction.rejected.match(action)) {
          const message = "claim reward Error: " + action.payload;
          dispatch(pushError(message));
          console.error(message);
          dispatch(setLoadingType(LoadingType.None));
        }
      });
    }
  };

  return (
    <div className="earning-rank-popup-container">
      <div
        onClick={isMobile ? undefined : onClickCancel}
        className="earning-rank-popup-mask"
      />
      <div ref={containerRef} className="earning-rank-popup-main-container">
        <div className="earning-rank-popup-main-background">
          <HorizontalExtendableImage
            leftRatio={58 / 238}
            rightRatio={58 / 238}
            leftImage={leftBackground}
            midImage={midBackground}
            rightImage={rightBackground}
          />
        </div>
        <div className="earning-rank-popup-close-button">
          <PopupCloseButton onClick={onClickCancel} isDisabled={false} />
        </div>
        <p
          className="earning-rank-popup-title-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          Earning Board
        </p>
        <div
          ref={gridContainerRef}
          className="earning-rank-popup-grid-container"
        >
          <Grid
            elementWidth={elementWidth}
            elementHeight={elementHeight}
            columnCount={columnCount}
            rowCount={rowCount}
            elements={elements}
          />
        </div>
      </div>
    </div>
  );
};

export default EarningRankPopup;
