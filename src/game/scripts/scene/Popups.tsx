import React from "react";
import { useAppSelector } from "../../../app/hooks";
import DepositPopup from "../popups/DepositPopup";
import { selectUIState, UIStateType } from "../../../data/ui";
import InventoryNuggetInfoPopup from "../popups/InventoryNuggetInfoPopup";
import WithdrawPopup from "../popups/WithdrawPopup";
import BidNuggetInfoPopup from "../popups/BidNuggetInfoPopup";
import MarketNuggetInfoPopup from "../popups/MarketNuggetInfoPopup";
import ErrorPopup from "../popups/ErrorPopup";
import { selectError } from "../../../data/errors";

const Popups = () => {
  const uIState = useAppSelector(selectUIState);
  const error = useAppSelector(selectError);

  return (
    <>
      {uIState.type == UIStateType.DepositPopup && <DepositPopup />}
      {uIState.type == UIStateType.WithdrawPopup && <WithdrawPopup />}
      {uIState.type == UIStateType.InventoryNuggetInfoPopup && (
        <InventoryNuggetInfoPopup nuggetIndex={uIState.nuggetIndex} />
      )}
      {uIState.type == UIStateType.MarketNuggetInfoPopup && (
        <MarketNuggetInfoPopup
          nuggetIndex={uIState.nuggetIndex}
          isShowingBidAmountPopup={uIState.isShowingBidAmountPopup}
        />
      )}
      {uIState.type == UIStateType.BidNuggetInfoPopup && (
        <BidNuggetInfoPopup nuggetIndex={uIState.nuggetIndex} />
      )}
      {error && <ErrorPopup message={error} />}
    </>
  );
};

export default Popups;
