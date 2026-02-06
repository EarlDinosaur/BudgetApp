/**
 * Modern color system inspired by shadcn/ui design principles
 * Colors are optimized for professional finance/budgeting applications
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Backgrounds
    background: '#FFFFFF',
    backgroundSecondary: '#F8FAFC',
    backgroundTertiary: '#F1F5F9',
    
    // Text
    text: '#0F172A',
    textSecondary: '#475569',
    textTertiary: '#94A3B8',
    
    // Brand
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    primaryLight: '#DBEAFE',
    
    // Secondary colors
    secondary: '#64748B',
    accent: '#10B981',
    accentLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    
    // UI Elements
    border: '#E2E8F0',
    borderDark: '#CBD5E1',
    shadow: 'rgba(15, 23, 42, 0.1)',
    divider: '#F1F5F9',
    
    // Icons & legacy
    icon: '#64748B',
    tint: '#3B82F6',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#3B82F6',
  },
  dark: {
    // Backgrounds
    background: '#0F172A',
    backgroundSecondary: '#1E293B',
    backgroundTertiary: '#334155',
    
    // Text
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textTertiary: '#64748B',
    
    // Brand
    primary: '#60A5FA',
    primaryHover: '#93C5FD',
    primaryLight: '#1E3A8A',
    
    // Secondary colors
    secondary: '#94A3B8',
    accent: '#34D399',
    accentLight: '#064E3B',
    warning: '#FBBF24',
    warningLight: '#78350F',
    danger: '#F87171',
    dangerLight: '#7F1D1D',
    
    // UI Elements
    border: '#334155',
    borderDark: '#1E293B',
    shadow: 'rgba(0, 0, 0, 0.3)',
    divider: '#1E293B',
    
    // Icons & legacy
    icon: '#94A3B8',
    tint: '#60A5FA',
    tabIconDefault: '#64748B',
    tabIconSelected: '#60A5FA',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
