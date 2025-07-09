import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./LotNuggetInfoPopup.css";
import { setUIState, TabState, UIStateType } from "../../../data/ui";
import {
  resetAuctionNuggetTab,
  resetLotNuggetTab,
  selectNugget,
  setNuggetsForceUpdate,
} from "../../../data/nuggets";
import {
  LoadingType,
  pushError,
  selectIsLoading,
  setLoadingType,
} from "../../../data/errors";
import {
  getBidNuggetTransactionCommandArray,
  getSellNuggetTransactionCommandArray,
  sendTransaction,
} from "../request";
import { useWalletContext } from "zkwasm-minirollup-browser";
import { selectUserState } from "../../../data/state";
import PriceInputPopup from "./PriceInputPopup";
import BaseNuggetInfoPopup from "./BaseNuggetInfoPopup";

interface Props {
  nuggetIndex: number;
  isShowingBidAmountPopup: boolean;
}

const LotNuggetInfoPopup = ({
  nuggetIndex,
  isShowingBidAmountPopup,
}: Props) => {
  const dispatch = useAppDispatch();
  const nuggetData = useAppSelector(selectNugget(TabState.Lot, nuggetIndex));

  const isLoading = useAppSelector(selectIsLoading);
  const { l2Account } = useWalletContext();
  const userState = useAppSelector(selectUserState);
  const nuggetBidPrice = nuggetData.bid?.bidprice ?? 0;
  const nuggetAskPrice = nuggetData.askprice;

  const onClickBidNugget = () => {
    if (!isLoading) {
      dispatch(
        setUIState({
          type: UIStateType.LotNuggetInfoPopup,
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
          type: UIStateType.LotNuggetInfoPopup,
          nuggetIndex,
          isShowingBidAmountPopup: false,
        })
      );
    }
  };

  const onClickSettle = () => {
    if (!isLoading) {
      dispatch(setLoadingType(LoadingType.SettleNugget));
      dispatch(
        sendTransaction({
          cmd: getSellNuggetTransactionCommandArray(
            userState!.player!.nonce,
            nuggetData.marketid
          ),
          prikey: l2Account!.getPrivateKey(),
        })
      ).then(async (action) => {
        if (sendTransaction.fulfilled.match(action)) {
          console.log("settle nugget update successed");
          dispatch(resetLotNuggetTab());
          dispatch(setNuggetsForceUpdate(true));
          dispatch(setLoadingType(LoadingType.None));
          dispatch(setUIState({ type: UIStateType.Idle }));
        } else if (sendTransaction.rejected.match(action)) {
          const message = "selling nugget Error: " + action.payload;
          dispatch(pushError(message));
          console.error(message);
          dispatch(setLoadingType(LoadingType.None));
        }
      });
    }
  };

  return (
    <div className="lot-nugget-info-popup-container">
      <BaseNuggetInfoPopup
        nuggetData={nuggetData}
        showBidPrice={true}
        showBuyOutPrice={true}
        showSelfOwnedTag={false}
        showSettleHint={false}
        onClickBidNugget={onClickBidNugget}
        onClickSettle={onClickSettle}
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

export default LotNuggetInfoPopup;
