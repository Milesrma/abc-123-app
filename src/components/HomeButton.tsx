import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { colors, sizes } from '../theme/tokens';
import { BigButton } from './BigButton';

/** Picture-only Home button (no text a child must read). */
export function HomeButton() {
  const router = useRouter();
  return (
    <BigButton
      accessibilityLabel="Home"
      size={sizes.touchTarget}
      color={colors.bg}
      style={{ borderWidth: 3, borderColor: colors.ink }}
      onPress={() => router.dismissTo('/home')}
    >
      <Ionicons name="home" size={36} color={colors.ink} />
    </BigButton>
  );
}
