import React, { useRef, useEffect, useState } from "react";
import "./AdjustableImageTextButton.css";
import ElementButton from "./ElementButton";
import HorizontalExtendableImage from "./HorizontalExtendableImage";

interface Props {
  id?: number;
  text: string;
  onClick: () => void;
  isDisabled: boolean;
  leftRatio: number;
  rightRatio: number;
  leftNormalImage: string;
  midNormalImage: string;
  rightNormalImage: string;
  leftHoverImage: string;
  midHoverImage: string;
  rightHoverImage: string;
  leftClickImage: string;
  midClickImage: string;
  rightClickImage: string;
  leftDisabledImage: string;
  midDisabledImage: string;
  rightDisabledImage: string;
  fontSizeRatio?: number;
}

const AdjustableImageTextButton = ({
  id = 0,
  text,
  onClick,
  isDisabled,
  leftRatio,
  rightRatio,
  leftNormalImage,
  midNormalImage,
  rightNormalImage,
  leftHoverImage,
  midHoverImage,
  rightHoverImage,
  leftClickImage,
  midClickImage,
  rightClickImage,
  leftDisabledImage,
  midDisabledImage,
  rightDisabledImage,
  fontSizeRatio = 1,
}: Props) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState<number>(0);

  const adjustSize = () => {
    if (containerRef.current) {
      setFontSize((containerRef.current.offsetHeight * fontSizeRatio) / 2);
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, [id]);

  const getText = () => {
    return (
      <p
        className="adjustable-image-text-button-text"
        style={{
          fontSize: `${fontSize}px`,
        }}
      >
        {text}
      </p>
    );
  };

  const getElement = (
    leftImage: string,
    midImage: string,
    rightImage: string
  ) => {
    return (
      <>
        <HorizontalExtendableImage
          id={id}
          leftRatio={leftRatio}
          rightRatio={rightRatio}
          leftImage={leftImage}
          midImage={midImage}
          rightImage={rightImage}
        />
        {getText()}
      </>
    );
  };

  return (
    <div ref={containerRef} className="adjustable-image-text-button-container">
      <ElementButton
        isDisabled={isDisabled}
        defaultElement={getElement(
          leftNormalImage,
          midNormalImage,
          rightNormalImage
        )}
        hoverElement={getElement(
          leftHoverImage,
          midHoverImage,
          rightHoverImage
        )}
        clickedElement={getElement(
          leftClickImage,
          midClickImage,
          rightClickImage
        )}
        disabledElement={getElement(
          leftDisabledImage,
          midDisabledImage,
          rightDisabledImage
        )}
        onClick={onClick}
      />
    </div>
  );
};

export default AdjustableImageTextButton;
