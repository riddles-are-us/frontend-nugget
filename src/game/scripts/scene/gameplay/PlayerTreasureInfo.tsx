import React from "react";
import { getTextShadowStyle } from "../../common/Utility";
import "./PlayerTreasureInfo.css";

interface Props {
  title: string;
  value: number;
  icon: string;
  fontSize: number;
}

const PlayerTreasureInfo = ({ title, value, icon, fontSize }: Props) => {
  return (
    <div className="player-treasure-info-container">
      <div className="player-treasure-value-background" />
      <p
        className="player-treasure-info-title-text"
        style={{
          fontSize: fontSize,
          ...getTextShadowStyle(fontSize / 15),
        }}
      >
        {title}
      </p>
      <p
        className="player-treasure-info-value-text"
        style={{
          fontSize: fontSize,
          ...getTextShadowStyle(fontSize / 15),
        }}
      >
        {value}
      </p>
      <img className="player-treasure-info-icon" src={icon} />
    </div>
  );
};

export default PlayerTreasureInfo;
