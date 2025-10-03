import React from "react";
import { getTextShadowStyle } from "../../common/Utility";
import "./PlayerTreasureInfoMobile.css";

import leftInputBackground from "../../../images/popups/default/left_input.png";
import midInputBackground from "../../../images/popups/default/mid_input.png";
import rightInputBackground from "../../../images/popups/default/right_input.png";
import HorizontalExtendableImage from "../../common/HorizontalExtendableImage";

interface Props {
  title: string;
  value: number;
  icon: string;
  fontSize: number;
}

const PlayerTreasureInfoMobile = ({ title, value, icon, fontSize }: Props) => {
  return (
    <div className="player-treasure-info-mobile-container">
      <div className="player-treasure-info-mobile-input-container">
        <HorizontalExtendableImage
          leftRatio={16 / 53}
          rightRatio={16 / 53}
          leftImage={leftInputBackground}
          midImage={midInputBackground}
          rightImage={rightInputBackground}
        />
      </div>
      <p
        className="player-treasure-info-mobile-title-text"
        style={{
          fontSize: fontSize,
          ...getTextShadowStyle(fontSize / 15),
        }}
      >
        {title}
      </p>
      <p
        className="player-treasure-info-mobile-value-text"
        style={{
          fontSize: fontSize,
          ...getTextShadowStyle(fontSize / 15),
        }}
      >
        {value}
      </p>
      <img className="player-treasure-info-mobile-icon" src={icon} />
    </div>
  );
};

export default PlayerTreasureInfoMobile;
