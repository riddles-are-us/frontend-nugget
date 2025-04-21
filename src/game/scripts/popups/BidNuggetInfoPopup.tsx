import { useState, useRef, useEffect } from "react";
import background from "../../images/popups/pop_frame.png";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./BidNuggetInfoPopup.css";
import { selectUIState, setUIState, UIStateType } from "../../../data/ui";
import { getAttributeList, getTextShadowStyle } from "../common/Utility";
import NuggetLevel from "../scene/gameplay/NuggetLevel";
import image from "../../images/nuggets/image.png";
import PopupCloseButton from "../buttons/PopupCloseButton";
import { selectBidNuggetData } from "../../../data/nuggets";

interface Props {
  nuggetIndex: number;
}

const attributeLefts = [
  0.008, 0.045, 0.083, 0.123, 0.16, 0.197, 0.236, 0.274, 0.313, 0.351, 0.39,
  0.428, 0.467, 0.505, 0.543, 0.582, 0.619, 0.658, 0.695, 0.733, 0.769, 0.808,
  0.845, 0.883, 0.92, 0.957,
];

const BidNuggetInfoPopup = ({ nuggetIndex }: Props) => {
  const dispatch = useAppDispatch();
  const nuggetData = useAppSelector(selectBidNuggetData(nuggetIndex));
  const containerRef = useRef<HTMLParagraphElement>(null);
  const uIState = useAppSelector(selectUIState);
  const [titleFontSize, setTitleFontSize] = useState<number>(0);
  const [descriptionFontSize, setDescriptionFontSize] = useState<number>(0);
  const [attributesFontSize, setAttributesFontSize] = useState<number>(0);
  const nuggetId = nuggetData.id;
  const nuggetPrice = nuggetData.sysprice;
  const nuggetCycle = nuggetData.cycle;
  const nuggetLevel = nuggetData.feature;
  const nuggetBid = nuggetData.bid?.bidprice ?? 0;
  const nuggetBidderId = nuggetData.bid?.bidder[0] ?? 0;
  const nuggetAttributeString = getAttributeList(
    nuggetData.attributes,
    nuggetData.feature
  );

  const adjustSize = () => {
    if (containerRef.current) {
      setTitleFontSize(containerRef.current.offsetHeight / 10);
      setDescriptionFontSize(containerRef.current.offsetHeight / 13);
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

  const onClickCancel = () => {
    if (uIState.type == UIStateType.BidNuggetInfoPopup) {
      dispatch(setUIState({ type: UIStateType.Idle }));
    }
  };

  return (
    <div className="bid-nugget-info-popup-container">
      <div onClick={onClickCancel} className="bid-nugget-info-popup-mask" />
      <div ref={containerRef} className="bid-nugget-info-popup-main-container">
        <img src={image} className="bid-nugget-info-popup-avatar-image" />
        <img
          src={background}
          className="bid-nugget-info-popup-main-background"
        />
        <div className="bid-nugget-info-popup-close-button">
          <PopupCloseButton onClick={onClickCancel} isDisabled={false} />
        </div>
        <p
          className="bid-nugget-info-popup-title-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          {`NuggetId: ${nuggetId}`}
        </p>
        <p
          className="bid-nugget-info-popup-price-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Recycle Price: ${nuggetPrice}`}
        </p>
        <p
          className="bid-nugget-info-popup-cycle-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Cycle: ${nuggetCycle}`}
        </p>
        <p
          className="bid-nugget-info-popup-bid-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Current Bid Price: ${nuggetBid}`}
        </p>
        {nuggetBidderId && (
          <p
            className="bid-nugget-info-popup-bidder-text"
            style={{
              fontSize: descriptionFontSize,
              ...getTextShadowStyle(descriptionFontSize / 15),
            }}
          >
            {`Bidder: ${nuggetBidderId}`}
          </p>
        )}
        <div className="bid-nugget-info-popup-levels-container">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className={`bid-nugget-info-popup-level-container`}
            >
              <NuggetLevel key={index} isActive={index < nuggetLevel} />
            </div>
          ))}
        </div>
        <div>
          {nuggetAttributeString.slice(0, 26).map((s, index) => (
            <p
              key={index}
              className="bid-nugget-info-popup-attributes-text"
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
      </div>
    </div>
  );
};

export default BidNuggetInfoPopup;
