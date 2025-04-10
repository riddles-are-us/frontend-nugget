import { useState } from "react";
import background from "../../images/popups/pop_frame.png";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./DepositPopup.css";
import { selectUIState, setUIState, UIStateType } from "../../../data/ui";

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
        <img src={background} className="deposit-popup-main-background" />
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
