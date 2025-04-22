import leftNormalImage from "../../images/buttons/default_button/left.png";
import midNormalImage from "../../images/buttons/default_button/mid.png";
import rightNormalImage from "../../images/buttons/default_button/right.png";
import leftHoverImage from "../../images/buttons/default_button/left_hv.png";
import midHoverImage from "../../images/buttons/default_button/mid_hv.png";
import rightHoverImage from "../../images/buttons/default_button/right_hv.png";
import leftClickImage from "../../images/buttons/default_button/left_click.png";
import midClickImage from "../../images/buttons/default_button/mid_click.png";
import rightClickImage from "../../images/buttons/default_button/right_click.png";
import AdjustableImageTextButton from "../common/AdjustableImageTextButton";
import { getTextShadowStyle } from "../common/Utility";

interface Props {
  id?: number;
  text: string;
  onClick: () => void;
  isDisabled: boolean;
  fontSizeRatio?: number;
}

const DefaultButton = ({
  id = 0,
  text,
  onClick,
  isDisabled,
  fontSizeRatio = 0.8,
}: Props) => {
  const leftRatio = 17 / 42;
  const rightRatio = 16 / 42;
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

export default DefaultButton;
