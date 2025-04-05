import React, { useRef, useEffect, useState } from "react";
import "./AdjustableImageTextButton.css";
import ElementButton from "./ElementButton";

interface Props {
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
  fonrSizeRatio: number;
}

const AdjustableImageTextButton = ({
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
  fonrSizeRatio,
}: Props) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(0);

  const adjustSize = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
      setContainerHeight(containerRef.current.offsetHeight);
      setFontSize((containerRef.current.offsetHeight * fonrSizeRatio) / 2);
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, [text]);

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
    const eps = 0.05;
    const leftHeight = containerHeight;
    const leftWidth = leftHeight * leftRatio;
    const rightHeight = containerHeight;
    const rightWidth = rightHeight * rightRatio;
    const middleHeight = containerHeight;
    const middleWidth = containerWidth - (leftWidth + rightWidth) * (1 - eps);
    const middleLeft = leftWidth * (1 - eps);

    return (
      <>
        <img
          src={midImage}
          className="adjustable-image-text-button-element-container"
          style={{ width: middleWidth, height: middleHeight, left: middleLeft }}
        />
        <img
          src={leftImage}
          className="adjustable-image-text-button-element-container"
          style={{ width: leftWidth, height: leftHeight, left: 0 }}
        />
        <img
          src={rightImage}
          className="adjustable-image-text-button-element-container"
          style={{ width: rightWidth, height: rightHeight, right: 0 }}
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
