import { useState, useRef, useEffect } from "react";
import background from "../../images/popups/pop_frame.png";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./InventoryNuggetInfoPopup.css";
import { setUIState, TabState, UIStateType } from "../../../data/ui";
import {
  getAttributeList,
  getIsFullyExplored,
  getTextShadowStyle,
} from "../common/Utility";
import NuggetLevel from "../scene/gameplay/NuggetLevel";
import image from "../../images/nuggets/image.png";
import DefaultButton from "../buttons/DefaultButton";
import PopupCloseButton from "../buttons/PopupCloseButton";
import {
  getExploreNuggetTransactionCommandArray,
  getListNuggetTransactionCommandArray,
  getRecycleNuggetTransactionCommandArray,
  sendTransaction,
} from "../request";
import { AccountSlice } from "zkwasm-minirollup-browser";
import { selectUserState } from "../../../data/state";
import {
  clearInventoryCache,
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

interface Props {
  nuggetIndex: number;
  isShowingListAmountPopup: boolean;
}

const attributeLefts = [
  0.008, 0.045, 0.083, 0.123, 0.16, 0.197, 0.236, 0.274, 0.313, 0.351, 0.39,
  0.428, 0.467, 0.505, 0.543, 0.582, 0.619, 0.658, 0.695, 0.733, 0.769, 0.808,
  0.845, 0.883, 0.92, 0.957,
];

const InventoryNuggetInfoPopup = ({
  nuggetIndex,
  isShowingListAmountPopup,
}: Props) => {
  const dispatch = useAppDispatch();
  const nuggetData = useAppSelector(
    selectNugget(TabState.Inventory, nuggetIndex)
  );
  const containerRef = useRef<HTMLParagraphElement>(null);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const userState = useAppSelector(selectUserState);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [descriptionFontSize, setDescriptionFontSize] = useState<number>(0);
  const [attributesFontSize, setAttributesFontSize] = useState<number>(0);
  const isLoading = useAppSelector(selectIsLoading);
  const nuggetId = nuggetData.id;
  const nuggetPrice = nuggetData.sysprice;
  const nuggetLevel = 7 - nuggetData.feature;
  const nuggetExplorePrice = Math.floor(nuggetPrice / 4);
  const nuggetAttributeString = getAttributeList(
    nuggetData.attributes,
    nuggetData.feature
  );
  const pids = l2account?.pubkey
    ? new LeHexBN(bnToHexLe(l2account?.pubkey)).toU64Array()
    : ["", "", "", ""];
  const selfOwned =
    nuggetData.owner[0] == Number(pids[1]) &&
    nuggetData.owner[1] == Number(pids[2]);
  const isFullyExplored = getIsFullyExplored(nuggetData.attributes);
  const coin = userState.player!.data.balance;
  const playerDataInventoryNuggetIndex = useAppSelector(
    selectPlayerDataInventoryNuggetIndex(
      userState.player!.data.inventory!,
      nuggetId
    )
  );

  const adjustSize = () => {
    if (containerRef.current) {
      setTitleFontSize(containerRef.current.offsetHeight / 10);
      setDescriptionFontSize(containerRef.current.offsetHeight / 13);
      setAttributesFontSize(containerRef.current.offsetHeight / 10);
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, [containerRef.current]);

  const onClickCancel = () => {
    if (!isLoading) {
      dispatch(setNuggetsForceUpdate(true));
      dispatch(setUIState({ type: UIStateType.Idle }));
    }
  };

  const onClickExploreNugget = () => {
    if (!isLoading) {
      dispatch(setLoadingType(LoadingType.ExploreNugget));
      dispatch(
        sendTransaction({
          cmd: getExploreNuggetTransactionCommandArray(
            userState!.player!.nonce,
            playerDataInventoryNuggetIndex
          ),
          prikey: l2account!.getPrivateKey(),
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
          prikey: l2account!.getPrivateKey(),
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
          prikey: l2account!.getPrivateKey(),
        })
      ).then(async (action) => {
        if (sendTransaction.fulfilled.match(action)) {
          console.log("list nugget successed");

          dispatch(resetSellingNuggetTab());
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
      <div
        onClick={onClickCancel}
        className="inventory-nugget-info-popup-mask"
      />
      <div
        ref={containerRef}
        className="inventory-nugget-info-popup-main-container"
      >
        <img src={image} className="inventory-nugget-info-popup-avatar-image" />
        <img
          src={background}
          className="inventory-nugget-info-popup-main-background"
        />
        <div className="inventory-nugget-info-popup-close-button">
          <PopupCloseButton onClick={onClickCancel} isDisabled={false} />
        </div>
        <p
          className="inventory-nugget-info-popup-title-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          {`NuggetId: ${nuggetId}`}
        </p>
        <p
          className="inventory-nugget-info-popup-price-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Recycle Price: ${nuggetPrice}`}
        </p>
        <div className="inventory-nugget-info-popup-levels-container">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className={`inventory-nugget-info-popup-level-container`}
            >
              <NuggetLevel key={index} isActive={index < nuggetLevel} />
            </div>
          ))}
        </div>
        <div>
          {nuggetAttributeString.slice(0, 26).map((s, index) => (
            <p
              key={index}
              className="inventory-nugget-info-popup-attributes-text"
              style={{
                left: `${attributeLefts[index] * 100}%`,
                fontSize: attributesFontSize,
                ...getTextShadowStyle(attributesFontSize / 15),
              }}
            >
              {s}
            </p>
          ))}
        </div>
        {!isFullyExplored && (
          <div className="inventory-nugget-info-popup-explore-button">
            <DefaultButton
              text={"Explore           "}
              onClick={onClickExploreNugget}
              isDisabled={coin < nuggetExplorePrice}
            />
            <p
              className="inventory-nugget-info-popup-coin-text"
              style={{
                fontSize: descriptionFontSize,
                ...getTextShadowStyle(descriptionFontSize / 15),
              }}
            >
              {nuggetExplorePrice}
            </p>
            <div className="inventory-nugget-info-popup-coin-image" />
          </div>
        )}
        <div className="inventory-nugget-info-popup-list-button">
          <DefaultButton
            text={"List Nugget"}
            onClick={onClickListNugget}
            isDisabled={false}
          />
        </div>
        <div className="inventory-nugget-info-popup-recycle-button">
          <DefaultButton
            text={"Recycle Nugget"}
            onClick={onClickRecycleNugget}
            isDisabled={false}
          />
        </div>
      </div>

      {isShowingListAmountPopup && (
        <PriceInputPopup
          title="List"
          description={"Enter the bid price"}
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
