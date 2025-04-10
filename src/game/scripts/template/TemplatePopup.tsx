import { useState } from "react";
import background from "../../images/popups/pop_frame.png";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./TemplatePopup.css";
import { selectUIState, setUIState, UIStateType } from "../../../data/ui";

const TemplatePopup = () => {
  const dispatch = useAppDispatch();
  const uIState = useAppSelector(selectUIState);

  const onClickCancel = () => {
    if (uIState.type == UIStateType.TemplatePopup) {
      dispatch(setUIState({ type: UIStateType.Idle }));
    }
  };

  return (
    <div className="template-popup-container">
      <div onClick={onClickCancel} className="template-popup-mask" />
      <div className="template-popup-main-container">
        <img src={background} className="template-popup-main-background" />
      </div>
    </div>
  );
};

export default TemplatePopup;
