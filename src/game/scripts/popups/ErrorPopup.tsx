import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { useIsMobile } from "../../../app/isMobileContext";
import "./ErrorPopup.css";
import HorizontalExtendableImage from "../common/HorizontalExtendableImage";
import leftBackground from "../../images/popups/default/left.png";
import midBackground from "../../images/popups/default/mid.png";
import rightBackground from "../../images/popups/default/right.png";
import PopupCloseButton from "../buttons/PopupCloseButton";
import { getTextShadowStyle } from "../common/Utility";
import { popError } from "../../../data/error";

interface Props {
  message: string;
}

const ErrorPopup = ({ message }: Props) => {
  const { isMobile } = useIsMobile();
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
    dispatch(popError());
  };

  return (
    <div className="error-popup-container">
      <div
        onClick={isMobile ? undefined : onClickCancel}
        className="error-popup-mask"
      />
      <div ref={containerRef} className="error-popup-main-container">
        <div className="error-popup-main-background">
          <HorizontalExtendableImage
            leftRatio={58 / 238}
            rightRatio={58 / 238}
            leftImage={leftBackground}
            midImage={midBackground}
            rightImage={rightBackground}
          />
        </div>
        <div className="error-popup-close-button">
          <PopupCloseButton onClick={onClickCancel} isDisabled={false} />
        </div>
        <p
          className="error-popup-title-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          Error
        </p>
        <p
          className="error-popup-description-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(titleFontSize / 30),
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default ErrorPopup;
