import React, { useEffect, useState } from "react";
import "./ElementButton.css";

interface Props {
  isDisabled: boolean;
  defaultElement: JSX.Element;
  hoverElement: JSX.Element;
  clickedElement: JSX.Element;
  disabledElement: JSX.Element;
  onClick: () => void;
}

const ElementButton = ({
  isDisabled,
  defaultElement,
  hoverElement,
  clickedElement,
  disabledElement,
  onClick,
}: Props) => {
    const [isClicked, setIsClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = () => { if (!isDisabled) setIsClicked(true); };
  const handleMouseUp   = () => { if (!isDisabled) setIsClicked(false); };

  const handleClick     = () => { if (!isDisabled) onClick(); };

  const handleTouchStart = () => { if (!isDisabled) setIsClicked(true); };
  const handleTouchEnd   = () => { 
    if (!isDisabled) {
      setIsClicked(false);
      onClick();
    }
  };

  useEffect(() => {
    if (isDisabled) {
      setIsClicked(false);
      setIsHovered(false);
    }
  }, [isDisabled]);

  return (
    <button
      className={isDisabled ? "element-button-disabled" : "element-button"}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => { if (!isDisabled) { setIsClicked(false); setIsHovered(false); } }}
      onMouseEnter={() => { if (!isDisabled) setIsHovered(true); }}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      disabled={isDisabled}
    >
      {isDisabled ? disabledElement
        : isClicked ? clickedElement
        : isHovered ? hoverElement
        : defaultElement}
    </button>
  );
};

export default ElementButton;
