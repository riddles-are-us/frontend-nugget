import React, { useRef, useEffect, useState } from "react";
import "./AdjustableImageTextButton.css";
import ElementButton from "./ElementButton";
import HorizontalExtendableImage from "./HorizontalExtendableImage";

interface Props {
  id?: number;
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
  getText: (fontBaseSize: number) => JSX.Element;
}

const AdjustableImageTextButton = ({
  id = 0,
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
  getText,
}: Props) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [baseFontSize, setBaseFontSize] = useState<number>(0);

  const adjustSize = () => {
    if (containerRef.current) {
      setBaseFontSize(containerRef.current.offsetHeight / 2);
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, [containerRef.current, id]);

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
        {getText(baseFontSize)}
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
