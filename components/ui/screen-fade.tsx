import { useFocusEffect } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Initial vertical translation in px. Set to 0 to skip slide effect. */
  translate?: number;
  /** Duration of fade-in in ms. */
  duration?: number;
}

/**
 * Fades + subtly slides its content up whenever the parent screen gains
 * focus. Uses expo-router's useFocusEffect so the animation replays every
 * time the user navigates back to the tab, making the UI feel alive.
 */
export default function ScreenFade({ children, style, translate = 10, duration = 280 }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(translate)).current;

  useFocusEffect(
    useCallback(() => {
      opacity.setValue(0);
      translateY.setValue(translate);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          speed: 16,
          bounciness: 4,
        }),
      ]).start();
    }, [opacity, translateY, translate, duration])
  );

  return (
    <Animated.View
      style={[
        { flex: 1, opacity, transform: [{ translateY }] },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
