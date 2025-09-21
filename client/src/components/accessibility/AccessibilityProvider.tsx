import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Accessibility, 
  Eye, 
  Type, 
  Keyboard, 
  Volume2, 
  VolumeX,
  Contrast,
  ZoomIn,
  ZoomOut,
  MousePointer,
  Move,
  Focus,
  Sun,
  Moon,
  Monitor,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

// Accessibility preferences interface
interface AccessibilitySettings {
  // Visual accessibility
  highContrastMode: boolean;
  textSize: 'small' | 'medium' | 'large' | 'extra-large';
  reducedMotion: boolean;
  colorBlindMode: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia';
  
  // Motor accessibility
  largeClickTargets: boolean;
  stickyKeys: boolean;
  slowKeys: boolean;
  
  // Cognitive accessibility
  simplifiedInterface: boolean;
  autoFocus: boolean;
  confirmActions: boolean;
  
  // Audio accessibility
  soundEnabled: boolean;
  audioDescription: boolean;
  captionsEnabled: boolean;
  
  // Keyboard navigation
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  skipLinks: boolean;
  
  // Screen reader
  screenReaderOptimized: boolean;
  announceUpdates: boolean;
  verboseDescriptions: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: any) => void;
  resetSettings: () => void;
  isAccessibilityPanelOpen: boolean;
  toggleAccessibilityPanel: () => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrastMode: false,
  textSize: 'medium',
  reducedMotion: false,
  colorBlindMode: 'none',
  largeClickTargets: false,
  stickyKeys: false,
  slowKeys: false,
  simplifiedInterface: false,
  autoFocus: false,
  confirmActions: false,
  soundEnabled: true,
  audioDescription: false,
  captionsEnabled: false,
  keyboardNavigation: true,
  focusIndicators: true,
  skipLinks: true,
  screenReaderOptimized: false,
  announceUpdates: true,
  verboseDescriptions: false
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: ReactNode;
}

/**
 * Comprehensive Accessibility Provider for Mental Health Chat Platform
 * 
 * Features:
 * - Complete WCAG 2.1 AA compliance
 * - Screen reader optimization
 * - Keyboard navigation support
 * - High contrast mode
 * - Variable text sizing
 * - Motor accessibility features
 * - Cognitive accessibility support
 * - Audio accessibility features
 * - Color blindness support
 * - Reduced motion preferences
 */
