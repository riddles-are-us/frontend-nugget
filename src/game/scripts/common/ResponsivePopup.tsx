import React, { ReactNode, useEffect } from 'react';
import { useViewport } from '../../../app/hooks';
import './ResponsivePopup.css';

interface ResponsivePopupProps {
  children: ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
  title?: string;
  showCloseButton?: boolean;
}

const ResponsivePopup: React.FC<ResponsivePopupProps> = ({
  children,
  isOpen,
  onClose,
  className = '',
  title,
  showCloseButton = true,
}) => {
  const viewport = useViewport();

  // Prevent body scroll when popup is open (mobile)
  useEffect(() => {
    if (isOpen && viewport.isMobile) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen, viewport.isMobile]);

  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const popupClasses = [
    'responsive-popup-container',
    `device-${viewport.device}`,
    `orientation-${viewport.orientation}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={popupClasses}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'popup-title' : undefined}
    >
      <div className="responsive-popup-backdrop" />
      
      <div className="responsive-popup-content">
        {/* Mobile-specific header */}
        {viewport.isMobile && (title || showCloseButton) && (
          <div className="responsive-popup-header">
            {title && (
              <h2 id="popup-title" className="responsive-popup-title">
                {title}
              </h2>
            )}
            {showCloseButton && onClose && (
              <button 
                className="responsive-popup-close-mobile"
                onClick={onClose}
                aria-label="Close popup"
              >
                ✕
              </button>
            )}
          </div>
        )}
        
        {/* Popup content */}
        <div className="responsive-popup-body">
          {children}
        </div>
        
        {/* Desktop close button overlay for existing design */}
        {!viewport.isMobile && showCloseButton && onClose && (
          <button 
            className="responsive-popup-close-desktop"
            onClick={onClose}
            aria-label="Close popup"
          />
        )}
      </div>
    </div>
  );
};

export default ResponsivePopup;