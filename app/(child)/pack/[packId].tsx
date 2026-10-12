import { Ionicons } from '@expo/vector-icons';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BigButton } from '../../../src/components/BigButton';
import { HomeButton } from '../../../src/components/HomeButton';
import { getPack } from '../../../src/content/loader';
import { colors, sizes } from '../../../src/theme/tokens';
import { themeColor } from '../../../src/theme/useThemeColor';

/** Pack menu. Milestone 1 has one activity (Learn); the others arrive in later milestones. */
export default function PackMenu() {
  const { packId } = useLocalSearchParams<{ packId: string }>();
  const router = useRouter();
  const pack = getPack(packId);
  if (!pack) return <Redirect href="/home" />;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.home}>
        <HomeButton />
      </View>
      <View style={styles.row}>
        {pack.activities.includes('learn') && (
          <BigButton
            accessibilityLabel="Learn"
            size={200}
            color={themeColor(pack.theme)}
            onPress={() => router.push({ pathname: '/learn/[packId]', params: { packId: pack.id } })}
          >
            <Ionicons name="eye" size={110} color={colors.bg} />
          </BigButton>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  home: { position: 'absolute', top: 24, left: 24, zIndex: 2 },
  row: { flex: 1, flexDirection: 'row', gap: sizes.touchGap, alignItems: 'center', justifyContent: 'center' },
});
