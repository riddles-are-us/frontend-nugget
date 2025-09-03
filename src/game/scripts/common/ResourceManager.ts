import { DeviceType } from '../../../app/hooks';

// Resource loading strategy based on device type
export interface ResourceConfig {
  loadBackgroundImages: boolean;
  loadHighResImages: boolean;
  loadAnimations: boolean;
  maxImageSize: number;
  compressionQuality: number;
  preloadCount: number;
}

export const getResourceConfig = (device: DeviceType): ResourceConfig => {
  switch (device) {
    case 'mobile':
      return {
        loadBackgroundImages: false, // Skip decorative backgrounds
        loadHighResImages: false,    // Use lower resolution
        loadAnimations: true,        // Keep animations but optimize
        maxImageSize: 512,          // Limit image size
        compressionQuality: 0.7,    // Higher compression
        preloadCount: 20,           // Load fewer images upfront
      };
    case 'tablet':
      return {
        loadBackgroundImages: true,
        loadHighResImages: false,
        loadAnimations: true,
        maxImageSize: 1024,
        compressionQuality: 0.8,
        preloadCount: 40,
      };
    case 'desktop':
      return {
        loadBackgroundImages: true,
        loadHighResImages: true,
        loadAnimations: true,
        maxImageSize: 2048,
        compressionQuality: 1.0,
        preloadCount: 100,
      };
  }
};

// Lazy loading hook for images
export const useLazyImageLoading = () => {
  const loadImage = async (src: string, priority: 'low' | 'high' = 'low'): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      if (priority === 'high') {
        img.loading = 'eager';
      } else {
        img.loading = 'lazy';
      }
      
      img.onload = () => resolve(src);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  const preloadImages = async (
    imageUrls: string[], 
    device: DeviceType,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<void> => {
    const config = getResourceConfig(device);
    const imagesToLoad = imageUrls.slice(0, config.preloadCount);
    
    let loadedCount = 0;
    const loadPromises = imagesToLoad.map(async (url) => {
      try {
        await loadImage(url, 'high');
        loadedCount++;
        onProgress?.(loadedCount, imagesToLoad.length);
      } catch (error) {
        console.warn(`Failed to preload image: ${url}`);
        loadedCount++;
        onProgress?.(loadedCount, imagesToLoad.length);
      }
    });

    await Promise.allSettled(loadPromises);
  };

  return { loadImage, preloadImages };
};

// Asset filtering for mobile devices
export const filterAssetsForDevice = (
  imageUrls: string[],
  device: DeviceType
): string[] => {
  const config = getResourceConfig(device);
  
  if (!config.loadBackgroundImages) {
    // Filter out decorative background images for mobile
    return imageUrls.filter(url => {
      const isDecorative = url.includes('left_container') || 
                          url.includes('right_container') ||
                          url.includes('floor_extend') ||
                          url.includes('top_foreground');
      return !isDecorative;
    });
  }
  
  return imageUrls;
};

// Connection speed detection for resource optimization
export const getConnectionSpeed = (): 'slow' | 'fast' => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      return effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g' 
        ? 'slow' : 'fast';
    }
  }
  return 'fast'; // Default assumption
};

// Memory usage optimization
export const shouldUseReducedAssets = (): boolean => {
  if ('deviceMemory' in navigator) {
    const memory = (navigator as any).deviceMemory;
    return memory && memory < 4; // Less than 4GB RAM
  }
  return false;
};