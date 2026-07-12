import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import SearchBar from '../../components/common/SearchBar';
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
];

export default function DiningScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [cuisine, setCuisine] = useState('All');

  const filtered = useMemo(() => {
    let items = restaurants;
    if (cuisine !== 'All') items = items.filter((r) => r.cuisine === cuisine);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (r) => r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q),
      );
    }
    return items;
  }, [cuisine, search]);

  const featured = restaurants.filter((r) => r.isFeatured).slice(0, 4);

  return (
    <View style={styles.container}>
      <Header title="Dining" showBack onBack={() => navigation.goBack()} />
      <View style={styles.searchWrap}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search restaurants..." />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {CUISINES.map((c) => (
          <CategoryPill key={c} label={c} isActive={cuisine === c} onPress={() => setCuisine(c)} />
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
              </View>
              <View style={styles.cardBottom}>
                <Text style={styles.priceRange}>{'$'.repeat(item.priceRange)}</Text>
                <Text style={styles.waitTime}>
                  {'\uD83D\uDD52'} {item.waitTime}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  searchWrap: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  categoryRow: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
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
  cardMeta: { marginTop: spacing.xs },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  priceRange: { fontSize: typography.sizes.sm, color: colors.sand, fontWeight: '700' },
  waitTime: { fontSize: typography.sizes.xs, color: colors.slate },
});
