import Popups from "./Popups";
import { useAppSelector } from "../../../app/hooks";
import "./Gameplay.css";
import VerticalExtendableImage from "../common/VerticalExtendableImage";
import leftTopImage from "../../images/scene/gameplay/left_container/left_top.png";
import leftMiddleImage from "../../images/scene/gameplay/left_container/left_middle.png";
import decoBarImage from "../../images/scene/gameplay/top_container/deco_bar.png";
import leftBottomImage from "../../images/scene/gameplay/left_container/left_bottom.png";
import rightTopImage from "../../images/scene/gameplay/right_container/right_top.png";
import rightMiddleImage from "../../images/scene/gameplay/right_container/right_middle.png";
import rightBottomImage from "../../images/scene/gameplay/right_container/right_bottom.png";
import PlayerInfo from "./gameplay/PlayerInfo";
import avatarImage from "../../images/avatars/avatar_1.png";
import TabButtons from "./gameplay/TabButtons";
import NuggetGrid from "./gameplay/NuggetGrid";
import { selectIsLoading } from "../../../data/errors";
import LoadingHint from "./LoadingHint";
import { useEffect, useRef, useState } from "react";

const Gameplay = () => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const containerRef = useRef<HTMLParagraphElement>(null);
  const isLoading = useAppSelector(selectIsLoading);

  const adjustSize = () => {
    if (containerRef.current) {
      let tempWindowWidth = containerRef.current.offsetWidth;
      if (typeof window !== "undefined") {
        tempWindowWidth = window.innerWidth;
        setWindowWidth(tempWindowWidth);
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
    <div ref={containerRef} className="gameplay-container">
      <Popups />
      {isLoading && <LoadingHint />}
      <div className="gameplay-top-container">
        <div className="gameplay-top-foreground-container">
          <div className="gameplay-top-player-info-container">
            <img
              className="gameplay-top-player-info-avatar-image"
              src={avatarImage}
            />
          </div>
          <div className="gameplay-top-foreground-extend" />
          <div className="gameplay-top-foreground-main" />
          <div className="gameplay-top-player-info-container">
            <PlayerInfo />
          </div>
          <div className="gameplay-top-tab-buttons-container">
            <TabButtons />
          </div>
        </div>
        <div className="gameplay-top-container-mobile">
          <div className="gameplay-top-container-content-mobile">

          </div>
          <div className="gameplay-top-container-footer-mobile">
            <TabButtons isMobile={windowWidth <= 768} />
          </div>
          <img src={decoBarImage} style={{ width: '100%', height: 'auto' }} />
        </div>
      </div>
      <div className="gameplay-main-container">
        <div className="gameplay-main-left-container">
          <VerticalExtendableImage
            topRatio={1}
            bottomRatio={1}
            topImage={leftTopImage}
            midImage={leftMiddleImage}
            bottomImage={leftBottomImage}
          />
          <div className="gameplay-main-left-foreground" />
        </div>
        <div className="gameplay-main-middle-container">
          <NuggetGrid />
        </div>
        <div className="gameplay-main-right-container">
          <VerticalExtendableImage
            topRatio={1}
            bottomRatio={1}
            topImage={rightTopImage}
            midImage={rightMiddleImage}
            bottomImage={rightBottomImage}
          />
          <div className="gameplay-main-right-foreground" />
        </div>
      </div>
      <div className="gameplay-bottom-container">
      </div>
    </div>
  );
};

export default Gameplay;
