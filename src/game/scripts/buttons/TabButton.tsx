import leftNormalImage from "../../images/buttons/tab_button/left.png";
import midNormalImage from "../../images/buttons/tab_button/mid.png";
import rightNormalImage from "../../images/buttons/tab_button/right.png";
import leftHoverImage from "../../images/buttons/tab_button/left_hv.png";
import midHoverImage from "../../images/buttons/tab_button/mid_hv.png";
import rightHoverImage from "../../images/buttons/tab_button/right_hv.png";
import leftClickImage from "../../images/buttons/tab_button/left_click.png";
import leftClickMobileImage from "../../images/buttons/tab_button/left_click_mobile.png";
import midClickImage from "../../images/buttons/tab_button/mid_click.png";
import rightClickImage from "../../images/buttons/tab_button/right_click.png";
import rightClickMobileImage from "../../images/buttons/tab_button/right_click_mobile.png";
import AdjustableImageTextButton from "../common/AdjustableImageTextButton";
import { getTextShadowStyle } from "../common/Utility";

interface Props {
  id?: number;
  text: string;
  onClick: () => void;
  isDisabled: boolean;
  isMobile: boolean;
}

const TabButton = ({ id = 0, text, onClick, isDisabled, isMobile = false }: Props) => {
  const leftRatio = 26 / 45;
  const rightRatio = 26 / 45;
  const fontSizeRatio = isMobile ? 1 : 1.2;
  const fontFamily = "AdobeClean";
  const isBold = true;
  const color = "white";

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
      leftHoverImage={isMobile ? leftClickMobileImage : leftHoverImage}
      midHoverImage={midHoverImage}
      rightHoverImage={isMobile ? rightClickMobileImage : rightHoverImage}
      leftClickImage={isMobile ? leftClickMobileImage : leftClickImage}
      midClickImage={midClickImage}
      rightClickImage={isMobile ? rightClickMobileImage : rightClickImage}
      leftDisabledImage={leftClickImage}
      midDisabledImage={midClickImage}
      rightDisabledImage={rightClickImage}
      getText={getText}
      isMobile={isMobile}
    />
  );
};

export default TabButton;
