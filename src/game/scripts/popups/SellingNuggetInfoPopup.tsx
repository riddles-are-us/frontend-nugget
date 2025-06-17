import { useState, useRef, useEffect } from "react";
import background from "../../images/popups/pop_frame.png";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./SellingNuggetInfoPopup.css";
import { setUIState, TabState, UIStateType } from "../../../data/ui";
import { getAttributeList, getTextShadowStyle } from "../common/Utility";
import NuggetLevel from "../scene/gameplay/NuggetLevel";
import image from "../../images/nuggets/image.png";
import PopupCloseButton from "../buttons/PopupCloseButton";
import {
  resetSellingNuggetTab,
  selectNugget,
  setNuggetsForceUpdate,
} from "../../../data/nuggets";
import DefaultButton from "../buttons/DefaultButton";
import {
  getSellNuggetTransactionCommandArray,
  sendTransaction,
} from "../request";
import {
  LoadingType,
  pushError,
  selectIsLoading,
  setLoadingType,
} from "../../../data/errors";
import { AccountSlice } from "zkwasm-minirollup-browser";
import { selectUserState } from "../../../data/state";
import { LeHexBN } from "zkwasm-minirollup-rpc";
import { bnToHexLe } from "delphinus-curves/src/altjubjub";

interface Props {
  nuggetIndex: number;
}

const attributeLefts = [
  0.008, 0.045, 0.083, 0.123, 0.16, 0.197, 0.236, 0.274, 0.313, 0.351, 0.39,
  0.428, 0.467, 0.505, 0.543, 0.582, 0.619, 0.658, 0.695, 0.733, 0.769, 0.808,
  0.845, 0.883, 0.92, 0.957,
];

const SellingNuggetInfoPopup = ({ nuggetIndex }: Props) => {
  const dispatch = useAppDispatch();
  const nuggetData = useAppSelector(
    selectNugget(TabState.Selling, nuggetIndex)
  );
  const containerRef = useRef<HTMLParagraphElement>(null);
  const isLoading = useAppSelector(selectIsLoading);
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const userState = useAppSelector(selectUserState);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [descriptionFontSize, setDescriptionFontSize] = useState<number>(0);
  const [attributesFontSize, setAttributesFontSize] = useState<number>(0);
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

  const onClickSell = () => {
    if (!isLoading) {
      dispatch(setLoadingType(LoadingType.SettleNugget));
      dispatch(
        sendTransaction({
          cmd: getSellNuggetTransactionCommandArray(
            userState!.player!.nonce,
            nuggetData.marketid
          ),
          prikey: l2account!.getPrivateKey(),
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

  const onClickCancel = () => {
    if (!isLoading) {
      dispatch(setUIState({ type: UIStateType.Idle }));
    }
  };

  return (
    <div className="selling-nugget-info-popup-container">
      <div onClick={onClickCancel} className="selling-nugget-info-popup-mask" />
      <div
        ref={containerRef}
        className="selling-nugget-info-popup-main-container"
      >
        <img src={image} className="selling-nugget-info-popup-avatar-image" />
        <img
          src={background}
          className="selling-nugget-info-popup-main-background"
        />
        <div className="selling-nugget-info-popup-close-button">
          <PopupCloseButton onClick={onClickCancel} isDisabled={false} />
        </div>
        <p
          className="selling-nugget-info-popup-title-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          {`NuggetId: ${nuggetId}`}
        </p>
        <p
          className="selling-nugget-info-popup-price-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Recycle Price: ${nuggetPrice}`}
        </p>
        <p
          className="selling-nugget-info-popup-bid-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Bid Price: ${nuggetBidPrice}`}
        </p>
        <p
          className="selling-nugget-info-popup-ask-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Ask Price: ${nuggetAskPrice}`}
        </p>
        {nuggetBidderId && (
          <p
            className="selling-nugget-info-popup-bidder-text"
            style={{
              fontSize: descriptionFontSize,
              ...getTextShadowStyle(descriptionFontSize / 15),
            }}
          >
            {`Bidder: ${nuggetBidderId}`}
          </p>
        )}
        <div className="selling-nugget-info-popup-levels-container">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className={`selling-nugget-info-popup-level-container`}
            >
              <NuggetLevel key={index} isActive={index < nuggetLevel} />
            </div>
          ))}
        </div>
        <div>
          {nuggetAttributeString.slice(0, 26).map((s, index) => (
            <p
              key={index}
              className="selling-nugget-info-popup-attributes-text"
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
        <div className="selling-nugget-info-popup-bid-button">
          <DefaultButton
            text={"Sell"}
            onClick={onClickSell}
            isDisabled={false}
          />
        </div>
      </div>
    </div>
  );
};

export default SellingNuggetInfoPopup;
