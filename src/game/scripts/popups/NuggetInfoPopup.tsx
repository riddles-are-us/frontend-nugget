import { useState, useRef, useEffect } from "react";
import background from "../../images/popups/pop_frame.png";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./NuggetInfoPopup.css";
import { selectUIState, setUIState, UIStateType } from "../../../data/ui";
import { NuggetData } from "../../../data/model";
import { getAttributeList, getTextShadowStyle } from "../common/Utility";
import NuggetLevel from "../scene/gameplay/NuggetLevel";
import image from "../../images/nuggets/image.png";
import DefaultButton from "../buttons/DefaultButton";
import PopupCloseButton from "../buttons/PopupCloseButton";

interface Props {
  nuggetData: NuggetData;
}

const attributeLefts = [
  0.008, 0.045, 0.083, 0.123, 0.16, 0.197, 0.236, 0.274, 0.313, 0.351, 0.39,
  0.428, 0.467, 0.505, 0.543, 0.582, 0.619, 0.658, 0.695, 0.733, 0.769, 0.808,
  0.845, 0.883, 0.92, 0.957,
];

const NuggetInfoPopup = ({ nuggetData }: Props) => {
  const dispatch = useAppDispatch();
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
    if (uIState.type == UIStateType.NuggetInfoPopup) {
      dispatch(setUIState({ type: UIStateType.Idle }));
    }
  };

  const onClickExploreNugget = () => {
    // dispatch(setUIState({ type: UIStateType.Idle }));
  };

  const onClickSellNugget = () => {
    // dispatch(setUIState({ type: UIStateType.Idle }));
  };

  return (
    <div className="nugget-info-popup-container">
      <div onClick={onClickCancel} className="nugget-info-popup-mask" />
      <div ref={containerRef} className="nugget-info-popup-main-container">
        <img src={image} className="nugget-info-popup-avatar-image" />
        <img src={background} className="nugget-info-popup-main-background" />
        <div className="nugget-info-popup-close-button">
          <PopupCloseButton onClick={onClickCancel} isDisabled={false} />
        </div>
        <p
          className="nugget-info-popup-title-text"
          style={{
            fontSize: titleFontSize,
            ...getTextShadowStyle(titleFontSize / 15),
          }}
        >
          {`NuggetId: ${nuggetId}`}
        </p>
        <p
          className="nugget-info-popup-price-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Recycle Price: ${nuggetPrice}`}
        </p>
        <p
          className="nugget-info-popup-cycle-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Cycle: ${nuggetCycle}`}
        </p>
        <p
          className="nugget-info-popup-bid-text"
          style={{
            fontSize: descriptionFontSize,
            ...getTextShadowStyle(descriptionFontSize / 15),
          }}
        >
          {`Bid: ${nuggetBid}`}
        </p>
        <div className="nugget-info-popup-levels-container">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className={`nugget-info-popup-level-container`}>
              <NuggetLevel key={index} isActive={index < nuggetLevel} />
            </div>
          ))}
        </div>
        <div>
          {nuggetAttributeString.slice(0, 26).map((s, index) => (
            <p
              className="nugget-info-popup-attributes-text"
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
        <div className="nugget-info-popup-explore-button">
          <DefaultButton
            text={"Explore Nugget"}
            onClick={onClickExploreNugget}
            isDisabled={false}
          />
        </div>
        <div className="nugget-info-popup-sell-button">
          <DefaultButton
            text={"Sell Nugget"}
            onClick={onClickSellNugget}
            isDisabled={false}
          />
        </div>
      </div>
    </div>
  );
};

export default NuggetInfoPopup;
