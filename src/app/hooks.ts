import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Viewport detection constants
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface ViewportInfo {
  width: number;
  height: number;
  device: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
  aspectRatio: number;
}

// Custom hook for viewport detection and responsive design
export const useViewport = (): ViewportInfo => {
  const [viewport, setViewport] = useState<ViewportInfo>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.visualViewport?.height || window.innerHeight : 720,
    device: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: 'landscape',
    aspectRatio: 16 / 9,
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      // Use visualViewport for actual available height (excluding browser UI)
      const height = window.visualViewport?.height || window.innerHeight;
      const aspectRatio = width / height;
      const orientation = width > height ? 'landscape' : 'portrait';
      
      // Update CSS custom property for mobile browsers
      if (typeof document !== 'undefined') {
        const vh = height * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      }
      
      let device: DeviceType;
      if (width < BREAKPOINTS.mobile) {
        device = 'mobile';
      } else if (width < BREAKPOINTS.tablet) {
        device = 'tablet';
      } else {
        device = 'desktop';
      }

      setViewport({
        width,
        height,
        device,
        isMobile: device === 'mobile',
        isTablet: device === 'tablet', 
        isDesktop: device === 'desktop',
        orientation,
        aspectRatio,
      });
    };

    updateViewport();
    
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    
    // Listen to visualViewport changes for mobile browsers
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewport);
    }
    
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewport);
      }
    };
  }, []);

  return viewport;
};

// Utility functions for responsive design
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const getResponsiveValue = <T>(values: {
  mobile: T;
  tablet?: T;
  desktop: T;
}, device: DeviceType): T => {
  switch (device) {
    case 'mobile':
      return values.mobile;
    case 'tablet':
      return values.tablet || values.desktop;
    case 'desktop':
      return values.desktop;
  }
};
