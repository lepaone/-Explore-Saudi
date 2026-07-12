import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import CategoryPill from '../../components/common/CategoryPill';
import Badge from '../../components/common/Badge';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { SCREEN_WIDTH } from '../../constants/layout';
import { malls } from '../../services/mockData/shopping';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'mega_mall', label: 'Mega Malls' },
  { key: 'luxury', label: 'Luxury' },
  { key: 'traditional_souq', label: 'Traditional Souqs' },
];

export default function ShoppingScreen() {
  const navigation = useNavigation<any>();
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    if (category === 'all') return malls;
    return malls.filter((m) => m.type === category);
  }, [category]);

  return (
    <View style={styles.container}>
      <Header title="Shopping" showBack onBack={() => navigation.goBack()} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {CATEGORIES.map((c) => (
          <CategoryPill
            key={c.key}
            label={c.label}
            isActive={category === c.key}
            onPress={() => setCategory(c.key)}
          />
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('MallDetail', { id: item.id })}
          >
            <Image
              source={{ uri: item.images[0] }}
              style={styles.cardImage}
              contentFit="cover"
              transition={200}
            />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.65)']} style={styles.cardOverlay}>
              {item.promotions.length > 0 && (
                <Badge text={item.promotions[0].discount} variant="discount" size="sm" />
              )}
              <Text style={styles.cardName}>{item.name}</Text>
              <View style={styles.cardMeta}>
                <Text style={styles.cardCity}>{item.city}</Text>
                <Text style={styles.cardStores}>{item.storeCount}+ stores</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  categoryRow: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  list: { padding: spacing.md, paddingBottom: 100 },
  card: {
    height: 180,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.medium,
  },
  cardImage: { width: '100%', height: '100%' },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  cardName: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.white,
    marginTop: spacing.xs,
  },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  cardCity: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.8)' },
  cardStores: { fontSize: typography.sizes.sm, color: colors.sand, fontWeight: '600' },
});
