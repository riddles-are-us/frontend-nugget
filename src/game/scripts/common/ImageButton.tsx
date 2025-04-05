import React, { useState } from "react";
import "./ImageButton.css";
import ElementButton from "./ElementButton";

interface Props {
  isDisabled: boolean;
  defaultImagePath: string;
  hoverImagePath: string;
  clickedImagePath: string;
  disabledImagePath: string;
  onClick: () => void;
}

const ImageButton = ({
  isDisabled,
  defaultImagePath,
  hoverImagePath,
  clickedImagePath,
  disabledImagePath,
  onClick,
}: Props) => {
  return (
    <ElementButton
      isDisabled={isDisabled}
      defaultElement={<img className="image-button" src={defaultImagePath} />}
      hoverElement={<img className="image-button" src={hoverImagePath} />}
      clickedElement={<img className="image-button" src={clickedImagePath} />}
      disabledElement={<img className="image-button" src={disabledImagePath} />}
      onClick={onClick}
    />
  );
};

export default ImageButton;
