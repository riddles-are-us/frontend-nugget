import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./ConfirmPopup.css";
import HorizontalExtendableImage from "../common/HorizontalExtendableImage";
import leftBackground from "../../images/popups/default/left.png";
import midBackground from "../../images/popups/default/mid.png";
import rightBackground from "../../images/popups/default/right.png";
import PopupCloseButton from "../buttons/PopupCloseButton";
import { getTextShadowStyle } from "../common/Utility";
import { setUIState, UIStateType } from "../../../data/ui";

interface Props {
  title: string;
  description: string;
}

const ConfirmPopup = ({ title, description }: Props) => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [descriptionFontSize, setDescriptionFontSize] = useState<number>(0);

  const adjustSize = () => {
    if (containerRef.current) {
      setTitleFontSize(containerRef.current.offsetHeight / 10);
      setDescriptionFontSize(containerRef.current.offsetHeight / 15);
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
    dispatch(setUIState({ type: UIStateType.Idle }));
  };

  return (
    <div className="confirm-popup-container">
      <div onClick={onClickCancel} className="confirm-popup-mask" />
      <div ref={containerRef} className="confirm-popup-main-container">
        <div className="confirm-popup-main-background">
          <HorizontalExtendableImage
            leftRatio={58 / 238}
            rightRatio={58 / 238}
            leftImage={leftBackground}
            midImage={midBackground}
            rightImage={rightBackground}
          />
        </div>
        <div className="confirm-popup-close-button">
          <PopupCloseButton onClick={onClickCancel} isDisabled={false} />
        </div>
        <p
          className="confirm-popup-title-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          {title}
        </p>
        <p
          className="confirm-popup-description-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(titleFontSize / 30),
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default ConfirmPopup;
