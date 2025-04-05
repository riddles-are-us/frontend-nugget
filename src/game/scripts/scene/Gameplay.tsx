import React, { useEffect, useRef, useState, MouseEvent } from "react";
import Popups from "./Popups";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { AccountSlice } from "zkwasm-minirollup-browser";
import "./Gameplay.css";
import { selectUserState } from "../../../data/state";
import { sendTransaction } from "zkwasm-minirollup-browser/src/connect";
import { selectUIState, UIState } from "../../../old/p_ui";

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
          <div className="gameplay-top-foreground-extend" />
          <div className="gameplay-top-foreground-main" />
        </div>
      </div>
      <div className="gameplay-main-container">
        <div className="gameplay-main-left-container"></div>
        <div className="gameplay-main-middle-container"></div>
        <div className="gameplay-main-right-container"></div>
      </div>
    </div>
  );
};

export default Gameplay;
