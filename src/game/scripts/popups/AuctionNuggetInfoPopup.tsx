import { useState, useRef, useEffect } from "react";
import background from "../../images/popups/pop_frame.png";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./AuctionNuggetInfoPopup.css";
import { setUIState, UIStateType } from "../../../data/ui";
import { getAttributeList, getTextShadowStyle } from "../common/Utility";
import NuggetLevel from "../scene/gameplay/NuggetLevel";
import image from "../../images/nuggets/image.png";
import DefaultButton from "../buttons/DefaultButton";
import PopupCloseButton from "../buttons/PopupCloseButton";
import { pushError, selectIsLoading, setIsLoading } from "../../../data/errors";
import PriceInputPopup from "./PriceInputPopup";
import { selectAuctionNuggetData } from "../../../data/nuggets";
import {
  getBidNuggetTransactionCommandArray,
  sendTransaction,
} from "../request";
import { updateAuctionNuggetsAsync, updateLotNuggetsAsync } from "../express";
import { AccountSlice } from "zkwasm-minirollup-browser";
import { selectUserState } from "../../../data/state";
import { LeHexBN } from "zkwasm-minirollup-rpc";
import { bnToHexLe } from "delphinus-curves/src/altjubjub";

interface Props {
  nuggetIndex: number;
  isShowingBidAmountPopup: boolean;
}

const attributeLefts = [
  0.008, 0.045, 0.083, 0.123, 0.16, 0.197, 0.236, 0.274, 0.313, 0.351, 0.39,
  0.428, 0.467, 0.505, 0.543, 0.582, 0.619, 0.658, 0.695, 0.733, 0.769, 0.808,
  0.845, 0.883, 0.92, 0.957,
];

const AuctionNuggetInfoPopup = ({
  nuggetIndex,
  isShowingBidAmountPopup,
}: Props) => {
  const dispatch = useAppDispatch();
  const nuggetData = useAppSelector(selectAuctionNuggetData(nuggetIndex));
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [descriptionFontSize, setDescriptionFontSize] = useState<number>(0);
  const [attributesFontSize, setAttributesFontSize] = useState<number>(0);
  const isLoading = useAppSelector(selectIsLoading);
  const nuggetId = nuggetData.id;
  const nuggetPrice = nuggetData.sysprice;
  const nuggetCycle = nuggetData.cycle;
  const nuggetLevel = nuggetData.feature;
  const nuggetBid = nuggetData.bid?.bidprice ?? 0;
  const nuggetBidderId = nuggetData.bid?.bidder[0] ?? 0;
  const nuggetAttributeString = getAttributeList(
    nuggetData.attributes,
    nuggetData.feature
  );
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const userState = useAppSelector(selectUserState);
  const pids = l2account?.pubkey
    ? new LeHexBN(bnToHexLe(l2account?.pubkey)).toU64Array()
    : ["", "", "", ""];

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
      dispatch(setUIState({ type: UIStateType.Idle }));
    }
  };

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
      dispatch(setIsLoading(true));
      dispatch(
        sendTransaction({
          cmd: getBidNuggetTransactionCommandArray(
            userState!.player!.nonce,
            nuggetData.marketid,
            amount
          ),
          prikey: l2account!.getPrivateKey(),
        })
      ).then(async (action) => {
        if (sendTransaction.fulfilled.match(action)) {
          console.log("bid nugget update successed");
          await updateAuctionNuggetsAsync(dispatch);
          await updateLotNuggetsAsync(
            dispatch,
            pids[1].toString(),
            pids[2].toString()
          );
          dispatch(setIsLoading(false));
          dispatch(setUIState({ type: UIStateType.Idle }));
        } else if (sendTransaction.rejected.match(action)) {
          const message = "bid nugget Error: " + action.payload;
          dispatch(pushError(message));
          console.error(message);
          dispatch(setIsLoading(false));
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
      <div onClick={onClickCancel} className="auction-nugget-info-popup-mask" />
      <div
        ref={containerRef}
        className="auction-nugget-info-popup-main-container"
      >
        <img src={image} className="auction-nugget-info-popup-avatar-image" />
        <img
          src={background}
          className="auction-nugget-info-popup-main-background"
        />
        <div className="auction-nugget-info-popup-close-button">
          <PopupCloseButton onClick={onClickCancel} isDisabled={false} />
        </div>
        <p
          className="auction-nugget-info-popup-title-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          {`NuggetId: ${nuggetId}`}
        </p>
        <p
          className="auction-nugget-info-popup-price-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Recycle Price: ${nuggetPrice}`}
        </p>
        <p
          className="auction-nugget-info-popup-cycle-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Cycle: ${nuggetCycle}`}
        </p>
        <p
          className="auction-nugget-info-popup-bid-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Bid Price: ${nuggetBid}`}
        </p>
        {nuggetBidderId && (
          <p
            className="auction-nugget-info-popup-bidder-text"
            style={{
              fontSize: descriptionFontSize,
              ...getTextShadowStyle(descriptionFontSize / 15),
            }}
          >
            {`Bidder: ${nuggetBidderId}`}
          </p>
        )}
        <div className="auction-nugget-info-popup-levels-container">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className={`auction-nugget-info-popup-level-container`}
            >
              <NuggetLevel key={index} isActive={index < nuggetLevel} />
            </div>
          ))}
        </div>
        <div>
          {nuggetAttributeString.slice(0, 26).map((s, index) => (
            <p
              key={index}
              className="auction-nugget-info-popup-attributes-text"
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
        <div className="auction-nugget-info-popup-bid-button">
          <DefaultButton
            text={"Bid"}
            onClick={onClickBidNugget}
            isDisabled={false}
          />
        </div>
      </div>

      {isShowingBidAmountPopup && (
        <PriceInputPopup
          title="bid"
          onClickConfirm={onBidNugget}
          onClickCancel={onCancelBidNugget}
        />
      )}
    </div>
  );
};

export default AuctionNuggetInfoPopup;
