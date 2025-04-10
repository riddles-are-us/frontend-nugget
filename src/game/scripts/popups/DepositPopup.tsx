import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./DepositPopup.css";
import { selectUIState, setUIState, UIStateType } from "../../../data/ui";
import HorizontalExtendableImage from "../common/HorizontalExtendableImage";
import leftBackground from "../../images/popups/default/left.png";
import midBackground from "../../images/popups/default/mid.png";
import rightBackground from "../../images/popups/default/right.png";
import PopupCloseButton from "../buttons/PopupCloseButton";

const DepositPopup = () => {
  const dispatch = useAppDispatch();
  const uIState = useAppSelector(selectUIState);

  const onClickCancel = () => {
    if (uIState.type == UIStateType.DepositPopup) {
      dispatch(setUIState({ type: UIStateType.Idle }));
    }
  };

  return (
    <div className="deposit-popup-container">
      <div onClick={onClickCancel} className="deposit-popup-mask" />
      <div className="deposit-popup-main-container">
        <div className="deposit-popup-main-background">
          <HorizontalExtendableImage
            leftRatio={58 / 238}
            rightRatio={58 / 238}
            leftImage={leftBackground}
            midImage={midBackground}
            rightImage={rightBackground}
          />
        </div>
        <div className="deposit-popup-close-button">
          <PopupCloseButton onClick={onClickCancel} isDisabled={false} />
        </div>
        {/* <input
          type="number"
          className="deposit-popup-amount-input"
          value={amountString}
          onChange={(e) => setAmountString(e.target.value)}
          placeholder="Enter amount"
        /> */}
        {/* <div className="deposit-popup-confirm-button">
          <ConfirmButton onClick={onClickConfirm} />
        </div> */}
        {/* <div className="deposit-popup-cancel-button">
          <CancelButton onClick={onClickCancel} />
        </div> */}
      </div>
    </div>
  );
};

export default DepositPopup;
