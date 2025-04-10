import React from "react";
import ImageButton from "../common/ImageButton";
import buttonImage from "../../images/buttons/template_image/withdraw_button.png";
import buttonHoverImage from "../../images/buttons/template_image/withdraw_button_hv.png";
import buttonClickImage from "../../images/buttons/template_image/withdraw_button_click.png";

interface Props {
  onClick: () => void;
}

const TemplateImageButton = ({ onClick }: Props) => {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "auto",
        height: "100%",
        aspectRatio: "1 / 1",
        transform: "translate(-50%, -50%)",
        margin: "0px",
      }}
    >
      <ImageButton
        isDisabled={false}
        defaultImagePath={buttonImage}
        hoverImagePath={buttonHoverImage}
        clickedImagePath={buttonClickImage}
        disabledImagePath={buttonClickImage}
        onClick={onClick}
      />
    </div>
  );
};

export default TemplateImageButton;
