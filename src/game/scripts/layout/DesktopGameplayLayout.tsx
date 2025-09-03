import React, { ReactNode } from 'react';
import './DesktopGameplayLayout.css';
import VerticalExtendableImage from '../common/VerticalExtendableImage';

// Import the original desktop layout images
import leftTopImage from "../../images/scene/gameplay/left_container/left_top.png";
import leftMiddleImage from "../../images/scene/gameplay/left_container/left_middle.png";
import leftBottomImage from "../../images/scene/gameplay/left_container/left_bottom.png";
import rightTopImage from "../../images/scene/gameplay/right_container/right_top.png";
import rightMiddleImage from "../../images/scene/gameplay/right_container/right_middle.png";
import rightBottomImage from "../../images/scene/gameplay/right_container/right_bottom.png";

interface DesktopGameplayLayoutProps {
  playerInfo: ReactNode;
  tabButtons: ReactNode;
  nuggetGrid: ReactNode;
  avatar?: ReactNode;
}

const DesktopGameplayLayout: React.FC<DesktopGameplayLayoutProps> = ({
  playerInfo,
  tabButtons,
  nuggetGrid,
  avatar,
}) => {
  return (
    <div className="desktop-gameplay-container">
      {/* Desktop Top Container - Original Design */}
      <div className="desktop-gameplay-top-container">
        <div className="desktop-gameplay-top-foreground-container">
          <div className="desktop-gameplay-top-player-info-container">
            {avatar && (
              <img
                className="desktop-gameplay-top-player-info-avatar-image"
                src={typeof avatar === 'string' ? avatar : undefined}
                alt="Player Avatar"
              />
            )}
          </div>
          <div className="desktop-gameplay-top-foreground-extend" />
          <div className="desktop-gameplay-top-foreground-main" />
          <div className="desktop-gameplay-top-player-info-container">
            {playerInfo}
          </div>
          <div className="desktop-gameplay-top-tab-buttons-container">
            {tabButtons}
          </div>
        </div>
      </div>

      {/* Desktop Main Container - Three Column Layout */}
      <div className="desktop-gameplay-main-container">
        <div className="desktop-gameplay-main-left-container">
          <VerticalExtendableImage
            topRatio={1}
            bottomRatio={1}
            topImage={leftTopImage}
            midImage={leftMiddleImage}
            bottomImage={leftBottomImage}
          />
          <div className="desktop-gameplay-main-left-foreground" />
        </div>
        
        <div className="desktop-gameplay-main-middle-container">
          {nuggetGrid}
        </div>
        
        <div className="desktop-gameplay-main-right-container">
          <VerticalExtendableImage
            topRatio={1}
            bottomRatio={1}
            topImage={rightTopImage}
            midImage={rightMiddleImage}
            bottomImage={rightBottomImage}
          />
          <div className="desktop-gameplay-main-right-foreground" />
        </div>
      </div>

      {/* Desktop Bottom Container */}
      <div className="desktop-gameplay-bottom-container" />
    </div>
  );
};

export default DesktopGameplayLayout;