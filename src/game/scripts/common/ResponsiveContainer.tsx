import React, { ReactNode, useEffect } from 'react';
import { useViewport } from '../../../app/hooks';
import { getCSSVariables } from '../../../app/theme';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  fallbackLayout?: 'mobile' | 'desktop';
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  fallbackLayout = 'desktop',
}) => {
  const viewport = useViewport();

  // Apply CSS variables based on current device
  useEffect(() => {
    const root = document.documentElement;
    const cssVars = getCSSVariables(viewport.device);
    
    Object.entries(cssVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [viewport.device]);

  // Add device-specific classes
  const responsiveClasses = [
    className,
    `device-${viewport.device}`,
    `orientation-${viewport.orientation}`,
    viewport.isMobile ? 'touch-device' : 'pointer-device',
  ].filter(Boolean).join(' ');

  return (
    <div className={responsiveClasses} data-device={viewport.device}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;