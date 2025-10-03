import React from "react";
import { useAppSelector } from "../../../app/hooks";
import DepositPopup from "../popups/DepositPopup";
import {
  BottomTabState,
  selectBottomTabState,
  selectUIState,
  UIStateType,
} from "../../../data/ui";
import InventoryNuggetInfoPopup from "../popups/InventoryNuggetInfoPopup";
import WithdrawPopup from "../popups/WithdrawPopup";
import LotNuggetInfoPopup from "../popups/LotNuggetInfoPopup";
import AuctionNuggetInfoPopup from "../popups/AuctionNuggetInfoPopup";
import ErrorPopup from "../popups/ErrorPopup";
import { selectError } from "../../../data/errors";
import SellingNuggetInfoPopup from "../popups/SellingNuggetInfoPopup";
import ConfirmPopup from "../popups/ConfirmPopup";
import LeaderRankPopup from "../popups/LeaderRankPopup";
import EarningRankPopup from "../popups/EarningRankPopup";
import TreasureInfoPopup from "../popups/TreasureInfoPopup";

const Popups = () => {
  const uIState = useAppSelector(selectUIState);
  const bottomTabState = useAppSelector(selectBottomTabState);
  const error = useAppSelector(selectError);

  return (
    <>
      {uIState.type == UIStateType.DepositPopup && <DepositPopup />}
      {uIState.type == UIStateType.WithdrawPopup && <WithdrawPopup />}
      {uIState.type == UIStateType.ConfirmPopup && (
        <ConfirmPopup title={uIState.title} description={uIState.description} />
      )}
      {uIState.type == UIStateType.InventoryNuggetInfoPopup && (
        <InventoryNuggetInfoPopup
          nuggetIndex={uIState.nuggetIndex}
          isShowingListAmountPopup={uIState.isShowingListAmountPopup}
        />
      )}
      {uIState.type == UIStateType.SellingNuggetInfoPopup && (
        <SellingNuggetInfoPopup nuggetIndex={uIState.nuggetIndex} />
      )}
      {uIState.type == UIStateType.AuctionNuggetInfoPopup && (
        <AuctionNuggetInfoPopup
          nuggetIndex={uIState.nuggetIndex}
          isShowingBidAmountPopup={uIState.isShowingBidAmountPopup}
        />
      )}
      {uIState.type == UIStateType.LotNuggetInfoPopup && (
        <LotNuggetInfoPopup
          nuggetIndex={uIState.nuggetIndex}
          isShowingBidAmountPopup={uIState.isShowingBidAmountPopup}
        />
      )}
      {uIState.type == UIStateType.TreasureInfoPopup && <TreasureInfoPopup />}
      {uIState.type == UIStateType.LeaderRankPopup && <LeaderRankPopup />}
      {uIState.type == UIStateType.EarningRankPopup && <EarningRankPopup />}
      {error && <ErrorPopup message={error} />}
    </>
  );
};

export default Popups;
