import React from "react";
import "./NuggetLevel.css";
import levelActiveImage from "../../images/scene/gameplay/nugget/level.png";
import levelInactiveImage from "../../images/scene/gameplay/nugget/level_idle.png";

interface Props {
  isActive: boolean;
}

const NuggetLevel = ({ isActive }: Props) => {
  return (
    <img
      className="nugget-level-image"
      src={isActive ? levelActiveImage : levelInactiveImage}
    />
  );
};

export default NuggetLevel;
