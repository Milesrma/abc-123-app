import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createPlayer } from '../src/audio';
import { colors, fonts } from '../src/theme/tokens';

/** Splash (under 2 seconds). Placeholder bunny until the Rive mascot arrives in milestone 6. */
export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const player = createPlayer();
    player.preload(['audio/ui/hello.ogg']);
    player.play(['audio/ui/hello.ogg']).catch(() => {});
    const timer = setTimeout(() => router.replace('/home'), 1500);
    return () => {
      clearTimeout(timer);
      player.release();
    };
  }, [router]);

  return (
    <View style={styles.root}>
      <Text style={styles.bunny} accessibilityLabel="Bunny teacher says hello">🐰</Text>
      <Text style={styles.title}>ABC 123</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  bunny: { fontSize: 140 },
  title: { fontFamily: fonts.latinBold, fontSize: 40, color: colors.ink, marginTop: 8 },
});
