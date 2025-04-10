import { useState } from "react";
import background from "../../images/popups/pop_frame.png";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./NuggetInfoPopup.css";
import { selectUIState, setUIState, UIStateType } from "../../../data/ui";
import { NuggetData } from "../../../data/model";

interface Props {
  nuggetData: NuggetData;
}

const NuggetInfoPopup = ({ nuggetData }: Props) => {
  const dispatch = useAppDispatch();
  const uIState = useAppSelector(selectUIState);

  const onClickCancel = () => {
    if (uIState.type == UIStateType.NuggetInfoPopup) {
      dispatch(setUIState({ type: UIStateType.Idle }));
    }
  };

  return (
    <div className="nugget-info-popup-container">
      <div onClick={onClickCancel} className="nugget-info-popup-mask" />
      <div className="nugget-info-popup-main-container">
        <img src={background} className="nugget-info-popup-main-background" />
      </div>
    </div>
  );
};

export default NuggetInfoPopup;
