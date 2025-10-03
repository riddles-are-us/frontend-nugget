import { useEffect, useRef, useState } from "react";
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
import { useIsMobile } from "../../../app/isMobileContext";

interface Props {
  title: string;
  description: string;
  min?: number | null;
  max?: number | null;
  onConfirm: (amount: number) => void;
  onCancel: () => void;
  cost?: number;
}

const PriceInputPopup = ({
  title,
  description,
  min,
  max,
  onConfirm,
  onCancel,
  cost = 0,
}: Props) => {
  const { isMobile } = useIsMobile();
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [buttonFontSize, setButtonFontSize] = useState<number>(0);
  const [amountString, setAmountString] = useState<string>("");
  const [hasError, setHasError] = useState<boolean>(false); // State to track error

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

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value === "") {
      setAmountString("");
      return;
    }

    if (/^0\d+/.test(value)) {
      value = String(Number(value));
    }

    const num = Number(value);
    if (Number.isInteger(num) && num >= 0 && (max == null || num <= max)) {
      setAmountString(value);
    }
  };

  const onClickConfirm = () => {
    const amount = Number(amountString);
    console.log("Amount:", amount, "Min:", min, "Max:", max);
    if (
      amount &&
      (min == null || amount >= min) &&
      (max == null || amount <= max)
    ) {
      onConfirm(amount);
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className="price-input-popup-container">
      <div
        onClick={isMobile ? undefined : onCancel}
        className="price-input-popup-mask"
      />
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
          <PopupCloseButton onClick={onCancel} isDisabled={false} />
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
        <p
          className={
            hasError
              ? "price-input-popup-description-text-has-error"
              : "price-input-popup-description-text"
          }
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          {description}
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
            value={amountString}
            onKeyDown={(e) => {
              if (["e", "E", "-", "+", "."].includes(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={onInputChange}
            className="price-input-popup-amount-input"
            style={{
              fontSize: titleFontSize,
              ...getTextShadowStyle(titleFontSize / 15),
            }}
          />
        </div>

        {cost == 0 ? (
          <div className="price-input-popup-confirm-button">
            <DefaultButton
              onClick={onClickConfirm}
              text={"Confirm"}
              isDisabled={false}
            />
          </div>
        ) : (
          <div className="price-input-popup-explore-button">
            <DefaultButton
              onClick={onClickConfirm}
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
