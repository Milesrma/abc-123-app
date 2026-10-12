import { Redirect, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createPlayer } from '../../../src/audio';
import { HomeButton } from '../../../src/components/HomeButton';
import { ProgressDots } from '../../../src/components/ProgressDots';
import { getPack, resolveAsset } from '../../../src/content/loader';
import type { PackItem } from '../../../src/content/types';
import { buildPlaySequence, glyphFontSize, pageFromOffset, playableItems } from '../../../src/engine/learn';
import { colors, fonts } from '../../../src/theme/tokens';
import { themeColor } from '../../../src/theme/useThemeColor';

// Language mode and purchases arrive in later milestones; the free English pack is all there is for now.
const LANGUAGE_MODE = 'en' as const;
const UNLOCKED = false;

interface CardProps {
  item: PackItem;
  width: number;
  height: number;
  color: string;
  onTap: (item: PackItem) => void;
}

function LearnCard({ item, width, height, color, onTap }: CardProps) {
  const bounce = useSharedValue(1);
  const reduce = useReducedMotion();
  const landscape = width > height;
  const fontSize = glyphFontSize(height);
  const glyphStyle = useAnimatedStyle(() => ({ transform: [{ scale: bounce.value }] }));
  const pictureSize = landscape ? Math.min(width * 0.3, height * 0.6) : Math.min(width * 0.6, height * 0.25);

  const handlePress = () => {
    // Visual reaction first so it is instant; sound follows.
    bounce.value = reduce
      ? withSequence(withTiming(0.96, { duration: 80 }), withTiming(1, { duration: 120 }))
      : withSequence(withSpring(1.12, { damping: 6, stiffness: 400 }), withSpring(1, { damping: 8 }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onTap(item);
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${item.glyph}, ${item.word.en ?? ''}`}
      style={[styles.card, { width, height, flexDirection: landscape ? 'row' : 'column' }]}
    >
      <Animated.View style={[styles.glyphBox, { height: landscape ? height : fontSize }, landscape && { flex: 1 }, glyphStyle]}>
        <Text
          allowFontScaling={false}
          style={[styles.glyph, { fontSize, lineHeight: fontSize * 1.15, color }]}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {item.glyph}
        </Text>
      </Animated.View>
      <Animated.View style={[styles.pictureBox, glyphStyle]}>
        <Image source={resolveAsset(item.image)} style={{ width: pictureSize, height: pictureSize }} resizeMode="contain" />
      </Animated.View>
    </Pressable>
  );
}

export default function LearnScreen() {
  const { packId } = useLocalSearchParams<{ packId: string }>();
  const pack = getPack(packId);
  const { width, height } = useWindowDimensions();
  const list = useRef<FlatList<PackItem>>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);

  const items = useMemo(() => (pack ? playableItems(pack.items, UNLOCKED) : []), [pack]);
  const player = useMemo(() => createPlayer(), []);

  // Load every clip up front so a tap plays with no lag; free the sounds on exit.
  useEffect(() => {
    items.forEach((it) => player.preload(buildPlaySequence(it, LANGUAGE_MODE)));
    return () => player.release();
  }, [items, player]);

  const onTap = useCallback(
    (item: PackItem) => {
      player.play(buildPlaySequence(item, LANGUAGE_MODE)).catch(() => {});
    },
    [player],
  );

  const onSettle = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = pageFromOffset(e.nativeEvent.contentOffset.x, width, items.length);
      if (next !== indexRef.current) {
        indexRef.current = next;
        setIndex(next);
        player.stop();
      }
    },
    [items.length, player, width],
  );

  if (!pack) return <Redirect href="/home" />;
  const color = themeColor(pack.theme);
  const cardHeight = height;

  return (
    <SafeAreaView style={styles.root} edges={[]}>
      <FlatList
        // Re-create the list on rotation so paging stays aligned.
        key={`${width}x${height}`}
        ref={list}
        data={items}
        keyExtractor={(it) => it.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={indexRef.current}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onMomentumScrollEnd={onSettle}
        windowSize={3}
        renderItem={({ item }) => (
          <LearnCard item={item} width={width} height={cardHeight} color={color} onTap={onTap} />
        )}
      />
      <View style={styles.home}>
        <HomeButton />
      </View>
      <View style={styles.dots} pointerEvents="none">
        <ProgressDots count={items.length} current={index} color={color} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  card: { alignItems: 'center', justifyContent: 'center' },
  glyphBox: { alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch' },
  glyph: { fontFamily: fonts.latinBold, textAlign: 'center', includeFontPadding: false },
  pictureBox: { alignItems: 'center', justifyContent: 'center', flex: 0 },
  home: { position: 'absolute', top: 24, left: 24 },
  dots: { position: 'absolute', bottom: 16, left: 0, right: 0 },
});
