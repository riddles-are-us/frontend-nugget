import React from "react";
import { useAppSelector } from "../../../app/hooks";
import DepositPopup from "../popups/DepositPopup";
import { selectUIState, UIStateType } from "../../../data/ui";
import InventoryNuggetInfoPopup from "../popups/InventoryNuggetInfoPopup";
import WithdrawPopup from "../popups/WithdrawPopup";
import BidNuggetInfoPopup from "../popups/BidNuggetInfoPopup";
import MarketNuggetInfoPopup from "../popups/MarketNuggetInfoPopup";

const Popups = () => {
  const uIState = useAppSelector(selectUIState);

  return (
    <>
      {uIState.type == UIStateType.DepositPopup && <DepositPopup />}
      {uIState.type == UIStateType.WithdrawPopup && <WithdrawPopup />}
      {uIState.type == UIStateType.InventoryNuggetInfoPopup && (
        <InventoryNuggetInfoPopup nuggetData={uIState.nuggetData} />
      )}
      {uIState.type == UIStateType.MarketNuggetInfoPopup && (
        <MarketNuggetInfoPopup nuggetData={uIState.nuggetData} />
      )}
      {uIState.type == UIStateType.BidNuggetInfoPopup && (
        <BidNuggetInfoPopup nuggetData={uIState.nuggetData} />
      )}
    </>
  );
};

export default Popups;
