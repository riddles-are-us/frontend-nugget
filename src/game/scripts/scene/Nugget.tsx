import React from "react";
import "./Nugget.css";
import image from "../../images/nuggets/image.png";

const Nugget = () => {
  return (
    <div className="nugget-container">
      <img className="nugget-avatar-image" src={image} />
      <div className="nugget-margin-container"></div>
    </div>
  );
};

export default Nugget;
