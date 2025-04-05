import React, { useEffect, useRef, useState } from "react";
import "./TextButton.css";
import ElementButton from "./ElementButton";

interface Props {
  isDisabled: boolean;
  text: string;
  fontRatio: number;
  textAlign?: "left" | "center";
  defaultTextColor?: string;
  hoverTextColor?: string;
  clickedTextColor?: string;
  disabledTextColor?: string;
  onClick: () => void;
}

const TextButton = ({
  isDisabled,
  text,
  fontRatio,
  textAlign = "center",
  defaultTextColor = "#e6e6e6",
  hoverTextColor = "#ffffff",
  clickedTextColor = "#e6e6e6",
  disabledTextColor = "#808080",
  onClick,
}: Props) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [fontSize, setFontSize] = useState<number>(0);

  const adjustSize = () => {
    if (textRef.current) {
      const parentWidth = textRef.current.offsetWidth;
      setFontSize(parentWidth / fontRatio);
    }
  };

  useEffect(() => {
    adjustSize();
    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, []);

  const getElement = (color: string) => {
    return (
      <p
        ref={textRef}
        className="text-button"
        style={{
          textAlign: textAlign,
          fontSize: fontSize,
          color: defaultTextColor,
        }}
      >
        {text}
      </p>
    );
  };

  return (
    <ElementButton
      isDisabled={isDisabled}
      defaultElement={getElement(defaultTextColor)}
      hoverElement={getElement(hoverTextColor)}
      clickedElement={getElement(clickedTextColor)}
      disabledElement={getElement(disabledTextColor)}
      onClick={onClick}
    />
  );
};

export default TextButton;
