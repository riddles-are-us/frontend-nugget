import normalImage from "../../images/buttons/pop_close_button/x.png";
import hoverImage from "../../images/buttons/pop_close_button/left_hover.png";
import clickImage from "../../images/buttons/pop_close_button/left_click.png";
import ImageButton from "../common/ImageButton";

interface Props {
  onClick: () => void;
  isDisabled: boolean;
}

const PopCloseButton = ({ onClick, isDisabled }: Props) => {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "auto",
        height: "auto",
        aspectRatio: "1 / 1",
        transform: "translate(-50%, -50%)",
        margin: "0px",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <ImageButton
        onClick={onClick}
        isDisabled={isDisabled}
        defaultImagePath={normalImage}
        hoverImagePath={hoverImage}
        clickedImagePath={clickImage}
        disabledImagePath={clickImage}
      />
    </div>
  );
};

export default PopCloseButton;
