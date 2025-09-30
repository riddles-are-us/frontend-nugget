import leftNormalImage from "../../images/buttons/tab_button/left.png";
import midNormalImage from "../../images/buttons/tab_button/mid.png";
import rightNormalImage from "../../images/buttons/tab_button/right.png";
import leftHoverImage from "../../images/buttons/tab_button/left_hv.png";
import midHoverImage from "../../images/buttons/tab_button/mid_hv.png";
import rightHoverImage from "../../images/buttons/tab_button/right_hv.png";
import leftClickImage from "../../images/buttons/tab_button/left_click.png";
import leftClickMobileImage from "../../images/buttons/tab_button/left_click_mobile.png";
import midClickImage from "../../images/buttons/tab_button/mid_click.png";
import midMobileImage from "../../images/buttons/tab_button/mid_mobile.png";
import rightClickImage from "../../images/buttons/tab_button/right_click.png";
import rightClickMobileImage from "../../images/buttons/tab_button/right_click_mobile.png";
import AdjustableImageTextButton from "../common/AdjustableImageTextButton";
import { getTextShadowStyle } from "../common/Utility";
import { useIsMobile } from "../../../app/isMobileContext";

interface Props {
  id?: number;
  text: string;
  onClick: () => void;
  isDisabled: boolean;
}

const TabButton = ({ id = 0, text, onClick, isDisabled }: Props) => {
  const { isMobile } = useIsMobile();
  const leftRatio = 26 / 45;
  const rightRatio = 26 / 45;
  const fontSizeRatio = isMobile ? 1 : 1.2;
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
          fontFamily: "AdobeClean",
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
      key={isDisabled ? 'disabled' : 'enabled'}
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
      leftDisabledImage={isMobile ? leftClickMobileImage : leftClickImage}
      midDisabledImage={isMobile ? midMobileImage : midClickImage}
      rightDisabledImage={isMobile ? rightClickMobileImage : rightClickImage}
      getText={getText}
      isMobile={isMobile}
    />
  );
};

export default TabButton;
