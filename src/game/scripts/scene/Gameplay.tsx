import React, { useEffect, useRef, useState, MouseEvent } from "react";
import Popups from "./Popups";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { AccountSlice } from "zkwasm-minirollup-browser";
import "./Gameplay.css";
import { selectUserState } from "../../../data/state";
import { sendTransaction } from "zkwasm-minirollup-browser/src/connect";
import { selectUIState, UIState } from "../../../old/p_ui";
import VerticalExtendableImage from "../common/VerticalExtendableImage";
import leftTopImage from "../../images/scene/gameplay/left_container/left_top.png";
import leftMiddleImage from "../../images/scene/gameplay/left_container/left_middle.png";
import leftBottomImage from "../../images/scene/gameplay/left_container/left_bottom.png";
import rightTopImage from "../../images/scene/gameplay/right_container/right_top.png";
import rightMiddleImage from "../../images/scene/gameplay/right_container/right_middle.png";
import rightBottomImage from "../../images/scene/gameplay/right_container/right_bottom.png";
import PlayerInfo from "./PlayerInfo";
import avatarImage from "../../images/avatars/Avatar.png";

const Gameplay = () => {
  const dispatch = useAppDispatch();
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const userState = useAppSelector(selectUserState);
  const uIState = useAppSelector(selectUIState);

  return (
    <div className="gameplay-container">
      <Popups />
      <div className="gameplay-top-container">
        <div className="gameplay-top-foreground-container">
          <div className="gameplay-top-player-info-conainer">
            <img
              className="gameplay-top-player-info-avatar-image"
              src={avatarImage}
            />
          </div>
          <div className="gameplay-top-foreground-extend" />
          <div className="gameplay-top-foreground-main" />
          <div className="gameplay-top-player-info-conainer">
            <PlayerInfo />
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
        <div className="gameplay-main-middle-container"></div>
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
