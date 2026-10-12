import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from 'react-native-reanimated';
import { colors, sizes } from '../theme/tokens';

interface Props {
  onPress: () => void;
  color?: string;
  /** Square size in dp. Never smaller than the 72 dp touch target. */
  size?: number;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

/** A picture/icon button: bounces and gives a haptic tap the instant it is pressed. */
export function BigButton({ onPress, color = colors.primary, size = 96, accessibilityLabel, style, children }: Props) {
  const scale = useSharedValue(1);
  const reduce = useReducedMotion();
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const side = Math.max(size, sizes.touchTarget);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPressIn={() => {
        if (!reduce) scale.value = withSpring(0.9, { damping: 12, stiffness: 400 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }}
      onPressOut={() => {
        if (!reduce) scale.value = withSpring(1, { damping: 8, stiffness: 300 });
      }}
      onPress={onPress}
    >
      <Animated.View
        style={[styles.base, { width: side, height: side, borderRadius: side / 3, backgroundColor: color }, anim, style]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 6,
    borderColor: 'rgba(31,42,68,0.25)',
  },
});
