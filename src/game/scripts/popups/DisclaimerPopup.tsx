import React, { useEffect, useRef, useState } from "react";
import HorizontalExtendableImage from "../common/HorizontalExtendableImage";
import leftBackground from "../../images/popups/default/left.png";
import midBackground from "../../images/popups/default/mid.png";
import rightBackground from "../../images/popups/default/right.png";
import "./DisclaimerPopup.css";
import { getTextShadowStyle } from "../common/Utility";

const DisclaimerPopup = () => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [descriptionFontSize, setDescriptionFontSize] = useState<number>(0);

  const adjustSize = () => {
    if (containerRef.current) {
      let windowWidth = containerRef.current.offsetWidth / 0.6;
      if (typeof window !== "undefined") {
        windowWidth = window.innerWidth;
      }
      if (windowWidth >= 768) {
        setTitleFontSize(containerRef.current.offsetHeight / 10);
        setDescriptionFontSize(containerRef.current.offsetHeight / 20);
      } else if (windowWidth >= 512) {
        setTitleFontSize(containerRef.current.offsetWidth / 15);
        setDescriptionFontSize(containerRef.current.offsetWidth / 30);
      } else {
        setTitleFontSize(containerRef.current.offsetWidth / 13);
        setDescriptionFontSize(containerRef.current.offsetWidth / 26);
      }
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, [containerRef.current]);

  return (
    <div ref={containerRef} className="disclaimer-popup-container">
      <HorizontalExtendableImage
        leftRatio={58 / 238}
        rightRatio={58 / 238}
        leftImage={leftBackground}
        midImage={midBackground}
        rightImage={rightBackground}
      />
      <p
        className="disclaimer-popup-title-text"
        style={{
          fontSize: titleFontSize,
          ...getTextShadowStyle(titleFontSize / 15),
        }}
      >
        Beta Test
      </p>
      <p
        className="disclaimer-popup-description-text"
        style={{
          fontSize: descriptionFontSize,
        }}
      >
        This crypto game is currently in its beta stage and is still under
        active development.
        <br />
        Gameplay features, tokenomics, mechanics, and visuals are subject to
        change based on ongoing testing, community feedback, and technical
        adjustments.
        <br />
        By participating in the beta, you acknowledge that:
        <br />
        <br />
        - Some content may be incomplete or unstable.
        <br />
        - Your progress or in-game assets may be reset in future updates.
        <br />
        - Feedback provided may be used to shape the final experience.
        <br />
        <br />
        We appreciate your support and look forward to building a better game
        together with the community.
      </p>
    </div>
  );
};

export default DisclaimerPopup;
