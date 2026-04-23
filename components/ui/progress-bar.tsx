import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ProgressBarProps {
  value: number; // 0 - 1
  color?: string;
  height?: number;
}

export default function ProgressBar({ value, color, height = 8 }: ProgressBarProps) {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const pct = Math.max(0, Math.min(1, value)) * 100;

  return (
    <View style={[styles.track, { backgroundColor: colors.backgroundTertiary, height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${pct}%`,
            backgroundColor: color ?? colors.primary,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
