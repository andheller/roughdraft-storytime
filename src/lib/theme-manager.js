/**
 * Theme Manager - Centralized theme handling for the story reader
 */

// Default themes
export const defaultThemes = {
  light: {
    name: 'Light',
    background: '#fef6e4',
    backgroundImage: '/grain-options/5.png',
    text: '#333333',
    textShadow: 'none',
    filter: 'none'
  },
  sepia: {
    name: 'Sepia',
    background: '#f4e8d0',
    backgroundImage: '/texture/paper.png',
    text: '#5c4b3a',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
    filter: 'sepia(0.2)'
  },
  dark: {
    name: 'Dark',
    background: '#1a1a1a',
    backgroundImage: '/grain-options/dark.jpg',
    text: '#e0e0e0',
    textShadow: '0 0 5px rgba(255,255,255,0.1)',
    filter: 'none'
  },
  forest: {
    name: 'Forest',
    background: '#1e3a29',
    backgroundImage: '/texture/fabric.jpg',
    text: '#c9e4ca',
    textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
    filter: 'hue-rotate(80deg) brightness(0.9)'
  },
  ocean: {
    name: 'Ocean',
    background: '#0a2540',
    backgroundImage: '/grain-options/2.jpg',
    text: '#b8d4e8',
    textShadow: '0 0 10px rgba(184,212,232,0.3)',
    filter: 'hue-rotate(180deg) brightness(0.8)'
  }
};

// Typography options
export const typographyOptions = {
  'sans-serif': {
    name: 'Sans Serif',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: '1rem',
    lineHeight: '1.6'
  },
  'serif': {
    name: 'Serif',
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '1.1rem',
    lineHeight: '1.8'
  },
  'dyslexic': {
    name: 'Dyslexic Friendly',
    fontFamily: 'Comic Sans MS, cursive',
    fontSize: '1.15rem',
    lineHeight: '2',
    letterSpacing: '0.05em'
  },
  'monospace': {
    name: 'Monospace',
    fontFamily: 'Consolas, Monaco, monospace',
    fontSize: '0.95rem',
    lineHeight: '1.7'
  }
};

// Storage key
const THEME_STORAGE_KEY = 'storyReader_theme';
const TYPOGRAPHY_STORAGE_KEY = 'storyReader_typography';

/**
 * Theme Manager Class
 */
export class ThemeManager {
  constructor() {
    this.currentTheme = null;
    this.currentTypography = null;
    this.customThemes = {};
  }

  /**
   * Initialize theme manager and load saved preferences
   */
  init() {
    this.loadSavedTheme();
    this.loadSavedTypography();
    this.loadCustomThemes();
  }

  /**
   * Load saved theme from localStorage
   */
  loadSavedTheme() {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) {
      try {
        const theme = JSON.parse(saved);
        this.currentTheme = theme;
      } catch (error) {
        console.error('Failed to load saved theme:', error);
        this.currentTheme = defaultThemes.light;
      }
    } else {
      this.currentTheme = defaultThemes.light;
    }
  }

  /**
   * Load saved typography from localStorage
   */
  loadSavedTypography() {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem(TYPOGRAPHY_STORAGE_KEY);
    if (saved && typographyOptions[saved]) {
      this.currentTypography = saved;
    } else {
      this.currentTypography = 'serif';
    }
  }

  /**
   * Load custom themes
   */
  loadCustomThemes() {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem('storyReader_customThemes');
    if (saved) {
      try {
        this.customThemes = JSON.parse(saved);
      } catch (error) {
        console.error('Failed to load custom themes:', error);
      }
    }
  }

  /**
   * Get all available themes (default + custom)
   */
  getAllThemes() {
    return {
      ...defaultThemes,
      ...this.customThemes
    };
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return this.currentTheme || defaultThemes.light;
  }

  /**
   * Get current typography
   */
  getCurrentTypography() {
    return typographyOptions[this.currentTypography] || typographyOptions.serif;
  }

  /**
   * Set theme
   */
  setTheme(themeKey) {
    const allThemes = this.getAllThemes();
    const theme = allThemes[themeKey];
    
    if (!theme) {
      console.error(`Theme not found: ${themeKey}`);
      return;
    }
    
    this.currentTheme = theme;
    this.saveTheme();
    this.applyTheme();
  }

  /**
   * Set typography
   */
  setTypography(typographyKey) {
    if (!typographyOptions[typographyKey]) {
      console.error(`Typography not found: ${typographyKey}`);
      return;
    }
    
    this.currentTypography = typographyKey;
    this.saveTypography();
    this.applyTypography();
  }

  /**
   * Save current theme to localStorage
   */
  saveTheme() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(this.currentTheme));
  }

  /**
   * Save current typography to localStorage
   */
  saveTypography() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TYPOGRAPHY_STORAGE_KEY, this.currentTypography);
  }

  /**
   * Apply theme to document
   */
  applyTheme() {
    if (typeof document === 'undefined') return;
    
    const theme = this.getCurrentTheme();
    const root = document.documentElement;
    
    // Apply CSS variables
    root.style.setProperty('--theme-bg', theme.background);
    root.style.setProperty('--theme-text', theme.text);
    root.style.setProperty('--theme-text-shadow', theme.textShadow);
    root.style.setProperty('--theme-filter', theme.filter);
    
    // Apply background image if present
    if (theme.backgroundImage) {
      root.style.setProperty('--theme-bg-image', `url(${theme.backgroundImage})`);
    }
  }

  /**
   * Apply typography to document
   */
  applyTypography() {
    if (typeof document === 'undefined') return;
    
    const typography = this.getCurrentTypography();
    const root = document.documentElement;
    
    // Apply CSS variables
    root.style.setProperty('--typography-family', typography.fontFamily);
    root.style.setProperty('--typography-size', typography.fontSize);
    root.style.setProperty('--typography-line-height', typography.lineHeight);
    root.style.setProperty('--typography-letter-spacing', typography.letterSpacing || 'normal');
  }

  /**
   * Create custom theme
   */
  createCustomTheme(key, theme) {
    this.customThemes[key] = {
      ...theme,
      isCustom: true
    };
    this.saveCustomThemes();
  }

  /**
   * Delete custom theme
   */
  deleteCustomTheme(key) {
    delete this.customThemes[key];
    this.saveCustomThemes();
  }

  /**
   * Save custom themes
   */
  saveCustomThemes() {
    if (typeof window === 'undefined') return;
    localStorage.setItem('storyReader_customThemes', JSON.stringify(this.customThemes));
  }

  /**
   * Export theme settings (for sharing)
   */
  exportSettings() {
    return {
      theme: this.currentTheme,
      typography: this.currentTypography,
      customThemes: this.customThemes
    };
  }

  /**
   * Import theme settings
   */
  importSettings(settings) {
    if (settings.theme) {
      this.currentTheme = settings.theme;
      this.saveTheme();
    }
    
    if (settings.typography) {
      this.currentTypography = settings.typography;
      this.saveTypography();
    }
    
    if (settings.customThemes) {
      this.customThemes = { ...this.customThemes, ...settings.customThemes };
      this.saveCustomThemes();
    }
    
    this.applyTheme();
    this.applyTypography();
  }
}

// Create singleton instance
export const themeManager = new ThemeManager();