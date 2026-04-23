import React, { useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Insets,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface Props {
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  /** Wrapper style applied to the Animated.View (outer). Use for margins etc. */
  wrapperStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  hitSlop?: Insets | number;
  children: React.ReactNode;
  /** How far to scale down on press. Defaults to 0.96 */
  scaleTo?: number;
}

/**
 * Drop-in Pressable replacement that adds a soft spring scale effect
 * when the user presses. Uses the native driver so it stays 60fps.
 */
export default function PressableScale({
  onPress,
  onLongPress,
  style,
  wrapperStyle,
  disabled,
  hitSlop,
  children,
  scaleTo = 0.96,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: scaleTo,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }, wrapperStyle]}>
      <Pressable
        disabled={disabled}
        hitSlop={hitSlop}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={style}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
