import { useState, useRef, useEffect } from "react";
import background from "../../images/popups/nugget_detail_frame.png";
import self_own_tag from "../../images/scene/gameplay/nugget/tag_frame.png";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./BaseNuggetInfoPopup.css";
import { setUIState, TabState, UIStateType } from "../../../data/ui";
import {
  formatTimeOneDigit,
  getAttributeList,
  getIsFullyExplored,
  getIsSettleEnabled,
  getNuggetImage,
  getTextShadowStyle,
} from "../common/Utility";
import NuggetLevel from "../scene/gameplay/NuggetLevel";
import DefaultButton from "../buttons/DefaultButton";
import PopupCloseButton from "../buttons/PopupCloseButton";
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
import { LeHexBN } from "zkwasm-minirollup-rpc";
import { bnToHexLe } from "delphinus-curves/src/altjubjub";
import {
  resetAuctionNuggetTab,
  resetLotNuggetTab,
  selectNugget,
  setNuggetsForceUpdate,
} from "../../../data/nuggets";

interface Props {
  nuggetIndex: number;
  showBidPrice: boolean;
  showBuyOutPrice: boolean;
  showSelfOwnedTag: boolean;
  showSettleHint: boolean;
  onClickRecycleNugget?: () => void;
  onClickListNugget?: () => void;
  onClickExploreNugget?: () => void;
  onClickSell?: () => void;
  onClickBidNugget?: () => void;
  onClickSettle?: () => void;
}

const attributeLefts = [
  0.008, 0.045, 0.083, 0.123, 0.16, 0.197, 0.236, 0.274, 0.313, 0.351, 0.39,
  0.428, 0.467, 0.505, 0.543, 0.582, 0.619, 0.658, 0.695, 0.733, 0.769, 0.808,
  0.845, 0.883, 0.92, 0.957,
];

const BaseNuggetInfoPopup = ({
  nuggetIndex,
  showBidPrice,
  showBuyOutPrice,
  showSelfOwnedTag,
  showSettleHint,
  onClickRecycleNugget,
  onClickListNugget,
  onClickExploreNugget,
  onClickSell,
  onClickBidNugget,
  onClickSettle,
}: Props) => {
  const dispatch = useAppDispatch();
  const nuggetData = useAppSelector(
    selectNugget(TabState.Auction, nuggetIndex)
  );

  const containerRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [descriptionFontSize, setDescriptionFontSize] = useState<number>(0);
  const [attributesFontSize, setAttributesFontSize] = useState<number>(0);
  const [tagFontSize, setTagFontSize] = useState<number>(0);
  const isLoading = useAppSelector(selectIsLoading);
  const nuggetId = nuggetData.id;
  const nuggetPrice = nuggetData.sysprice;
  const nuggetLevel = 7 - nuggetData.feature;
  const nuggetBidPrice = nuggetData.bid?.bidprice ?? 0;
  const nuggetAskPrice = nuggetData.askprice;
  const nuggetBidderId = nuggetData.bid?.bidder[0] ?? 0;
  const nuggetAttributeString = getAttributeList(
    nuggetData.attributes,
    nuggetData.feature
  );
  const nuggetExplorePrice = Math.floor(nuggetPrice / 4);
  const isFullyExplored = getIsFullyExplored(nuggetData.attributes);
  const { l2Account } = useWalletContext();
  const userState = useAppSelector(selectUserState);
  const coin = userState.player!.data.balance;
  const pids = l2Account?.pubkey
    ? new LeHexBN(bnToHexLe(l2Account?.pubkey)).toU64Array()
    : ["", "", "", ""];
  const hasBidden = nuggetData.lastUpdate >= 0;
  const isSettleEnabled = getIsSettleEnabled(
    userState.state.counter,
    nuggetData.lastUpdate
  );
  const remainSettleTime = formatTimeOneDigit(
    userState.state.counter,
    nuggetData.lastUpdate
  );
  const selfOwned =
    nuggetData.owner[0] == Number(pids[1]) &&
    nuggetData.owner[1] == Number(pids[2]);

  const adjustSize = () => {
    if (containerRef.current) {
      setTitleFontSize(containerRef.current.offsetHeight / 10);
      setDescriptionFontSize(containerRef.current.offsetHeight / 13);
      setAttributesFontSize(containerRef.current.offsetHeight / 10);
      setTagFontSize(containerRef.current.offsetHeight / 13);
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

  return (
    <div className="base-nugget-info-popup-container">
      <div onClick={onClickCancel} className="base-nugget-info-popup-mask" />
      <div ref={containerRef} className="base-nugget-info-popup-main-container">
        <img
          src={getNuggetImage(nuggetLevel)}
          className="base-nugget-info-popup-avatar-image"
        />
        <img
          src={background}
          className="base-nugget-info-popup-main-background"
        />
        <div className="base-nugget-info-popup-close-button">
          <PopupCloseButton onClick={onClickCancel} isDisabled={false} />
        </div>
        <p
          className="base-nugget-info-popup-title-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          {`NuggetId: ${nuggetId}`}
        </p>
        <p
          className="base-nugget-info-popup-price-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Recycle Price: ${nuggetPrice}`}
        </p>
        {showBidPrice && (
          <p
            className="base-nugget-info-popup-bid-text"
            style={{
              fontSize: descriptionFontSize,
              ...getTextShadowStyle(descriptionFontSize / 15),
            }}
          >
            {`Bid Price: ${nuggetBidPrice}`}
          </p>
        )}
        {showBuyOutPrice && (
          <p
            className="base-nugget-info-popup-ask-text"
            style={{
              fontSize: descriptionFontSize,
              ...getTextShadowStyle(descriptionFontSize / 15),
            }}
          >
            {`Buyout Price: ${nuggetAskPrice}`}
          </p>
        )}
        {nuggetBidderId && (
          <p
            className="base-nugget-info-popup-bidder-text"
            style={{
              fontSize: descriptionFontSize,
              ...getTextShadowStyle(descriptionFontSize / 15),
            }}
          >
            {`Bidder: ${nuggetBidderId}`}
          </p>
        )}
        {showSettleHint && hasBidden && (
          <p
            className="base-nugget-info-popup-settle-text"
            style={{
              fontSize: descriptionFontSize,
              ...getTextShadowStyle(descriptionFontSize / 15),
            }}
          >
            {isSettleEnabled
              ? "Can be settled"
              : `Settle in ${remainSettleTime}`}
          </p>
        )}
        <div className="base-nugget-info-popup-levels-container">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className={`base-nugget-info-popup-level-container`}
            >
              <NuggetLevel key={index} isActive={index < nuggetLevel} />
            </div>
          ))}
        </div>
        <div>
          {nuggetAttributeString.slice(0, 26).map((s, index) => (
            <p
              key={index}
              className="base-nugget-info-popup-attributes-text"
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
        {showSelfOwnedTag && selfOwned && (
          <div className="base-nugget-info-popup-tag-container">
            <img
              className="base-nugget-info-popup-tag-image"
              src={self_own_tag}
            />
            <p
              className="base-nugget-info-popup-tag-text"
              style={{
                fontSize: tagFontSize,
                ...getTextShadowStyle(tagFontSize / 15),
              }}
            >
              List by you
            </p>
          </div>
        )}
        {onClickExploreNugget && !isFullyExplored && (
          <div className="base-nugget-info-popup-explore-button">
            <DefaultButton
              text={"Explore           "}
              onClick={onClickExploreNugget}
              isDisabled={coin < nuggetExplorePrice}
            />
            <p
              className="base-nugget-info-popup-coin-text"
              style={{
                fontSize: descriptionFontSize,
                ...getTextShadowStyle(descriptionFontSize / 15),
              }}
            >
              {nuggetExplorePrice}
            </p>
            <div className="base-nugget-info-popup-coin-image" />
          </div>
        )}
        {onClickListNugget && (
          <div className="base-nugget-info-popup-list-button">
            <DefaultButton
              text={"List Nugget"}
              onClick={onClickListNugget}
              isDisabled={false}
            />
          </div>
        )}
        {onClickRecycleNugget && (
          <div className="base-nugget-info-popup-recycle-button">
            <DefaultButton
              text={"Recycle Nugget"}
              onClick={onClickRecycleNugget}
              isDisabled={false}
            />
          </div>
        )}
        {onClickSell && (
          <div className="base-nugget-info-popup-sell-button">
            <DefaultButton
              text={"Sell"}
              onClick={onClickSell}
              isDisabled={false}
            />
          </div>
        )}
        {onClickBidNugget && (
          <div className="base-nugget-info-popup-bid-button">
            <DefaultButton
              text={"Bid"}
              onClick={onClickBidNugget}
              isDisabled={false}
            />
          </div>
        )}
        {onClickSettle && (
          <div className="base-nugget-info-popup-settle-button">
            <DefaultButton
              text={
                isSettleEnabled ? "Settle" : `Settle in ${remainSettleTime}`
              }
              onClick={onClickSettle}
              isDisabled={!isSettleEnabled}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseNuggetInfoPopup;
