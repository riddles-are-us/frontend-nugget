import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import "./TreasureInfoPopup.css";
import { setUIState, UIStateType } from "../../../data/ui";
import { selectIsLoading } from "../../../data/errors";
import { useWalletContext } from "zkwasm-minirollup-browser";
import { selectUserState } from "../../../data/state";
import treasure_image from "../../images/scene/gameplay/top_container/treasure.png";
import cash_image from "../../images/scene/gameplay/top_container/cash.png";
import leftBackground from "../../images/popups/default/left.png";
import midBackground from "../../images/popups/default/mid.png";
import rightBackground from "../../images/popups/default/right.png";
import available_image from "../../images/scene/gameplay/top_container/available.png";

import PlayerTreasureInfo from "../scene/gameplay/PlayerTreasureInfo";
import PopupCloseButton from "../buttons/PopupCloseButton";
import HorizontalExtendableImage from "../common/HorizontalExtendableImage";
import { useIsMobile } from "../../../app/isMobileContext";
import { useEffect, useRef, useState } from "react";
import PlayerTreasureInfoMobile from "../scene/gameplay/PlayerTreasureInfoMobile";

const TreasureInfoPopup = () => {
  const dispatch = useAppDispatch();
  const { isMobile } = useIsMobile();
  const isLoading = useAppSelector(selectIsLoading);
  const userState = useAppSelector(selectUserState);
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [treasureFontSize, setTreasureFontSize] = useState<number>(0);

  const treasure = userState.state!.treasure;
  const cash = userState.state!.cash;
  const available = treasure - cash;

  const adjustSize = () => {
    if (containerRef.current) {
      setTreasureFontSize(containerRef.current.offsetHeight / 13);
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
    if (!isLoading) {
      dispatch(setUIState({ type: UIStateType.Idle }));
    }
  };

  return (
    <div className="treasure-info-popup-container">
      <div
        onClick={isMobile ? undefined : onClickCancel}
        className="treasure-info-popup-mask"
      />
      <div ref={containerRef} className="treasure-info-popup-main-container">
        <div className="treasure-info-popup-main-background">
          <HorizontalExtendableImage
            leftRatio={58 / 238}
            rightRatio={58 / 238}
            leftImage={leftBackground}
            midImage={midBackground}
            rightImage={rightBackground}
          />
        </div>
        <div className="treasure-info-popup-close-button">
          <PopupCloseButton onClick={onClickCancel} isDisabled={false} />
        </div>
        <div className="treasure-info-player-info-treasure-container">
          <PlayerTreasureInfoMobile
            title={"Current Treasure"}
            value={treasure}
            icon={treasure_image}
            fontSize={treasureFontSize}
          />
        </div>
        <div className="treasure-info-player-info-cash-container">
          <PlayerTreasureInfoMobile
            title={"Current Cash"}
            value={cash}
            icon={cash_image}
            fontSize={treasureFontSize}
          />
        </div>
        <div className="treasure-info-player-info-available-container">
          <PlayerTreasureInfoMobile
            title={"Undestributed Treasure"}
            value={available}
            icon={available_image}
            fontSize={treasureFontSize}
          />
        </div>
      </div>
    </div>
  );
};

export default TreasureInfoPopup;
