import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./BidAmountPopup.css";
import { selectUIState, setUIState, UIStateType } from "../../../data/ui";
import HorizontalExtendableImage from "../common/HorizontalExtendableImage";
import leftBackground from "../../images/popups/default/left.png";
import midBackground from "../../images/popups/default/mid.png";
import rightBackground from "../../images/popups/default/right.png";
import leftInputBackground from "../../images/popups/default/left_input.png";
import midInputBackground from "../../images/popups/default/mid_input.png";
import rightInputBackground from "../../images/popups/default/right_input.png";
import PopupCloseButton from "../buttons/PopupCloseButton";
import DefaultButton from "../buttons/DefaultButton";
import { getTextShadowStyle } from "../common/Utility";
import { AccountSlice } from "zkwasm-minirollup-browser";
import { pushError, selectIsLoading, setIsLoading } from "../../../data/errors";
import {
  getBidNuggetTransactionCommandArray,
  getBids,
  getNugget,
  sendTransaction,
} from "../request";
import { selectUserState } from "../../../data/state";

interface Props {
  nuggetIndex: number;
  nuggetId: number;
}

const BidAmountPopup = ({ nuggetIndex, nuggetId }: Props) => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [amountString, setAmountString] = useState<string>("");
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const isLoading = useAppSelector(selectIsLoading);
  const userState = useAppSelector(selectUserState);

  const adjustSize = () => {
    if (containerRef.current) {
      setTitleFontSize(containerRef.current.offsetHeight / 10);
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, [containerRef.current]);

  const onClickConfirm = () => {
    if (!isLoading) {
      if (!isLoading) {
        dispatch(setIsLoading(true));
        dispatch(
          sendTransaction({
            cmd: getBidNuggetTransactionCommandArray(
              userState!.player!.nonce,
              nuggetId,
              Number(amountString)
            ),
            prikey: l2account!.getPrivateKey(),
          })
        ).then((action) => {
          if (sendTransaction.fulfilled.match(action)) {
            console.log("bid nugget successed");
            dispatch(
              getNugget({
                nuggetId,
              })
            ).then((action) => {
              if (getNugget.fulfilled.match(action)) {
                console.log("bid nugget update successed");

                dispatch(getBids(l2account!.getPrivateKey())).then((action) => {
                  if (getBids.fulfilled.match(action)) {
                    console.log("bids update successed");
                    dispatch(setIsLoading(false));
                    dispatch(setUIState({ type: UIStateType.Idle }));
                  } else if (getBids.rejected.match(action)) {
                    const message = "bids update Error: " + action.payload;
                    dispatch(pushError(message));
                    console.error(message);
                    dispatch(setIsLoading(false));
                  }
                });
              } else if (getNugget.rejected.match(action)) {
                const message = "bid nugget update Error: " + action.payload;
                dispatch(pushError(message));
                console.error(message);
                dispatch(setIsLoading(false));
              }
            });
          } else if (sendTransaction.rejected.match(action)) {
            const message = "bid nugget Error: " + action.payload;
            dispatch(pushError(message));
            console.error(message);
            dispatch(setIsLoading(false));
          }
        });
      }
    }
  };

  const onClickCancel = () => {
    if (!isLoading) {
      dispatch(
        setUIState({
          type: UIStateType.MarketNuggetInfoPopup,
          nuggetIndex,
          isShowingBidAmountPopup: false,
        })
      );
    }
  };

  return (
    <div className="bid-amount-popup-container">
      <div onClick={onClickCancel} className="bid-amount-popup-mask" />
      <div ref={containerRef} className="bid-amount-popup-main-container">
        <div className="bid-amount-popup-main-background">
          <HorizontalExtendableImage
            leftRatio={58 / 238}
            rightRatio={58 / 238}
            leftImage={leftBackground}
            midImage={midBackground}
            rightImage={rightBackground}
          />
        </div>
        <div className="bid-amount-popup-close-button">
          <PopupCloseButton onClick={onClickCancel} isDisabled={false} />
        </div>
        <p
          className="bid-amount-popup-title-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          Bid
        </p>
        <div className="bid-amount-popup-amount-input-container">
          <HorizontalExtendableImage
            leftRatio={16 / 53}
            rightRatio={16 / 53}
            leftImage={leftInputBackground}
            midImage={midInputBackground}
            rightImage={rightInputBackground}
          />
          <input
            type="number"
            className="bid-amount-popup-amount-input"
            value={amountString}
            onChange={(e) => setAmountString(e.target.value)}
            placeholder="Enter amount"
            style={{
              fontSize: titleFontSize,
              ...getTextShadowStyle(titleFontSize / 15),
            }}
          />
        </div>

        <div className="bid-amount-popup-confirm-button">
          <DefaultButton
            onClick={onClickConfirm}
            text={"Confirm"}
            isDisabled={false}
          />
        </div>
      </div>
    </div>
  );
};

export default BidAmountPopup;
