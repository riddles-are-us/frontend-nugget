import normalImage from "../../images/buttons/earning_rank_button/earning_rank.png";
import hoverImage from "../../images/buttons/earning_rank_button/earning_rank_hv.png";
import clickImage from "../../images/buttons/earning_rank_button/earning_rank_click.png";
import ImageButton from "../common/ImageButton";

interface Props {
  onClick: () => void;
  isDisabled: boolean;
}

const EarningRankButton = ({ onClick, isDisabled }: Props) => {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "auto",
        height: "100%",
        aspectRatio: "61 / 30",
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

export default EarningRankButton;
