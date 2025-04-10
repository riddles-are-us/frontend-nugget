import React, { useEffect, useRef, useState } from "react";
import "./Nugget.css";
import image from "../../../images/nuggets/image.png";
import { getTextShadowStyle } from "../../common/Utility";
import DefaultButton from "../../buttons/DefaultButton";
import NuggetLevel from "./NuggetLevel";
import { NuggetData } from "../../../../data/model";

interface Props {
  nuggetData: NuggetData;
  onClickMore: () => void;
}

const Nugget = ({ nuggetData, onClickMore }: Props) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [descriptionFontSize, setDescriptionFontSize] = useState<number>(0);
  const nuggetId = nuggetData.id;
  const nuggetPrice = nuggetData.sysprice;
  const nuggetCycle = nuggetData.cycle;
  const nuggetLevel = nuggetData.feature;
  const nuggetBid = nuggetData.bid?.bidprice ?? 0;

  const adjustSize = () => {
    if (containerRef.current) {
      setTitleFontSize(containerRef.current.offsetHeight / 8);
      setDescriptionFontSize(containerRef.current.offsetHeight / 11);
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
    <div ref={containerRef} className="nugget-container">
      <img className="nugget-avatar-image" src={image} />
      <div className="nugget-margin-container">
        <p
          className="nugget-title-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          {`NuggetId: ${nuggetId}`}
        </p>
        <p
          className="nugget-price-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Recycle Price: ${nuggetPrice}`}
        </p>
        <p
          className="nugget-cycle-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Cycle: ${nuggetCycle}`}
        </p>
        <p
          className="nugget-bid-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Bid: ${nuggetBid}`}
        </p>
        <div className="nugget-more-button">
          <DefaultButton
            text={"More"}
            onClick={onClickMore}
            isDisabled={false}
            fontSizeRatio={1.2}
          />
        </div>
        <div className="nugget-levels-container">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className={`nugget-level-container`}>
              <NuggetLevel key={index} isActive={index < nuggetLevel} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Nugget;
