import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import SearchBar from '../../components/common/SearchBar';
import CategoryPill from '../../components/common/CategoryPill';
import RatingStars from '../../components/common/RatingStars';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { attractions } from '../../services/mockData/attractions';
import { restaurants } from '../../services/mockData/restaurants';
import { entertainmentVenues } from '../../services/mockData/entertainment';

const CATEGORIES = ['All', 'Attractions', 'Restaurants', 'Entertainment'];

type SearchItem = {
  id: string;
  name: string;
  type: string;
  city: string;
  image: string;
  rating: number;
};

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const allItems: SearchItem[] = useMemo(
    () => [
      ...attractions.map((a) => ({
        id: a.id,
        name: a.name,
        type: 'Attraction',
        city: a.city,
        image: a.images[0],
        rating: a.rating,
      })),
      ...restaurants.map((r) => ({
        id: r.id,
        name: r.name,
        type: 'Restaurant',
        city: r.city,
        image: r.images[0],
        rating: r.rating,
      })),
      ...entertainmentVenues.map((e) => ({
        id: e.id,
        name: e.name,
        type: 'Entertainment',
        city: e.city,
        image: e.images[0],
        rating: e.rating,
      })),
    ],
    [],
  );

  const filtered = useMemo(() => {
    let items = allItems;
    if (category !== 'All') {
      const catMap: Record<string, string> = {
        Attractions: 'Attraction',
        Restaurants: 'Restaurant',
        Entertainment: 'Entertainment',
      };
      items = items.filter((i) => i.type === catMap[category]);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (i) => i.name.toLowerCase().includes(q) || i.city.toLowerCase().includes(q),
      );
    }
    return items;
  }, [allItems, category, query]);

  return (
    <View style={styles.container}>
      <Header title="Search" showBack onBack={() => navigation.goBack()} />
      <View style={styles.searchWrap}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search places, restaurants, events..."
        />
      </View>
      <View style={styles.pills}>
        {CATEGORIES.map((c) => (
          <CategoryPill
            key={c}
            label={c}
            isActive={category === c}
            onPress={() => setCategory(c)}
          />
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id + item.type}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resultCard}>
            <Image
              source={{ uri: item.image }}
              style={styles.resultImage}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.resultInfo}>
              <Text style={styles.resultType}>{item.type}</Text>
              <Text style={styles.resultName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.resultCity}>{item.city}</Text>
              <RatingStars rating={item.rating} size="sm" />
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{'\uD83D\uDD0D'}</Text>
            <Text style={styles.emptyText}>No results found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  searchWrap: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  pills: { flexDirection: 'row', paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  list: { padding: spacing.md },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.small,
  },
  resultImage: { width: 90, height: 90 },
  resultInfo: { flex: 1, padding: spacing.sm, justifyContent: 'center' },
  resultType: {
    fontSize: typography.sizes.xs,
    color: colors.sand,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  resultName: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.charcoal,
    marginTop: 2,
  },
  resultCity: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 2, marginBottom: 4 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.sm },
  emptyText: { fontSize: typography.sizes.md, color: colors.slate },
});
