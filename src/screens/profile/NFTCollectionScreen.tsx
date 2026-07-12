import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/common/Header';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { SCREEN_WIDTH } from '../../constants/layout';

const NFTS = [
  {
    id: '1',
    name: 'Hegra Explorer',
    desc: 'Visited Hegra UNESCO Site',
    icon: '🏛️',
    colors: ['#846edb', '#6a58af'] as const,
  },
  {
    id: '2',
    name: 'Edge Walker',
    desc: 'Reached Edge of the World',
    icon: '🏔️',
    colors: ['#051f1f', '#053333'] as const,
  },
  {
    id: '3',
    name: 'Foodie Legend',
    desc: 'Visited 10+ restaurants',
    icon: '🍽️',
    colors: ['#962640', '#cf6d84'] as const,
  },
  {
    id: '4',
    name: 'Saudi F1 Fan',
    desc: 'Attended Saudi Grand Prix',
    icon: '🏎️',
    colors: ['#214242', '#547070'] as const,
  },
  {
    id: '5',
    name: 'Desert Star',
    desc: 'Stargazing in Empty Quarter',
    icon: '⭐',
    colors: ['#2fba89', '#82d9bf'] as const,
  },
  {
    id: '6',
    name: 'Culture Keeper',
    desc: 'Completed Cultural Guide',
    icon: '📖',
    colors: ['#ffb752', '#846edb'] as const,
  },
];

const CARD_W = (SCREEN_WIDTH - spacing.md * 2 - spacing.sm) / 2;

export default function NFTCollectionScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header
        title="NFT Collection"
        subtitle="Your Digital Souvenirs"
        showBack
        onBack={() => navigation.goBack()}
      />
      <FlatList
        data={NFTS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => (
          <LinearGradient colors={item.colors} style={styles.nftCard}>
            <Text style={styles.nftIcon}>{item.icon}</Text>
            <Text style={styles.nftName}>{item.name}</Text>
            <Text style={styles.nftDesc}>{item.desc}</Text>
            <Text style={styles.nftBadge}>#{item.id.padStart(4, '0')}</Text>
          </LinearGradient>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  grid: { padding: spacing.md, paddingBottom: 100 },
  gridRow: { gap: spacing.sm, marginBottom: spacing.sm },
  nftCard: {
    width: CARD_W,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: CARD_W * 1.2,
  },
  nftIcon: { fontSize: 40, marginBottom: spacing.sm },
  nftName: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  nftDesc: {
    fontSize: typography.sizes.xs,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 4,
  },
  nftBadge: {
    fontSize: typography.sizes.xs,
    color: 'rgba(255,255,255,0.4)',
    marginTop: spacing.sm,
    fontFamily: 'monospace',
  },
});
