import normalImage from "../../images/buttons/rank/rank.png";
// import hoverImage from "../../images/buttons/rank/rank_hv.png";
// import clickImage from "../../images/buttons/rank/rank_click.png";
import ImageButton from "../common/ImageButton";

interface Props {
  onClick: () => void;
  isDisabled: boolean;
}

const RankButton = ({ onClick, isDisabled }: Props) => {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "auto",
        height: "100%",
        aspectRatio: "24 / 23",
        transform: "translate(-50%, -50%)",
        margin: "0px",
      }}
    >
      <ImageButton
        onClick={onClick}
        isDisabled={isDisabled}
        defaultImagePath={normalImage}
        hoverImagePath={normalImage}
        clickedImagePath={normalImage}
        disabledImagePath={normalImage}
      />
    </div>
  );
};

export default RankButton;
