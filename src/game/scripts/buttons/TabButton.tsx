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

interface Props {
  id?: number;
  text: string;
  onClick: () => void;
  isDisabled: boolean;
}

const TabButton = ({ id = 0, text, onClick, isDisabled }: Props) => {
  const leftRatio = 26 / 45;
  const rightRatio = 26 / 45;
  const fontSizeRatio = 1.2;
  return (
    <AdjustableImageTextButton
      id={id}
      text={text}
      onClick={onClick}
      isDisabled={isDisabled}
      leftRatio={leftRatio}
      rightRatio={rightRatio}
      fontSizeRatio={fontSizeRatio}
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

export default TabButton;
