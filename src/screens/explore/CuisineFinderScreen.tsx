import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import CategoryPill from '../../components/common/CategoryPill';
import RatingStars from '../../components/common/RatingStars';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { restaurants } from '../../services/mockData/restaurants';

const CUISINES = [
  'All',
  'Traditional Saudi',
  'Japanese',
  'French',
  'Italian',
  'Chinese',
  'Cafe',
  'Fast Food',
  'Grilled Chicken',
];
const PRICE_FILTERS = ['All', '$', '$$', '$$$', '$$$$'];

export default function CuisineFinderScreen() {
  const navigation = useNavigation<any>();
  const [cuisine, setCuisine] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');

  const filtered = useMemo(() => {
    let items = restaurants;
    if (cuisine !== 'All') items = items.filter((r) => r.cuisine === cuisine);
    if (priceFilter !== 'All') {
      const level = priceFilter.length;
      items = items.filter((r) => r.priceRange === level);
    }
    return items;
  }, [cuisine, priceFilter]);

  return (
    <View style={styles.container}>
      <Header title="Cuisine Finder" showBack onBack={() => navigation.goBack()} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cuisineRow}
      >
        {CUISINES.map((c) => (
          <CategoryPill key={c} label={c} isActive={cuisine === c} onPress={() => setCuisine(c)} />
        ))}
      </ScrollView>

      <View style={styles.priceRow}>
        {PRICE_FILTERS.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.priceChip, priceFilter === p && styles.priceChipActive]}
            onPress={() => setPriceFilter(p)}
          >
            <Text style={[styles.priceText, priceFilter === p && styles.priceTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('RestaurantDetail', { id: item.id })}
          >
            <Image
              source={{ uri: item.images[0] }}
              style={styles.cardImage}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.cardInfo}>
              <View style={styles.cardTop}>
                <Text style={styles.cardName} numberOfLines={1}>
                  {item.name}
                </Text>
                {item.isOpen && <View style={styles.openDot} />}
              </View>
              <Text style={styles.cardCuisine}>
                {item.cuisine} - {item.city}
              </Text>
              <View style={styles.cardMeta}>
                <RatingStars rating={item.rating} size="sm" showCount count={item.reviewCount} />
                <Text style={styles.cardPrice}>{'$'.repeat(item.priceRange)}</Text>
              </View>
              <View style={styles.dietRow}>
                {item.dietaryOptions.slice(0, 3).map((d) => (
                  <View key={d} style={styles.dietTag}>
                    <Text style={styles.dietText}>{d}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No restaurants match your filters</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  cuisineRow: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  priceRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  priceChip: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.pearl,
  },
  priceChipActive: { backgroundColor: colors.sand },
  priceText: { fontSize: typography.sizes.sm, color: colors.charcoal, fontWeight: '600' },
  priceTextActive: { color: colors.white },
  list: { padding: spacing.md, paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.small,
  },
  cardImage: { width: 110, height: 130 },
  cardInfo: { flex: 1, padding: spacing.sm, justifyContent: 'center' },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardName: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal, flex: 1 },
  openDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  cardCuisine: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 2 },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  cardPrice: { fontSize: typography.sizes.sm, color: colors.sand, fontWeight: '700' },
  dietRow: { flexDirection: 'row', gap: spacing.xs, marginTop: spacing.xs },
  dietTag: {
    backgroundColor: colors.pearl,
    paddingVertical: 2,
    paddingHorizontal: spacing.xs + 2,
    borderRadius: borderRadius.sm,
  },
  dietText: { fontSize: 10, color: colors.slate, fontWeight: '500' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: typography.sizes.md, color: colors.slate },
});
