import React from "react";
import { useAppSelector } from "../../../app/hooks";
import DepositPopup from "../popups/DepositPopup";
import { selectUIState, UIStateType } from "../../../data/ui";
import NuggetInfoPopup from "../popups/NuggetInfoPopup";

const Popups = () => {
  const uIState = useAppSelector(selectUIState);

  return (
    <>
      {uIState.type == UIStateType.DepositPopup && <DepositPopup />}
      {uIState.type == UIStateType.NuggetInfoPopup && (
        <NuggetInfoPopup nuggetData={uIState.nuggetData} />
      )}
    </>
  );
};

export default Popups;
