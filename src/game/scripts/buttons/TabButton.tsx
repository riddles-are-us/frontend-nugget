import leftNormalImage from "../../images/buttons/tab_button/left.png";
import midNormalImage from "../../images/buttons/tab_button/mid.png";
import rightNormalImage from "../../images/buttons/tab_button/right.png";
import leftHoverImage from "../../images/buttons/tab_button/left_hv.png";
import midHoverImage from "../../images/buttons/tab_button/mid_hv.png";
import rightHoverImage from "../../images/buttons/tab_button/right_hv.png";
import leftClickImage from "../../images/buttons/tab_button/left_click.png";
import midClickImage from "../../images/buttons/tab_button/mid_click.png";
import rightClickImage from "../../images/buttons/tab_button/right_click.png";
import AdjustableImageTextButton from "../common/AdjustableImageTextButton";
import { getTextShadowStyle } from "../common/Utility";
import { useViewport } from "../../../app/hooks";
import "./ResponsiveTabButton.css";

interface Props {
  id?: number;
  text: string;
  onClick: () => void;
  isDisabled: boolean;
}

const TabButton = ({ id = 0, text, onClick, isDisabled }: Props) => {
  const viewport = useViewport();
  const leftRatio = 26 / 45;
  const rightRatio = 26 / 45;
  const fontSizeRatio = 1.2;
  const fontFamily = "AdobeClean";
  const isBold = true;
  const color = "white";

  // Mobile CSS button implementation
  if (viewport.isMobile) {
    return (
      <button
        className={`responsive-tab-button tab-button ${isDisabled ? 'disabled' : ''}`}
        onClick={isDisabled ? undefined : onClick}
        disabled={isDisabled}
        data-tab={text}
      >
        <span className="tab-button-text">{text}</span>
      </button>
    );
  }

  // Desktop image-based button (original implementation)
  const getText = (fontBaseSize: number) => {
    const fontSize = fontBaseSize * fontSizeRatio;
    return (
      <p
        className="adjustable-image-text-button-text"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "90%",
          height: "auto",
          transform: "translate(-50%, -50%)",
          margin: "0px",
          pointerEvents: "none",
          userSelect: "none",
          lineHeight: 1,
          color: color,
          fontFamily: fontFamily,
          fontSize: `${fontSize}px`,
          whiteSpace: "pre",
          ...(isBold ? { fontWeight: "bold" } : {}),
          ...getTextShadowStyle(fontSize / 15),
        }}
      >
        {text}
      </p>
    );
  };

  return (
    <AdjustableImageTextButton
      id={id}
      onClick={onClick}
      isDisabled={isDisabled}
      leftRatio={leftRatio}
      rightRatio={rightRatio}
      leftNormalImage={leftNormalImage}
      midNormalImage={midNormalImage}
      rightNormalImage={rightNormalImage}
      leftHoverImage={leftHoverImage}
      midHoverImage={midHoverImage}
      rightHoverImage={rightHoverImage}
      leftClickImage={leftClickImage}
      midClickImage={midClickImage}
      rightClickImage={rightClickImage}
      leftDisabledImage={leftClickImage}
      midDisabledImage={midClickImage}
      rightDisabledImage={rightClickImage}
      getText={getText}
    />
  );
};

export default TabButton;
