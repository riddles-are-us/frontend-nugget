import React, { ReactNode } from 'react';
import './MobileGameplayLayout.css';

interface MobileGameplayLayoutProps {
  playerInfo: ReactNode;
  tabButtons: ReactNode;
  nuggetGrid: ReactNode;
  avatar?: ReactNode;
}

const MobileGameplayLayout: React.FC<MobileGameplayLayoutProps> = ({
  playerInfo,
  tabButtons,
  nuggetGrid,
  avatar,
}) => {
  return (
    <div className="mobile-gameplay-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-header-content">
          <div className="mobile-player-info-container">
            {playerInfo}
          </div>
        </div>
      </div>

      {/* Mobile Main Content */}
      <div className="mobile-content">
        <div className="mobile-nugget-grid-container">
          {nuggetGrid}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="mobile-navigation">
        <div className="mobile-tab-buttons-container">
          {tabButtons}
        </div>
        
        {/* Telegram Link in Footer Padding Area */}
        <div className="mobile-footer-links">
          <a 
            href="https://t.me/DelphinusLabOfficial/44551" 
            target="_blank" 
            rel="noopener noreferrer"
            className="telegram-link"
          >
            Join Telegram Community
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileGameplayLayout;