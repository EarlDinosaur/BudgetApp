/**
 * Warm-neutral palette tuned for the cozy-but-professional look.
 *
 * - Cream ivory background — warm, complements the terracotta brand.
 * - White cards for clean contrast on top.
 * - A deep mocha primary so the balance card feels grounded and
 *   clearly stands out against the cream surface.
 * - Amber + terracotta-red accents stay in the warm family.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Backgrounds
    background: '#FAF4EB',          // warm cream / ivory
    backgroundSecondary: '#FFFFFF', // white card surface
    backgroundTertiary: '#F2E6D8',  // soft biscuit chip bg

    // Text
    text: '#3E2723',          // warm chocolate
    textSecondary: '#6B4A40', // mocha
    textTertiary: '#A28876',  // soft tan

    // Brand — deep mocha terracotta (darker so it stands out on cream)
    primary: '#8B5E4C',
    primaryHover: '#704A3B',
    primaryLight: '#F0D9CC', // tinted peach highlight

    // Secondary tones
    secondary: '#A28876',
    accent: '#E8B04B',        // grounded amber (not neon yellow)
    accentLight: '#FCEBC8',
    warning: '#E8B04B',
    warningLight: '#FCEBC8',
    danger: '#D97757',        // warm terracotta-red stays in palette
    dangerLight: '#F7DFD0',

    // UI Elements
    border: '#EADDD0',        // warm, subtle border
    borderDark: '#8B5E4C',
    shadow: 'rgba(62, 39, 35, 0.08)',
    divider: '#F2E6D8',

    // Icons & legacy
    icon: '#6B4A40',
    tint: '#8B5E4C',
    tabIconDefault: '#A28876',
    tabIconSelected: '#8B5E4C',
  },
  // Dark is kept only as a fallback — the app forces light mode in
  // hooks/use-color-scheme.ts. Values here just prevent type errors
  // if dark mode ever gets re-enabled.
  dark: {
    background: '#2A1C17',
    backgroundSecondary: '#3A2920',
    backgroundTertiary: '#4D362A',
    text: '#FFF6EA',
    textSecondary: '#E8C9B3',
    textTertiary: '#A28876',
    primary: '#E0B39F',
    primaryHover: '#F0C6B3',
    primaryLight: '#6B4A40',
    secondary: '#A28876',
    accent: '#F2C26B',
    accentLight: '#5C401B',
    warning: '#F2C26B',
    warningLight: '#5C401B',
    danger: '#E07A5F',
    dangerLight: '#5D2B22',
    border: '#5C3E32',
    borderDark: '#3A2920',
    shadow: 'rgba(0, 0, 0, 0.4)',
    divider: '#3A2920',
    icon: '#E8C9B3',
    tint: '#E0B39F',
    tabIconDefault: '#A28876',
    tabIconSelected: '#E0B39F',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "'Nunito', 'SF Pro Rounded', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'Nunito', 'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
