import { DeviceType } from '../../../app/hooks';

// Performance monitoring and optimization utilities
export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  frameRate: number;
  deviceSpecs: {
    cores: number;
    memory: number;
    pixelRatio: number;
  };
}

// Get device performance characteristics
export const getDevicePerformanceProfile = (): PerformanceMetrics['deviceSpecs'] => {
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 4;
  const pixelRatio = window.devicePixelRatio || 1;

  return { cores, memory, pixelRatio };
};

// Performance optimization recommendations based on device
export const getOptimizationSettings = (device: DeviceType, specs: PerformanceMetrics['deviceSpecs']) => {
  const baseSettings = {
    enableAnimations: true,
    maxRenderDistance: 1000,
    particleCount: 100,
    shadowQuality: 'high' as const,
    textureQuality: 'high' as const,
  };

  if (device === 'mobile') {
    return {
      ...baseSettings,
      enableAnimations: specs.cores >= 4 && specs.memory >= 3,
      maxRenderDistance: specs.memory >= 4 ? 800 : 600,
      particleCount: specs.memory >= 6 ? 50 : 25,
      shadowQuality: 'low' as const,
      textureQuality: specs.memory >= 4 ? 'medium' : 'low' as const,
    };
  }

  if (device === 'tablet') {
    return {
      ...baseSettings,
      maxRenderDistance: 900,
      particleCount: 75,
      shadowQuality: 'medium' as const,
      textureQuality: 'medium' as const,
    };
  }

  return baseSettings;
};

// Adaptive quality based on frame rate
export class AdaptiveQualityManager {
  private frameRate: number = 60;
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private qualityLevel: 'low' | 'medium' | 'high' = 'high';

  startMonitoring() {
    const monitor = () => {
      const now = performance.now();
      const delta = now - this.lastTime;
      this.frameCount++;

      if (delta >= 1000) {
        this.frameRate = (this.frameCount * 1000) / delta;
        this.frameCount = 0;
        this.lastTime = now;
        this.adjustQuality();
      }

      requestAnimationFrame(monitor);
    };

    requestAnimationFrame(monitor);
  }

  private adjustQuality() {
    const targetFPS = 30;
    
    if (this.frameRate < targetFPS - 5 && this.qualityLevel !== 'low') {
      this.qualityLevel = this.qualityLevel === 'high' ? 'medium' : 'low';
      this.applyQualitySettings();
    } else if (this.frameRate > targetFPS + 10 && this.qualityLevel !== 'high') {
      this.qualityLevel = this.qualityLevel === 'low' ? 'medium' : 'high';
      this.applyQualitySettings();
    }
  }

  private applyQualitySettings() {
    const root = document.documentElement;
    
    switch (this.qualityLevel) {
      case 'low':
        root.style.setProperty('--animation-duration', '0.1s');
        root.style.setProperty('--blur-amount', '2px');
        break;
      case 'medium':
        root.style.setProperty('--animation-duration', '0.2s');
        root.style.setProperty('--blur-amount', '4px');
        break;
      case 'high':
        root.style.setProperty('--animation-duration', '0.3s');
        root.style.setProperty('--blur-amount', '8px');
        break;
    }
    
    console.log(`Quality adjusted to: ${this.qualityLevel} (FPS: ${this.frameRate.toFixed(1)})`);
  }

  getQualityLevel() {
    return this.qualityLevel;
  }

  getCurrentFPS() {
    return this.frameRate;
  }
}

// Memory usage monitoring
export const getMemoryUsage = (): number => {
  if ('memory' in performance && (performance as any).memory) {
    const memory = (performance as any).memory;
    return memory.usedJSHeapSize / memory.jsHeapSizeLimit;
  }
  return 0;
};

// Battery optimization for mobile devices
export const getBatteryOptimizationSettings = async () => {
  if ('getBattery' in navigator) {
    try {
      const battery: any = await (navigator as any).getBattery();
      const isLowBattery = battery.level < 0.2;
      const isCharging = battery.charging;

      return {
        reducedAnimations: isLowBattery && !isCharging,
        reducedEffects: isLowBattery,
        lowPowerMode: isLowBattery && !isCharging,
      };
    } catch (error) {
      console.warn('Battery API not supported');
    }
  }
  
  return {
    reducedAnimations: false,
    reducedEffects: false,
    lowPowerMode: false,
  };
};

// Image optimization utilities
export const optimizeImageForDevice = (
  originalSrc: string,
  device: DeviceType,
  pixelRatio: number = 1
): string => {
  // This would integrate with a CDN or image processing service
  // For now, return original image
  if (device === 'mobile' && pixelRatio <= 2) {
    // Could append query params for image resizing service
    // return `${originalSrc}?w=512&q=70`;
  }
  
  return originalSrc;
};