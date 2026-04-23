/**
 * The budget app has a carefully tuned warm-cream palette, so we
 * always render in "light" mode regardless of the device setting.
 * If you ever want auto dark mode back, swap this back to:
 *   export { useColorScheme } from 'react-native';
 */
export function useColorScheme(): 'light' {
  return 'light';
}
