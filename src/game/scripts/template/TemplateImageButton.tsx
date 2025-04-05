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
    <div style={{ width: 80, height: 30 }}>
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
