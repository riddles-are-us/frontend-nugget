import normalImage from "../../images/buttons/next_page_button/next.png";
import hoverImage from "../../images/buttons/next_page_button/next_hv.png";
import clickImage from "../../images/buttons/next_page_button/next_click.png";
import ImageButton from "../common/ImageButton";

interface Props {
  onClick: () => void;
  isDisabled: boolean;
}

const NextPageButton = ({ onClick, isDisabled }: Props) => {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "auto",
        height: "100%",
        aspectRatio: "29 / 39",
        transform: "translate(-50%, -50%)",
        margin: "0px",
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

export default NextPageButton;
