import React, { ReactNode, useRef, useEffect } from 'react';
import { isTouchDevice } from '../../../app/hooks';

interface TouchOptimizedProps {
  children: ReactNode;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

// Touch-optimized wrapper component for mobile interactions
const TouchOptimized: React.FC<TouchOptimizedProps> = ({
  children,
  onTap,
  onDoubleTap,
  onSwipeLeft,
  onSwipeRight,
  className = '',
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    if (!isTouchDevice() || !elementRef.current) return;

    const element = elementRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Detect swipe gestures
      const minSwipeDistance = 50;
      const maxSwipeTime = 300;

      if (deltaTime < maxSwipeTime) {
        if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaY) < 100) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft();
          }
          return;
        }
      }

      // Detect tap gestures
      const maxTapDistance = 10;
      const maxTapTime = 300;

      if (
        Math.abs(deltaX) < maxTapDistance &&
        Math.abs(deltaY) < maxTapDistance &&
        deltaTime < maxTapTime
      ) {
        const now = Date.now();
        const timeSinceLastTap = now - lastTapRef.current;

        if (timeSinceLastTap < 300 && onDoubleTap) {
          // Double tap detected
          onDoubleTap();
          lastTapRef.current = 0;
        } else if (onTap) {
          // Single tap detected
          onTap();
          lastTapRef.current = now;
        }
      }

      touchStartRef.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onTap, onDoubleTap, onSwipeLeft, onSwipeRight]);

  return (
    <div
      ref={elementRef}
      className={`touch-optimized ${className}`}
      style={{
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }}
    >
      {children}
    </div>
  );
};

// Hook for haptic feedback on touch devices
export const useHapticFeedback = () => {
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate(50);
          break;
      }
    }
  };

  return { triggerHaptic };
};

// Component for adding touch ripple effect
interface TouchRippleProps {
  children: ReactNode;
  disabled?: boolean;
  color?: string;
}

export const TouchRipple: React.FC<TouchRippleProps> = ({
  children,
  disabled = false,
  color = 'rgba(255, 255, 255, 0.3)',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const createRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: ${color};
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
    `;

    container.appendChild(ripple);

    setTimeout(() => {
      if (container.contains(ripple)) {
        container.removeChild(ripple);
      }
    }, 600);
  };

  useEffect(() => {
    // Add ripple animation keyframes to document
    if (!document.querySelector('#ripple-keyframes')) {
      const style = document.createElement('style');
      style.id = 'ripple-keyframes';
      style.textContent = `
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="touch-ripple-container"
      onMouseDown={createRipple}
      style={{
        position: 'relative',
        overflow: 'hidden',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {children}
    </div>
  );
};

export default TouchOptimized;