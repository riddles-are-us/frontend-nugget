import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./DepositPopup.css";
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

const DepositPopup = () => {
  const dispatch = useAppDispatch();
  const uIState = useAppSelector(selectUIState);
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [amountString, setAmountString] = useState<string>("");
  const l2account = useAppSelector(AccountSlice.selectL2Account);
  const l1account = useAppSelector(AccountSlice.selectL1Account);
  const isLoading = useAppSelector(selectIsLoading);

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
      dispatch(setIsLoading(true));
      dispatch(
        AccountSlice.depositAsync({
          tokenIndex: 0,
          amount: Number(BigInt(amountString)),
          l2account: l2account!,
          l1account: l1account!,
        })
      ).then((action) => {
        if (AccountSlice.depositAsync.fulfilled.match(action)) {
          dispatch(setIsLoading(false));
          console.log("Deposit Success: " + action.payload!.hash);
          dispatch(setUIState({ type: UIStateType.Idle }));
        } else if (AccountSlice.depositAsync.rejected.match(action)) {
          if (action.error.message == null) {
            const message = "Deposit Failed: Unknown Error";
            dispatch(pushError(message));
            console.error(message);
          } else if (action.error.message.startsWith("user rejected action")) {
            const message = "Deposit Failed: User rejected action";
            dispatch(pushError(message));
            console.error(message);
          } else {
            const message = "Deposit Failed: " + action.error.message;
            dispatch(pushError(message));
            console.error(message);
          }
          dispatch(setIsLoading(false));
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
    <div className="deposit-popup-container">
      <div onClick={onClickCancel} className="deposit-popup-mask" />
      <div ref={containerRef} className="deposit-popup-main-container">
        <div className="deposit-popup-main-background">
          <HorizontalExtendableImage
            leftRatio={58 / 238}
            rightRatio={58 / 238}
            leftImage={leftBackground}
            midImage={midBackground}
            rightImage={rightBackground}
          />
        </div>
        <div className="deposit-popup-close-button">
          <PopupCloseButton onClick={onClickCancel} isDisabled={false} />
        </div>
        <p
          className="deposit-popup-title-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          Deposit
        </p>
        <div className="deposit-popup-amount-input-container">
          <HorizontalExtendableImage
            leftRatio={16 / 53}
            rightRatio={16 / 53}
            leftImage={leftInputBackground}
            midImage={midInputBackground}
            rightImage={rightInputBackground}
          />
          <input
            type="number"
            className="deposit-popup-amount-input"
            value={amountString}
            onChange={(e) => setAmountString(e.target.value)}
            placeholder="Enter amount"
            style={{
              fontSize: titleFontSize,
              ...getTextShadowStyle(titleFontSize / 15),
            }}
          />
        </div>

        <div className="deposit-popup-confirm-button">
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

export default DepositPopup;
