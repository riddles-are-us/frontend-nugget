import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./InventoryNuggetInfoPopup.css";
import { setUIState, TabState, UIStateType } from "../../../data/ui";
import {
  getExploreNuggetTransactionCommandArray,
  getListNuggetTransactionCommandArray,
  getRecycleNuggetTransactionCommandArray,
  sendTransaction,
} from "../request";
import { useWalletContext } from "zkwasm-minirollup-browser";
import { selectUserState } from "../../../data/state";
import {
  clearInventoryCache,
  resetAuctionNuggetTab,
  resetSellingNuggetTab,
  selectNugget,
  selectPlayerDataInventoryNuggetIndex,
  setNugget,
  setNuggetsForceUpdate,
} from "../../../data/nuggets";
import {
  LoadingType,
  pushError,
  selectIsLoading,
  setLoadingType,
} from "../../../data/errors";
import { updateNuggetAsync } from "../express";
import { LeHexBN } from "zkwasm-minirollup-rpc";
import { bnToHexLe } from "delphinus-curves/src/altjubjub";
import PriceInputPopup from "./PriceInputPopup";
import BaseNuggetInfoPopup from "./BaseNuggetInfoPopup";

interface Props {
  nuggetIndex: number;
  isShowingListAmountPopup: boolean;
}

const InventoryNuggetInfoPopup = ({
  nuggetIndex,
  isShowingListAmountPopup,
}: Props) => {
  const dispatch = useAppDispatch();
  const nuggetData = useAppSelector(
    selectNugget(TabState.Inventory, nuggetIndex)
  );
  const { l2Account } = useWalletContext();
  const userState = useAppSelector(selectUserState);
  const isLoading = useAppSelector(selectIsLoading);
  const nuggetId = nuggetData.id;
  const pids = l2Account?.pubkey
    ? new LeHexBN(bnToHexLe(l2Account?.pubkey)).toU64Array()
    : ["", "", "", ""];
  const playerDataInventoryNuggetIndex = useAppSelector(
    selectPlayerDataInventoryNuggetIndex(
      userState.player!.data.inventory!,
      nuggetId
    )
  );

  const onClickExploreNugget = () => {
    if (!isLoading) {
      dispatch(setLoadingType(LoadingType.ExploreNugget));
      dispatch(
        sendTransaction({
          cmd: getExploreNuggetTransactionCommandArray(
            userState!.player!.nonce,
            playerDataInventoryNuggetIndex
          ),
          prikey: l2Account!.getPrivateKey(),
        })
      ).then(async (action) => {
        if (sendTransaction.fulfilled.match(action)) {
          console.log("explore nugget successed");
          const updatedNugget = await updateNuggetAsync(nuggetId, [
            Number(pids[1]),
            Number(pids[2]),
          ]);
          dispatch(setNugget(updatedNugget));
          dispatch(setNuggetsForceUpdate(true));
          dispatch(setLoadingType(LoadingType.None));
        } else if (sendTransaction.rejected.match(action)) {
          const message = "explore nugget Error: " + action.payload;
          dispatch(pushError(message));
          console.error(message);
          dispatch(setLoadingType(LoadingType.None));
        }
      });
    }
  };

  const onClickRecycleNugget = () => {
    if (!isLoading) {
      dispatch(setLoadingType(LoadingType.RecycleNugget));
      dispatch(
        sendTransaction({
          cmd: getRecycleNuggetTransactionCommandArray(
            userState!.player!.nonce,
            playerDataInventoryNuggetIndex
          ),
          prikey: l2Account!.getPrivateKey(),
        })
      ).then(async (action) => {
        if (sendTransaction.fulfilled.match(action)) {
          console.log("recycle nugget successed");
          dispatch(setNuggetsForceUpdate(true));
          dispatch(setUIState({ type: UIStateType.Idle }));
          dispatch(setLoadingType(LoadingType.None));
        } else if (sendTransaction.rejected.match(action)) {
          const message = "recycle nugget Error: " + action.payload;
          dispatch(pushError(message));
          console.error(message);
          dispatch(setLoadingType(LoadingType.None));
        }
      });
    }
  };

  const onClickListNugget = () => {
    if (!isLoading) {
      dispatch(
        setUIState({
          type: UIStateType.InventoryNuggetInfoPopup,
          nuggetIndex,
          isShowingListAmountPopup: true,
        })
      );
    }
  };

  const onListNugget = (amount: number) => {
    if (!isLoading) {
      dispatch(setLoadingType(LoadingType.ListNugget));
      dispatch(
        sendTransaction({
          cmd: getListNuggetTransactionCommandArray(
            userState!.player!.nonce,
            playerDataInventoryNuggetIndex,
            amount
          ),
          prikey: l2Account!.getPrivateKey(),
        })
      ).then(async (action) => {
        if (sendTransaction.fulfilled.match(action)) {
          console.log("list nugget successed");

          dispatch(resetSellingNuggetTab());
          dispatch(resetAuctionNuggetTab());
          dispatch(clearInventoryCache());
          dispatch(setNuggetsForceUpdate(true));
          dispatch(setUIState({ type: UIStateType.Idle }));
          dispatch(setLoadingType(LoadingType.None));
        } else if (sendTransaction.rejected.match(action)) {
          const message = "list nugget Error: " + action.payload;
          dispatch(pushError(message));
          console.error(message);
          dispatch(setLoadingType(LoadingType.None));
        }
      });
    }
  };

  const onCancelListNugget = () => {
    if (!isLoading) {
      dispatch(
        setUIState({
          type: UIStateType.InventoryNuggetInfoPopup,
          nuggetIndex,
          isShowingListAmountPopup: false,
        })
      );
    }
  };

  return (
    <div className="inventory-nugget-info-popup-container">
      <BaseNuggetInfoPopup
        nuggetData={nuggetData}
        showBidPrice={false}
        showBuyOutPrice={false}
        showSelfOwnedTag={false}
        showSettleHint={false}
        onClickRecycleNugget={onClickRecycleNugget}
        onClickListNugget={onClickListNugget}
        onClickExploreNugget={onClickExploreNugget}
      />
      {isShowingListAmountPopup && (
        <PriceInputPopup
          title="List"
          description={"Enter the buyout price"}
          min={1}
          onConfirm={onListNugget}
          onCancel={onCancelListNugget}
          cost={500}
        />
      )}
    </div>
  );
};

export default InventoryNuggetInfoPopup;
