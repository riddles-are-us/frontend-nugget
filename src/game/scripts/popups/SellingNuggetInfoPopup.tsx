import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./SellingNuggetInfoPopup.css";
import { setUIState, TabState, UIStateType } from "../../../data/ui";
import {
  resetSellingNuggetTab,
  selectNugget,
  setNuggetsForceUpdate,
} from "../../../data/nuggets";
import {
  getSellNuggetTransactionCommandArray,
  sendTransaction,
} from "../request";
import { pushError } from "../../../data/error";
import {
  LoadingType,
  selectIsLoading,
  setLoadingType,
} from "../../../data/loading";
import { useWalletContext } from "zkwasm-minirollup-browser";
import { selectUserState } from "../../../data/state";
import BaseNuggetInfoPopup from "./BaseNuggetInfoPopup";

interface Props {
  nuggetIndex: number;
}

const SellingNuggetInfoPopup = ({ nuggetIndex }: Props) => {
  const dispatch = useAppDispatch();
  const nuggetData = useAppSelector(
    selectNugget(TabState.Selling, nuggetIndex)
  );
  const isLoading = useAppSelector(selectIsLoading);
  const { l2Account } = useWalletContext();
  const userState = useAppSelector(selectUserState);

  const onClickSell = () => {
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
          console.log("selling nugget update successed");
          dispatch(resetSellingNuggetTab());
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
    <div className="selling-nugget-info-popup-container">
      <BaseNuggetInfoPopup
        nuggetData={nuggetData}
        showBidPrice={true}
        showBuyOutPrice={true}
        showSelfOwnedTag={false}
        showSettleHint={false}
        onClickSell={onClickSell}
      />
    </div>
  );
};

export default SellingNuggetInfoPopup;
