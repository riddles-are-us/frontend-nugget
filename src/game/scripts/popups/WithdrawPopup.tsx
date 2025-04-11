import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./WithdrawPopup.css";
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

const WithdrawPopup = () => {
  const dispatch = useAppDispatch();
  const uIState = useAppSelector(selectUIState);
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [amountString, setAmountString] = useState<string>("");

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
    /* */
  };

  const onClickCancel = () => {
    if (uIState.type == UIStateType.WithdrawPopup) {
      dispatch(setUIState({ type: UIStateType.Idle }));
    }
  };

  return (
    <div className="withdraw-popup-container">
      <div onClick={onClickCancel} className="withdraw-popup-mask" />
      <div ref={containerRef} className="withdraw-popup-main-container">
        <div className="withdraw-popup-main-background">
          <HorizontalExtendableImage
            leftRatio={58 / 238}
            rightRatio={58 / 238}
            leftImage={leftBackground}
            midImage={midBackground}
            rightImage={rightBackground}
          />
        </div>
        <div className="withdraw-popup-close-button">
          <PopupCloseButton onClick={onClickCancel} isDisabled={false} />
        </div>
        <p
          className="withdraw-popup-title-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          Withdraw
        </p>
        <div className="withdraw-popup-amount-input-container">
          <HorizontalExtendableImage
            leftRatio={16 / 53}
            rightRatio={16 / 53}
            leftImage={leftInputBackground}
            midImage={midInputBackground}
            rightImage={rightInputBackground}
          />
          <input
            type="number"
            className="withdraw-popup-amount-input"
            value={amountString}
            onChange={(e) => setAmountString(e.target.value)}
            placeholder="Enter amount"
            style={{
              fontSize: titleFontSize,
              ...getTextShadowStyle(titleFontSize / 15),
            }}
          />
        </div>

        <div className="withdraw-popup-confirm-button">
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

export default WithdrawPopup;
