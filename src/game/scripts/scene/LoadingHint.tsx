import { useEffect, useRef, useState } from "react";
import "./LoadingHint.css";
import pickNuggetAnimation from "../../images/scene/gameplay/loading_animation/pick_nugget.gif";
import bidNuggetAnimation from "../../images/scene/gameplay/loading_animation/bid_nugget.gif";
import exploreNuggetAnimation from "../../images/scene/gameplay/loading_animation/explore_nugget.gif";
import settleNuggetAnimation from "../../images/scene/gameplay/loading_animation/settle_nugget.gif";
import listNuggetAnimation from "../../images/scene/gameplay/loading_animation/list_nugget.gif";
import { getTextShadowStyle } from "../common/Utility";
import { useAppSelector } from "../../../app/hooks";
import { LoadingType, selectLoadingType } from "../../../data/errors";
import { useIsMobile } from "../../../app/isMobileContext";

const LoadingHint = () => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { isMobile } = useIsMobile();
  const [fontSize, setFontSize] = useState<number>(0);
  const loadingType = useAppSelector(selectLoadingType);

  const adjustSize = () => {
    if (containerRef.current) {
      setFontSize(isMobile ? 16 : containerRef.current.offsetHeight / 30);
    }
  };

  useEffect(() => {
    adjustSize();

    window.addEventListener("resize", adjustSize);
    return () => {
      window.removeEventListener("resize", adjustSize);
    };
  }, [containerRef.current]);

  const getLoadingComponent = (loadingType: LoadingType) => {
    switch (loadingType) {
      case LoadingType.Default:
        return (
          <p
            className="loading-hint-title-text"
            style={{
              fontSize: fontSize,
              ...getTextShadowStyle(fontSize / 15),
            }}
          >
            Loading...
          </p>
        );
      case LoadingType.PickNugget:
        return (
          <img
            src={pickNuggetAnimation}
            style={{
              position: "absolute",
              height: "20%",
              width: "auto",
              aspectRatio: "590 / 381",
              right: "1%",
              bottom: "1%",
              transform: "translate(0, 0)",
            }}
          />
        );
      case LoadingType.BidNugget:
        return (
          <img
            src={bidNuggetAnimation}
            style={{
              position: "absolute",
              height: "20%",
              width: "auto",
              aspectRatio: "590 / 328",
              right: "1%",
              bottom: "1%",
              transform: "translate(0, 0)",
            }}
          />
        );
      case LoadingType.ExploreNugget:
        return (
          <img
            src={exploreNuggetAnimation}
            style={{
              position: "absolute",
              height: "20%",
              width: "auto",
              aspectRatio: "1366 / 768",
              right: "1%",
              bottom: "1%",
              transform: "translate(0, 0)",
            }}
          />
        );
      case LoadingType.SettleNugget:
      case LoadingType.RecycleNugget:
        return (
          <img
            src={settleNuggetAnimation}
            style={{
              position: "absolute",
              height: "20%",
              width: "auto",
              aspectRatio: "510 / 306",
              right: "1%",
              bottom: "1%",
              transform: "translate(0, 0)",
            }}
          />
        );
      case LoadingType.ListNugget:
        return (
          <img
            src={listNuggetAnimation}
            style={{
              position: "absolute",
              height: "20%",
              width: "auto",
              aspectRatio: "590 / 328",
              right: "1%",
              bottom: "1%",
              transform: "translate(0, 0)",
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="loading-hint-container">
      <div className="loading-hint-mask" />
      {getLoadingComponent(loadingType)}
    </div>
  );
};

export default LoadingHint;
