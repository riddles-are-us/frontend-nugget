import Popups from "./Popups";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./Gameplay.css";
import VerticalExtendableImage from "../common/VerticalExtendableImage";
import leftTopImage from "../../images/scene/gameplay/left_container/left_top.png";
import leftMiddleImage from "../../images/scene/gameplay/left_container/left_middle.png";
import decoBarImage from "../../images/scene/gameplay/top_container/deco_bar.png";
import leftBottomImage from "../../images/scene/gameplay/left_container/left_bottom.png";
import rightTopImage from "../../images/scene/gameplay/right_container/right_top.png";
import rightMiddleImage from "../../images/scene/gameplay/right_container/right_middle.png";
import rightBottomImage from "../../images/scene/gameplay/right_container/right_bottom.png";
import homeBottomTabImage from "../../images/buttons/home_btn.png";
import earningBottomTabImage from "../../images/buttons/earning_btn.png";
import rankingBottomTabImage from "../../images/buttons/ranking_btn.png";
import PlayerInfo from "./gameplay/PlayerInfo";
import avatarImage from "../../images/avatars/avatar_1.png";
import TabButtons from "./gameplay/TabButtons";
import NuggetGrid from "./gameplay/NuggetGrid";
import { LoadingType, pushError, selectIsLoading, setLoadingType } from "../../../data/errors";
import LoadingHint from "./LoadingHint";
import { useRef } from "react";
import PlayerInfoMobile from "./gameplay/PlayerInfoMobile";
import { BottomTabState, selectBottomTabState, setBottomTabState } from "../../../data/ui";
import { sendTransaction, useWalletContext } from "zkwasm-minirollup-browser";
import { getCreateNuggetTransactionCommandArray } from "../request";
import { selectUserState } from "../../../data/state";
import { AnyAction } from "@reduxjs/toolkit";
import { setNuggetsForceUpdate } from "../../../data/nuggets";
import EarningRankPage from "../popups/EarningRankPage";
import { useIsMobile } from "../../../app/isMobileContext";
import LeaderRankPage from "../popups/LeaderRankPage";

const Gameplay = () => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { isMobile } = useIsMobile();
  const dispatch = useAppDispatch();
  const { l2Account } = useWalletContext();
  const isLoading = useAppSelector(selectIsLoading);
  const bottomTabState = useAppSelector(selectBottomTabState);
  const userState = useAppSelector(selectUserState);

  const onClickPickNugget = () => {
    if (!isLoading) {
      dispatch(setLoadingType(LoadingType.PickNugget));
      dispatch(
        sendTransaction({
          cmd: getCreateNuggetTransactionCommandArray(userState!.player!.nonce),
          prikey: l2Account!.getPrivateKey(),
        })
      ).then(async (action: AnyAction) => {
        if (sendTransaction.fulfilled.match(action)) {
          console.log("pick nugget successed");
          dispatch(setNuggetsForceUpdate(true));
          dispatch(setLoadingType(LoadingType.None));
        } else if (sendTransaction.rejected.match(action)) {
          const message = "pick nugget Error: " + action.payload;
          dispatch(pushError(message));
          console.error(message);
          dispatch(setLoadingType(LoadingType.None));
        }
      });
    }
  };

  const bottomButtonRenderer = (btnType: BottomTabState, btnImage: string, btnTitle: string) => {
    const active = btnType == bottomTabState;
    return (
      <div
        className="gameplay-bottom-container-tab"
        style={{
          borderTopLeftRadius: btnTitle === "Earning board" && active ? '12px' : 0,
          boxShadow: active ? '0px 4px 4px 9px #07060640' : 'unset',
          backgroundColor: active ? '#7ABFCE4D' : 'transparent'
        }}
        onClick={() => dispatch(setBottomTabState(btnType))}
      >
        <div className="gameplay-bottom-container-tab-image-container">
          <img
            src={btnImage}
            className="gameplay-bottom-container-tab-image"
          />
        </div>
        <p className="gameplay-bottom-container-tab-title">
          {btnTitle}
        </p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="gameplay-container">
      <Popups />
      {isLoading && <LoadingHint />}
      <div
        className="gameplay-top-container"
        style={isMobile ? { height: bottomTabState == BottomTabState.Home ? '182px' : '146px' } : {}}
      >
        <div className="gameplay-top-foreground-container">
          <div className="gameplay-top-player-info-container">
            <img
              className="gameplay-top-player-info-avatar-image"
              src={avatarImage}
            />
          </div>
          <div className="gameplay-top-foreground-extend" />
          <div className="gameplay-top-foreground-main" />
          <div className="gameplay-top-player-info-container">
            <PlayerInfo />
          </div>
          <div className="gameplay-top-tab-buttons-container">
            <TabButtons />
          </div>
        </div>
        <div className="gameplay-top-container-mobile">
          <PlayerInfoMobile />
          {bottomTabState == BottomTabState.Home && (
            <div
              className="gameplay-top-container-footer-mobile"
            >
              <TabButtons />
            </div>
          )}
          <img src={decoBarImage} style={{ width: '100%', height: 'auto', maxHeight: '24px' }} />
        </div>
      </div>
      <div
        className="gameplay-main-container"
        style={isMobile ? { top: bottomTabState == BottomTabState.Home ? '182px' : '146px' } : {}}
      >
        <div className="gameplay-main-left-container">
          <VerticalExtendableImage
            topRatio={1}
            bottomRatio={1}
            topImage={leftTopImage}
            midImage={leftMiddleImage}
            bottomImage={leftBottomImage}
          />
          <div className="gameplay-main-left-foreground" />
        </div>
        <div className="gameplay-main-middle-container">
          {!isMobile || bottomTabState == BottomTabState.Home && (<NuggetGrid />)}
          {isMobile && bottomTabState == BottomTabState.LeaderBoard && (<LeaderRankPage />)}
          {isMobile && bottomTabState == BottomTabState.EarningBoard && (<EarningRankPage />)}
        </div>
        <div className="gameplay-main-right-container">
          <VerticalExtendableImage
            topRatio={1}
            bottomRatio={1}
            topImage={rightTopImage}
            midImage={rightMiddleImage}
            bottomImage={rightBottomImage}
          />
          <div className="gameplay-main-right-foreground" />
        </div>
      </div>
      <div className="gameplay-bottom-container">
        <div className="gameplay-bottom-container-mobile">
          {bottomButtonRenderer(BottomTabState.EarningBoard, earningBottomTabImage, 'Earning board')}
          {bottomButtonRenderer(BottomTabState.LeaderBoard, rankingBottomTabImage, 'Leader board')}
          {bottomButtonRenderer(BottomTabState.Home, homeBottomTabImage, 'Home')}
          <div
            className="gameplay-bottom-container-pick-btn"
            onClick={onClickPickNugget}
          />
        </div>
      </div>
    </div>
  );
};

export default Gameplay;
