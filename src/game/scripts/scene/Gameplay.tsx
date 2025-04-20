import React, { useEffect, useRef, useState, MouseEvent } from "react";
import Popups from "./Popups";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { AccountSlice } from "zkwasm-minirollup-browser";
import "./Gameplay.css";
import { selectNullableUserState, selectUserState } from "../../../data/state";
import { sendTransaction } from "zkwasm-minirollup-browser/src/connect";
import VerticalExtendableImage from "../common/VerticalExtendableImage";
import leftTopImage from "../../images/scene/gameplay/left_container/left_top.png";
import leftMiddleImage from "../../images/scene/gameplay/left_container/left_middle.png";
import leftBottomImage from "../../images/scene/gameplay/left_container/left_bottom.png";
import rightTopImage from "../../images/scene/gameplay/right_container/right_top.png";
import rightMiddleImage from "../../images/scene/gameplay/right_container/right_middle.png";
import rightBottomImage from "../../images/scene/gameplay/right_container/right_bottom.png";
import PlayerInfo from "./gameplay/PlayerInfo";
import avatarImage from "../../images/avatars/Avatar.png";
import TabButtons from "./gameplay/TabButtons";
import NuggetGrid from "./gameplay/NuggetGrid";
import { selectUIState } from "../../../data/ui";
import { selectIsLoading } from "../../../data/errors";
import { getBids, getNugget, getNuggets } from "../request";
import LoadingHint from "./LoadingHint";

const Gameplay = () => {
  const dispatch = useAppDispatch();
  const uIState = useAppSelector(selectUIState);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const userState = useAppSelector(selectNullableUserState);
  const isLoading = useAppSelector(selectIsLoading);

  useEffect(() => {
    if (userState) {
      console.error("Gameplay updated");
      dispatch(getNuggets(0));
      dispatch(getBids(l2account!.getPrivateKey()));
      for (let i = 0; i < userState!.player!.data.inventory.length; i++) {
        dispatch(
          getNugget({
            nuggetId: userState!.player!.data.inventory[i],
          })
        );
      }
    }
  }, []);

  return (
    <div className="gameplay-container">
      <Popups />
      {isLoading && <LoadingHint />}
      <div className="gameplay-top-container">
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
      </div>
      <div className="gameplay-main-container">
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
          <NuggetGrid />
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
      <div className="gameplay-bottom-container" />
    </div>
  );
};

export default Gameplay;
