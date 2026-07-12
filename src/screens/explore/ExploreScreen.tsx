import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../../components/common/SearchBar';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { SCREEN_WIDTH } from '../../constants/layout';
import { attractions } from '../../services/mockData/attractions';

const FILTERS = ['All', 'Popular', 'Recommended', 'Rating'] as const;
type Filter = (typeof FILTERS)[number];

export default function ExploreScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const flatListRef = useRef<FlatList>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const filtered = useMemo(() => {
    let items = attractions;
    if (activeFilter === 'Popular') items = items.filter((a) => a.isFeatured);
    else if (activeFilter === 'Recommended')
      items = [...items].sort((a, b) => b.reviewCount - a.reviewCount);
    else if (activeFilter === 'Rating') items = [...items].sort((a, b) => b.rating - a.rating);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (a) => a.name.toLowerCase().includes(q) || a.city.toLowerCase().includes(q),
      );
    }
    return items;
  }, [activeFilter, search]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>Explore the best places in the Kingdom</Text>
      </View>

      {/* Search + Filter icon */}
      <View style={styles.searchRow}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Search destinations..."
          style={{ flex: 1 } as any}
        />
        <TouchableOpacity style={styles.filterIconBtn}>
          <Text style={styles.filterIconText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Filter pills: All / Popular / Recommended / Rating */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text
              style={[styles.filterPillText, activeFilter === f && styles.filterPillTextActive]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 2-column overlay card grid */}
      <FlatList
        ref={flatListRef}
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => setShowScrollTop(e.nativeEvent.contentOffset.y > 300)}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('AttractionDetail', { id: item.id })}
          >
            <Image
              source={{ uri: item.images[0] }}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
              transition={200}
            />
            {/* Heart */}
            <View style={styles.heartBtn}>
              <Text style={styles.heartIcon}>♡</Text>
            </View>
            {/* Overlay */}
            <LinearGradient
              colors={['transparent', 'rgba(5,31,31,0.78)']}
              style={styles.cardOverlay}
            >
              {item.isFeatured && (
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredText}>⭐ Featured</Text>
                </View>
              )}
              <Text style={styles.cardName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.cardSub}>
                {item.price === 0 ? 'Free Entry' : `SAR ${item.price}`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🏜️</Text>
            <Text style={styles.emptyText}>No attractions found</Text>
          </View>
        }
      />

      {/* Scroll-to-top FAB */}
      {showScrollTop && (
        <TouchableOpacity style={styles.scrollTopFab} onPress={scrollToTop} activeOpacity={0.8}>
          <Text style={styles.scrollTopIcon}>↑</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const CARD_W = (SCREEN_WIDTH - spacing.md * 2 - spacing.sm) / 2;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },

  // Header
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.pearl,
  },
  title: { fontSize: typography.sizes.xxl, fontWeight: '800', color: colors.charcoal },
  subtitle: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 4 },

  // Search row
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    gap: spacing.sm,
  },
  filterIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    ...shadows.sm,
  },
  filterIconText: { fontSize: 18 },

  // Filter pills
  filterRow: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  filterPill: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md + 4,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.pearl,
    backgroundColor: colors.white,
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  filterPillText: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.charcoal },
  filterPillTextActive: { color: colors.white },

  // Card grid
  grid: { paddingHorizontal: spacing.md, paddingBottom: 100 },
  gridRow: { gap: spacing.sm, marginBottom: spacing.sm },
  card: {
    width: CARD_W,
    height: 160,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.pearl,
    borderWidth: 1,
    borderColor: colors.pearl,
    ...shadows.md,
  },
  heartBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  heartIcon: { fontSize: 14, color: colors.error },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xl,
    zIndex: 1,
  },
  featuredBadge: {
    backgroundColor: 'rgba(200,168,75,0.85)',
    borderRadius: borderRadius.full,
    paddingVertical: 2,
    paddingHorizontal: spacing.xs + 2,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  featuredText: { fontSize: 9, fontWeight: '700', color: colors.white },
  cardName: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 17,
  },
  cardSub: { fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  // Scroll-to-top FAB
  scrollTopFab: {
    position: 'absolute',
    bottom: 100,
    right: spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  scrollTopIcon: { fontSize: 20, fontWeight: '700', color: colors.white },

  // Empty
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.sm },
  emptyText: { fontSize: typography.sizes.md, color: colors.slate },
});
