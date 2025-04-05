import React from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectUIState, UIState } from "../../../data/p_ui";

const Popups = () => {
  const uIState = useAppSelector(selectUIState);
  // const showWithdrawPopup = uIState == UIState.WithdrawPopup;
  // const showDepositPopup = uIState == UIState.DepositPopup;

  return (
    <>
      {/* {showWithdrawPopup && <WithdrawPopup />}
      {showDepositPopup && <DepositPopup />} */}
    </>
  );
};

export default Popups;
