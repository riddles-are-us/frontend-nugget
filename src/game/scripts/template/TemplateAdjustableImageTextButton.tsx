import leftNormalImage from "../../images/buttons/template_adjustable_image_text/left.png";
import midNormalImage from "../../images/buttons/template_adjustable_image_text/mid.png";
import rightNormalImage from "../../images/buttons/template_adjustable_image_text/right.png";
import leftHoverImage from "../../images/buttons/template_adjustable_image_text/left_hv.png";
import midHoverImage from "../../images/buttons/template_adjustable_image_text/mid_hv.png";
import rightHoverImage from "../../images/buttons/template_adjustable_image_text/right_hv.png";
import leftClickImage from "../../images/buttons/template_adjustable_image_text/left_click.png";
import midClickImage from "../../images/buttons/template_adjustable_image_text/mid_click.png";
import rightClickImage from "../../images/buttons/template_adjustable_image_text/right_click.png";
import AdjustableImageTextButton from "../common/AdjustableImageTextButton";

interface Props {
  text: string;
  onClick: () => void;
  isDisabled: boolean;
}

const template_adjustable_image_textAdjustableImageTextButton = ({
  text,
  onClick,
  isDisabled,
}: Props) => {
  const leftRatio = 17 / 42;
  const rightRatio = 16 / 42;
  const fontSizeRatio = 1;
  return (
    <AdjustableImageTextButton
      text={text}
      onClick={onClick}
      isDisabled={isDisabled}
      leftRatio={leftRatio}
      rightRatio={rightRatio}
      fonrSizeRatio={fontSizeRatio}
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
    />
  );
};

export default template_adjustable_image_textAdjustableImageTextButton;
