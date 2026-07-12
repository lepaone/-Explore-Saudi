import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import CategoryPill from '../../components/common/CategoryPill';
import RatingStars from '../../components/common/RatingStars';
import PriceBadge from '../../components/common/PriceBadge';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { hotels } from '../../services/mockData/hotels';

const STAR_FILTERS = [
  { key: 'all', label: 'All' },
  { key: '5', label: '5 Stars' },
  { key: '4', label: '4 Stars' },
  { key: '3', label: '3 Stars' },
];

export default function AccommodationScreen() {
  const navigation = useNavigation<any>();
  const [starFilter, setStarFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const popularHotels = useMemo(
    () => [...hotels].sort((a, b) => b.rating - a.rating).slice(0, 5),
    [],
  );

  const filtered = useMemo(() => {
    if (starFilter === 'all') return hotels;
    return hotels.filter((h) => h.stars === Number(starFilter));
  }, [starFilter]);

  return (
    <View style={styles.container}>
      <Header title="Accommodation" showBack onBack={() => navigation.goBack()} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {STAR_FILTERS.map((f) => (
          <CategoryPill
            key={f.key}
            label={f.label}
            isActive={starFilter === f.key}
            onPress={() => setStarFilter(f.key)}
          />
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListHeaderComponent={
          <>
            {/* Popular Hotels - Horizontal Scroll */}
            <View style={styles.popularHeader}>
              <Text style={styles.popularTitle}>🔥 Popular Hotels</Text>
            </View>
            <FlatList
              data={popularHotels}
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularList}
              keyExtractor={(item) => `pop_${item.id}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.popularCard}
                  onPress={() => navigation.navigate('HotelDetail', { id: item.id })}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: item.images[0] }}
                    style={styles.popularImage}
                    contentFit="cover"
                    transition={200}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(5,31,31,0.80)']}
                    style={styles.popularOverlay}
                  >
                    <View style={styles.popularStars}>
                      {Array.from({ length: item.stars }, (_, i) => (
                        <Text key={i} style={styles.popularStar}>
                          {'\u2605'}
                        </Text>
                      ))}
                    </View>
                    <Text style={styles.popularName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.popularCity}>📍 {item.city}</Text>
                    <Text style={styles.popularPrice}>SAR {item.pricePerNight}/night</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            />
            <View style={styles.divider} />
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('HotelDetail', { id: item.id })}
          >
            <Image
              source={{ uri: item.images[0] }}
              style={styles.cardImage}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.cardInfo}>
              <View style={styles.starsRow}>
                {Array.from({ length: item.stars }, (_, i) => (
                  <Text key={i} style={styles.star}>
                    {'\u2605'}
                  </Text>
                ))}
              </View>
              <Text style={styles.cardName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.cardCity}>{item.city}</Text>
              <RatingStars rating={item.rating} size="sm" showCount count={item.reviewCount} />
              <View style={styles.cardBottom}>
                <PriceBadge price={item.pricePerNight} size="sm" />
                <Text style={styles.perNight}>/ night</Text>
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
  filterRow: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.sm },
  list: { padding: spacing.md, paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadows.small,
  },
  cardImage: { width: 120, height: 140 },
  cardInfo: { flex: 1, padding: spacing.sm, justifyContent: 'center' },
  starsRow: { flexDirection: 'row' },
  star: { fontSize: 12, color: colors.sand },
  cardName: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.charcoal,
    marginTop: 4,
  },
  cardCity: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 2, marginBottom: 4 },
  cardBottom: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs, marginTop: 4 },
  perNight: { fontSize: typography.sizes.xs, color: colors.slate },

  // Popular Hotels (horizontal scroll)
  popularHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  popularTitle: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.charcoal },
  popularList: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: spacing.sm },
  popularCard: {
    width: 200,
    height: 160,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.pearl,
    ...shadows.md,
  },
  popularImage: { width: '100%', height: '100%' },
  popularOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xl,
  },
  popularStars: { flexDirection: 'row', marginBottom: 2 },
  popularStar: { fontSize: 10, color: colors.sand },
  popularName: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.white },
  popularCity: { fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  popularPrice: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    color: colors.sand,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.pearl,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
});
