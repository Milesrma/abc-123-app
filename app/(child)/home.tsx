import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BigButton } from '../../src/components/BigButton';
import { getPacks } from '../../src/content/loader';
import { colors, fonts, sizes } from '../../src/theme/tokens';
import { themeColor } from '../../src/theme/useThemeColor';

export default function Home() {
  const router = useRouter();

  // The back gesture must never close the app from a child screen.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.row}>
        {getPacks().map((pack) => (
          <BigButton
            key={pack.id}
            accessibilityLabel={pack.title.en ?? pack.id}
            size={200}
            color={themeColor(pack.theme)}
            onPress={() => router.push({ pathname: '/pack/[packId]', params: { packId: pack.id } })}
          >
            <Text style={styles.label}>{pack.title[pack.language]}</Text>
          </BigButton>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: sizes.touchGap, justifyContent: 'center' },
  label: { fontFamily: fonts.latinBold, fontSize: 72, color: colors.bg },
});