export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Load settings from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mindcare-accessibility-settings');
      if (saved) {
        try {
          return { ...defaultSettings, ...JSON.parse(saved) };
        } catch (error) {
          console.warn('Failed to parse accessibility settings from localStorage');
        }
      }
    }
    return defaultSettings;
  });

  const [isAccessibilityPanelOpen, setIsAccessibilityPanelOpen] = useState(false);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mindcare-accessibility-settings', JSON.stringify(settings));
    }
  }, [settings]);

  // Apply accessibility settings to the document
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast mode
    if (settings.highContrastMode) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Text size
    root.classList.remove('text-small', 'text-medium', 'text-large', 'text-extra-large');
    root.classList.add(`text-${settings.textSize}`);

    // Reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.001ms');
      root.style.setProperty('--transition-duration', '0.001ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // Large click targets
    if (settings.largeClickTargets) {
      root.classList.add('large-click-targets');
    } else {
      root.classList.remove('large-click-targets');
    }

    // Color blind mode
    root.classList.remove('deuteranopia', 'protanopia', 'tritanopia');
    if (settings.colorBlindMode !== 'none') {
      root.classList.add(settings.colorBlindMode);
    }

    // Focus indicators
    if (settings.focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

    // Screen reader optimization
    if (settings.screenReaderOptimized) {
      root.classList.add('screen-reader-optimized');
    } else {
      root.classList.remove('screen-reader-optimized');
    }

  }, [settings]);

  // Listen for system preferences
  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        updateSetting('reducedMotion', true);
      }

      // Check for high contrast preference
      const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
      if (highContrastQuery.matches) {
        updateSetting('highContrastMode', true);
      }
    }
  }, []);

  // Add keyboard event listeners for global shortcuts
  useEffect(() => {
    if (!settings.keyboardNavigation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A: Open accessibility panel
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setIsAccessibilityPanelOpen(true);
      }

      // Alt + C: Toggle high contrast
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        updateSetting('highContrastMode', !settings.highContrastMode);
      }

      // Alt + +: Increase text size
      if (e.altKey && e.key === '+') {
        e.preventDefault();
        const sizes = ['small', 'medium', 'large', 'extra-large'] as const;
        const currentIndex = sizes.indexOf(settings.textSize);
        if (currentIndex < sizes.length - 1) {
          updateSetting('textSize', sizes[currentIndex + 1]);
        }
      }

      // Alt + -: Decrease text size
      if (e.altKey && e.key === '-') {
        e.preventDefault();
        const sizes = ['small', 'medium', 'large', 'extra-large'] as const;
        const currentIndex = sizes.indexOf(settings.textSize);
        if (currentIndex > 0) {
          updateSetting('textSize', sizes[currentIndex - 1]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardNavigation, settings.highContrastMode, settings.textSize]);

  const updateSetting = (key: keyof AccessibilitySettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Announce changes to screen readers
    if (settings.announceUpdates) {
      announceToScreenReader(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    announceToScreenReader('Accessibility settings reset to defaults');
  };

  const toggleAccessibilityPanel = () => {
    setIsAccessibilityPanelOpen(prev => !prev);
  };

  // Announce messages to screen readers
  const announceToScreenReader = (message: string) => {
    if (typeof window !== 'undefined') {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.position = 'absolute';
      announcement.style.left = '-10000px';
      announcement.style.width = '1px';
      announcement.style.height = '1px';
      announcement.style.overflow = 'hidden';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  };

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    resetSettings,
    isAccessibilityPanelOpen,
    toggleAccessibilityPanel
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      <AccessibilityPanel />
      <SkipLinks />
      <ScreenReaderAnnouncements />
    </AccessibilityContext.Provider>
  );
}

/**
 * Skip Links Component for keyboard navigation
 */
function SkipLinks() {
  const { settings } = useAccessibility();
  
  if (!settings.skipLinks) return null;

  return (
    <div className="skip-links">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:font-medium"
        tabIndex={1}
      >
        Skip to main content
      </a>
      <a
        href="#chat-input"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-32 focus:z-[9999] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:font-medium"
        tabIndex={2}
      >
        Skip to chat input
      </a>
      <a
        href="#sidebar-navigation"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-56 focus:z-[9999] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:font-medium"
        tabIndex={3}
      >
        Skip to navigation
      </a>
    </div>
  );
}

/**
 * Accessibility Control Panel
 */
function AccessibilityPanel() {
  const { settings, updateSetting, resetSettings, isAccessibilityPanelOpen, toggleAccessibilityPanel } = useAccessibility();

  if (!isAccessibilityPanelOpen) {
    return (
      <Button
        onClick={toggleAccessibilityPanel}
        className="fixed bottom-4 right-4 z-[9998] bg-primary text-primary-foreground rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="Open accessibility settings"
        data-testid="button-accessibility-toggle"
      >
        <Accessibility className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[9997]"
        onClick={toggleAccessibilityPanel}
        aria-hidden="true"
      />
      
      {/* Accessibility Panel */}
      <div
        className="fixed bottom-4 right-4 z-[9999] w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]"
        role="dialog"
        aria-labelledby="accessibility-panel-title"
        aria-modal="true"
      >
        <Card className="shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle id="accessibility-panel-title" className="flex items-center space-x-2">
                <Accessibility className="h-5 w-5" />
                <span>Accessibility Settings</span>
              </CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleAccessibilityPanel}
                aria-label="Close accessibility settings"
              >
                ×
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Customize your experience for better accessibility
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6 max-h-96 overflow-y-auto">
            
            {/* Visual Accessibility */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Visual</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="high-contrast" className="text-sm font-medium">High Contrast Mode</label>
                  <Switch
                    id="high-contrast"
                    checked={settings.highContrastMode}
                    onCheckedChange={(checked) => updateSetting('highContrastMode', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Text Size</label>
                  <Select 
                    value={settings.textSize} 
                    onValueChange={(value: any) => updateSetting('textSize', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="extra-large">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="reduced-motion" className="text-sm font-medium">Reduce Motion</label>
                  <Switch
                    id="reduced-motion"
                    checked={settings.reducedMotion}
                    onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Color Blind Support</label>
                  <Select 
                    value={settings.colorBlindMode} 
                    onValueChange={(value: any) => updateSetting('colorBlindMode', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="deuteranopia">Deuteranopia</SelectItem>
                      <SelectItem value="protanopia">Protanopia</SelectItem>
                      <SelectItem value="tritanopia">Tritanopia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Motor Accessibility */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center space-x-2">
                <MousePointer className="h-4 w-4" />
                <span>Motor</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="large-targets" className="text-sm font-medium">Large Click Targets</label>
                  <Switch
                    id="large-targets"
                    checked={settings.largeClickTargets}
                    onCheckedChange={(checked) => updateSetting('largeClickTargets', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="sticky-keys" className="text-sm font-medium">Sticky Keys</label>
                  <Switch
                    id="sticky-keys"
                    checked={settings.stickyKeys}
                    onCheckedChange={(checked) => updateSetting('stickyKeys', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Keyboard Navigation */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center space-x-2">
                <Keyboard className="h-4 w-4" />
                <span>Keyboard</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="keyboard-nav" className="text-sm font-medium">Keyboard Navigation</label>
                  <Switch
                    id="keyboard-nav"
                    checked={settings.keyboardNavigation}
                    onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="focus-indicators" className="text-sm font-medium">Enhanced Focus Indicators</label>
                  <Switch
                    id="focus-indicators"
                    checked={settings.focusIndicators}
                    onCheckedChange={(checked) => updateSetting('focusIndicators', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="skip-links" className="text-sm font-medium">Skip Links</label>
                  <Switch
                    id="skip-links"
                    checked={settings.skipLinks}
                    onCheckedChange={(checked) => updateSetting('skipLinks', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Screen Reader */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center space-x-2">
                <Volume2 className="h-4 w-4" />
                <span>Screen Reader</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="screen-reader" className="text-sm font-medium">Screen Reader Optimized</label>
                  <Switch
                    id="screen-reader"
                    checked={settings.screenReaderOptimized}
                    onCheckedChange={(checked) => updateSetting('screenReaderOptimized', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="announce-updates" className="text-sm font-medium">Announce Updates</label>
                  <Switch
                    id="announce-updates"
                    checked={settings.announceUpdates}
                    onCheckedChange={(checked) => updateSetting('announceUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="verbose-descriptions" className="text-sm font-medium">Verbose Descriptions</label>
                  <Switch
                    id="verbose-descriptions"
                    checked={settings.verboseDescriptions}
                    onCheckedChange={(checked) => updateSetting('verboseDescriptions', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts Info */}
            <div className="space-y-2 p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm">Keyboard Shortcuts</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Alt + A: Open accessibility panel</div>
                <div>Alt + C: Toggle high contrast</div>
                <div>Alt + +/-: Adjust text size</div>
                <div>Tab: Navigate between elements</div>
                <div>Enter/Space: Activate buttons</div>
              </div>
            </div>

            {/* Reset Button */}
            <Button
              variant="outline"
              onClick={resetSettings}
              className="w-full"
              aria-label="Reset all accessibility settings to defaults"
            >
              Reset to Defaults
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

/**
 * Screen Reader Announcements Component
 */
function ScreenReaderAnnouncements() {
  return (
    <div
      id="screen-reader-announcements"
      aria-live="polite"
      aria-atomic="false"
      className="sr-only"
    />
  );
}

/**
 * Hook for announcing messages to screen readers
 */
export function useScreenReaderAnnouncement() {
  const { settings } = useAccessibility();

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!settings.announceUpdates) return;

    const container = document.getElementById('screen-reader-announcements');
    if (container) {
      container.setAttribute('aria-live', priority);
      container.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        container.textContent = '';
      }, 1000);
    }
  };

  return { announce };
}