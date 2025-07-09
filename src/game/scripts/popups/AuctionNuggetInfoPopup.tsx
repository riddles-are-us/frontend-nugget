import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./AuctionNuggetInfoPopup.css";
import { setUIState, TabState, UIStateType } from "../../../data/ui";
import {
  LoadingType,
  pushError,
  selectIsLoading,
  setLoadingType,
} from "../../../data/errors";
import PriceInputPopup from "./PriceInputPopup";
import {
  getBidNuggetTransactionCommandArray,
  sendTransaction,
} from "../request";
import { useWalletContext } from "zkwasm-minirollup-browser";
import { selectUserState } from "../../../data/state";
import {
  resetAuctionNuggetTab,
  resetLotNuggetTab,
  selectNugget,
  setNuggetsForceUpdate,
} from "../../../data/nuggets";
import BaseNuggetInfoPopup from "./BaseNuggetInfoPopup";

interface Props {
  nuggetIndex: number;
  isShowingBidAmountPopup: boolean;
}

const AuctionNuggetInfoPopup = ({
  nuggetIndex,
  isShowingBidAmountPopup,
}: Props) => {
  const dispatch = useAppDispatch();
  const nuggetData = useAppSelector(
    selectNugget(TabState.Auction, nuggetIndex)
  );

  const isLoading = useAppSelector(selectIsLoading);
  const nuggetBidPrice = nuggetData.bid?.bidprice ?? 0;
  const nuggetAskPrice = nuggetData.askprice;
  const { l2Account } = useWalletContext();
  const userState = useAppSelector(selectUserState);

  const onClickBidNugget = () => {
    if (!isLoading) {
      dispatch(
        setUIState({
          type: UIStateType.AuctionNuggetInfoPopup,
          nuggetIndex,
          isShowingBidAmountPopup: true,
        })
      );
    }
  };

  const onBidNugget = (amount: number) => {
    if (!isLoading) {
      dispatch(setLoadingType(LoadingType.BidNugget));
      dispatch(
        sendTransaction({
          cmd: getBidNuggetTransactionCommandArray(
            userState!.player!.nonce,
            nuggetData.marketid,
            amount
          ),
          prikey: l2Account!.getPrivateKey(),
        })
      ).then(async (action) => {
        if (sendTransaction.fulfilled.match(action)) {
          console.log("bid nugget update successed");
          dispatch(resetLotNuggetTab());
          dispatch(resetAuctionNuggetTab());
          dispatch(setNuggetsForceUpdate(true));
          dispatch(setLoadingType(LoadingType.None));
          dispatch(setUIState({ type: UIStateType.Idle }));
        } else if (sendTransaction.rejected.match(action)) {
          const message = "bid nugget Error: " + action.payload;
          dispatch(pushError(message));
          console.error(message);
          dispatch(setLoadingType(LoadingType.None));
        }
      });
    }
  };

  const onCancelBidNugget = () => {
    if (!isLoading) {
      dispatch(
        setUIState({
          type: UIStateType.AuctionNuggetInfoPopup,
          nuggetIndex,
          isShowingBidAmountPopup: false,
        })
      );
    }
  };

  return (
    <div className="auction-nugget-info-popup-container">
      <BaseNuggetInfoPopup
        nuggetData={nuggetData}
        showBidPrice={true}
        showBuyOutPrice={true}
        showSelfOwnedTag={true}
        showSettleHint={true}
        onClickBidNugget={onClickBidNugget}
      />
      {isShowingBidAmountPopup && (
        <PriceInputPopup
          title="Bid"
          description={`Enter the price (${
            Number(nuggetBidPrice) + 1
          } - ${nuggetAskPrice})`}
          min={Number(nuggetBidPrice) + 1}
          max={nuggetAskPrice}
          onConfirm={onBidNugget}
          onCancel={onCancelBidNugget}
        />
      )}
    </div>
  );
};

export default AuctionNuggetInfoPopup;
