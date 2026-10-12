import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/tokens';

/** One small dot per card; the current card's dot is bigger and coloured. */
export function ProgressDots({ count, current, color }: { count: number; current: number; color: string }) {
  return (
    <View style={styles.row} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={[styles.dot, i === current ? { backgroundColor: color, transform: [{ scale: 1.6 }] } : null]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4, flexWrap: 'nowrap' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.ink, opacity: 0.85 },
});
