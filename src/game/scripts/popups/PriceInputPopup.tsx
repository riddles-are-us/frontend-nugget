import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import "./PriceInputPopup.css";
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

interface Props {
  title: string;
  onClickConfirm: (amount: number) => void;
  onClickCancel: () => void;
  cost?: number;
}

const PriceInputPopup = ({
  title,
  onClickConfirm,
  onClickCancel,
  cost = 0,
}: Props) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [buttonFontSize, setButtonFontSize] = useState<number>(0);
  const [amountString, setAmountString] = useState<string>("");

  const adjustSize = () => {
    if (containerRef.current) {
      setTitleFontSize(containerRef.current.offsetHeight / 10);
      setButtonFontSize(containerRef.current.offsetHeight / 15);
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, [containerRef.current]);

  return (
    <div className="price-input-popup-container">
      <div onClick={onClickCancel} className="price-input-popup-mask" />
      <div ref={containerRef} className="price-input-popup-main-container">
        <div className="price-input-popup-main-background">
          <HorizontalExtendableImage
            leftRatio={58 / 238}
            rightRatio={58 / 238}
            leftImage={leftBackground}
            midImage={midBackground}
            rightImage={rightBackground}
          />
        </div>
        <div className="price-input-popup-close-button">
          <PopupCloseButton onClick={onClickCancel} isDisabled={false} />
        </div>
        <p
          className="price-input-popup-title-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          {title}
        </p>
        <div className="price-input-popup-amount-input-container">
          <HorizontalExtendableImage
            leftRatio={16 / 53}
            rightRatio={16 / 53}
            leftImage={leftInputBackground}
            midImage={midInputBackground}
            rightImage={rightInputBackground}
          />
          <input
            type="number"
            className="price-input-popup-amount-input"
            value={amountString}
            onChange={(e) => setAmountString(e.target.value)}
            placeholder="Enter amount"
            style={{
              fontSize: titleFontSize,
              ...getTextShadowStyle(titleFontSize / 15),
            }}
          />
        </div>

        {cost == 0 ? (
          <div className="price-input-popup-confirm-button">
            <DefaultButton
              onClick={() => onClickConfirm(Number(amountString))}
              text={"Confirm"}
              isDisabled={false}
            />
          </div>
        ) : (
          <div className="price-input-popup-explore-button">
            <DefaultButton
              onClick={() => onClickConfirm(Number(amountString))}
              text={"Confirm                 "}
              isDisabled={false}
            />
            <p
              className="price-input-popup-coin-text"
              style={{
                fontSize: buttonFontSize,
                ...getTextShadowStyle(buttonFontSize / 15),
              }}
            >
              {cost}
            </p>
            <div className="price-input-popup-coin-image" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceInputPopup;
