import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Animated from 'react-native-reanimated';

export function HelloWave() {
  const theme = useColorScheme() ?? 'light';
  
  return (
    <Animated.View
      style={{
        marginTop: -6,
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}>
      <MaterialCommunityIcons size={32} name="hand-wave" color={Colors[theme].primary} />
    </Animated.View>
  );
}
