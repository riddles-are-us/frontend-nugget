import { DeviceType } from './hooks';

// Responsive theme configuration
export interface ResponsiveTheme {
  layout: {
    container: {
      padding: string;
      margin: string;
    };
    grid: {
      columns: number;
      gap: string;
    };
    popup: {
      width: string;
      height: string;
      padding: string;
    };
  };
  typography: {
    baseFontSize: string;
    lineHeight: number;
    fontWeight: {
      normal: number;
      bold: number;
    };
  };
  interactions: {
    touchTargetSize: string;
    borderRadius: string;
    transition: string;
  };
}

// Device-specific theme configurations
export const themes: Record<DeviceType, ResponsiveTheme> = {
  mobile: {
    layout: {
      container: {
        padding: '1rem',
        margin: '0',
      },
      grid: {
        columns: 3,
        gap: '0.5rem',
      },
      popup: {
        width: '95vw',
        height: '80vh',
        padding: '1rem',
      },
    },
    typography: {
      baseFontSize: '14px',
      lineHeight: 1.4,
      fontWeight: {
        normal: 400,
        bold: 600,
      },
    },
    interactions: {
      touchTargetSize: '48px',
      borderRadius: '8px',
      transition: 'all 0.2s ease-in-out',
    },
  },
  tablet: {
    layout: {
      container: {
        padding: '1.5rem',
        margin: '0',
      },
      grid: {
        columns: 4,
        gap: '0.75rem',
      },
      popup: {
        width: '80vw',
        height: '70vh',
        padding: '1.5rem',
      },
    },
    typography: {
      baseFontSize: '16px',
      lineHeight: 1.3,
      fontWeight: {
        normal: 400,
        bold: 600,
      },
    },
    interactions: {
      touchTargetSize: '44px',
      borderRadius: '6px',
      transition: 'all 0.2s ease-in-out',
    },
  },
  desktop: {
    layout: {
      container: {
        padding: '0',
        margin: '0',
      },
      grid: {
        columns: 5,
        gap: '1rem',
      },
      popup: {
        width: 'auto',
        height: '30%',
        padding: '0',
      },
    },
    typography: {
      baseFontSize: '16px',
      lineHeight: 1.0,
      fontWeight: {
        normal: 400,
        bold: 700,
      },
    },
    interactions: {
      touchTargetSize: 'auto',
      borderRadius: '0',
      transition: 'none',
    },
  },
};

// CSS-in-JS theme provider utilities
export const getCSSVariables = (device: DeviceType): Record<string, string> => {
  const theme = themes[device];
  
  return {
    '--theme-container-padding': theme.layout.container.padding,
    '--theme-grid-columns': theme.layout.grid.columns.toString(),
    '--theme-grid-gap': theme.layout.grid.gap,
    '--theme-popup-width': theme.layout.popup.width,
    '--theme-popup-height': theme.layout.popup.height,
    '--theme-popup-padding': theme.layout.popup.padding,
    '--theme-font-size': theme.typography.baseFontSize,
    '--theme-line-height': theme.typography.lineHeight.toString(),
    '--theme-touch-target': theme.interactions.touchTargetSize,
    '--theme-border-radius': theme.interactions.borderRadius,
    '--theme-transition': theme.interactions.transition,
  };
};

// Mobile-specific layout utilities
export const getMobileLayoutConfig = () => ({
  // Mobile game layout structure
  header: {
    height: 'var(--mobile-header-height)',
    padding: 'var(--spacing-sm)',
  },
  content: {
    height: 'var(--mobile-content-height)', 
    padding: 'var(--spacing-md)',
  },
  navigation: {
    height: 'var(--mobile-navigation-height)',
    position: 'fixed' as const,
    bottom: 0,
    width: '100%',
    background: 'var(--color-background)',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  // Grid system for mobile nuggets display
  nuggetGrid: {
    columns: 3,
    gap: 'var(--spacing-sm)',
    itemAspectRatio: '1/1',
    itemPadding: 'var(--spacing-xs)',
  },
});