import React, { useEffect, useRef, useState } from "react";
import "./Nugget.css";
import image from "../../../images/nuggets/image.png";
import { getAttributeList, getTextShadowStyle } from "../../common/Utility";
import DefaultButton from "../../buttons/DefaultButton";
import NuggetLevel from "./NuggetLevel";
import { NuggetData } from "../../../../data/model";

interface Props {
  nuggetData: NuggetData;
  onClickMore: () => void;
}

const attributeLefts = [
  0.02, 0.058, 0.096, 0.134, 0.17, 0.205, 0.242, 0.28, 0.318, 0.356, 0.394,
  0.43, 0.465, 0.503, 0.54, 0.578, 0.615, 0.652, 0.69, 0.728, 0.765, 0.803,
  0.84, 0.878, 0.914, 0.951,
];

const Nugget = ({ nuggetData, onClickMore }: Props) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [descriptionFontSize, setDescriptionFontSize] = useState<number>(0);
  const [attributesFontSize, setAttributesFontSize] = useState<number>(0);
  const nuggetId = nuggetData.id;
  const nuggetPrice = nuggetData.sysprice;
  const nuggetCycle = nuggetData.cycle;
  const nuggetLevel = nuggetData.feature;
  const nuggetBid = nuggetData.bid?.bidprice ?? 0;
  const nuggetAttributeString = getAttributeList(
    nuggetData.attributes,
    nuggetData.feature
  );

  const adjustSize = () => {
    if (containerRef.current) {
      setTitleFontSize(containerRef.current.offsetHeight / 8);
      setDescriptionFontSize(containerRef.current.offsetHeight / 11);
      setAttributesFontSize(containerRef.current.offsetHeight / 10);
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
          {`Bid Price: ${nuggetBid}`}
        </p>
        <div>
          {nuggetAttributeString.slice(0, 26).map((s, index) => (
            <p
              className="nugget-attributes-text"
              key={index}
              style={{
                left: `${attributeLefts[index] * 100}%`,
                fontSize: attributesFontSize,
                ...getTextShadowStyle(attributesFontSize / 15),
              }}
            >
              {s}
            </p>
          ))}
        </div>
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
