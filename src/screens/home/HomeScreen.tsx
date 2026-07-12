import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { SCREEN_WIDTH } from '../../constants/layout';
import { useAuthStore } from '../../store/useAuthStore';
import { attractions } from '../../services/mockData/attractions';
import { hotels } from '../../services/mockData/hotels';

const CATS = [
  {
    id: '1',
    icon: '🏨',
    label: 'Hotels',
    tab: 'ExploreTab',
    route: 'Accommodation' as string | undefined,
  },
  {
    id: '2',
    icon: '🏛️',
    label: 'Heritage',
    tab: 'ExploreTab',
    route: undefined as string | undefined,
  },
  {
    id: '3',
    icon: '🌿',
    label: 'Nature',
    tab: 'ExploreTab',
    route: undefined as string | undefined,
  },
  {
    id: '4',
    icon: '🕌',
    label: 'Religious',
    tab: 'ExploreTab',
    route: undefined as string | undefined,
  },
  {
    id: '5',
    icon: '🍽️',
    label: 'Dining',
    tab: 'ExploreTab',
    route: 'Dining' as string | undefined,
  },
  {
    id: '6',
    icon: '🛍️',
    label: 'Shopping',
    tab: 'ExploreTab',
    route: 'Shopping' as string | undefined,
  },
];

const FEATURED_CARD_WIDTH = SCREEN_WIDTH - spacing.md * 2;

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);

  // Vertical scroll: pull-to-refresh + scroll-to-top FAB
  const scrollRef = useRef<ScrollView>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Horizontal scroll: featured experiences pagination
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setShowScrollTop(e.nativeEvent.contentOffset.y > 300);
  }, []);

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  React.useEffect(() => {
    if (!user) login('demo', 'demo');
  }, []);

  const allFeatured = attractions.filter((a) => a.isFeatured);
  const featuredExperiences = allFeatured.slice(0, 5);
  const featuredIds = new Set(featuredExperiences.map((a) => a.id));
  const recommended = allFeatured.filter((a) => !featuredIds.has(a.id)).slice(0, 4);
  const leftRec = recommended.filter((_, i) => i % 2 === 0);
  const rightRec = recommended.filter((_, i) => i % 2 !== 0);
  const topHotels = [...hotels].sort((a, b) => b.rating - a.rating).slice(0, 4);

  const goToDetail = (id: string) => navigation.push('AttractionDetail', { id });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Hi, {user?.name?.split(' ')[0] ?? 'Traveler'}! 👋</Text>
            <Text style={styles.subGreeting}>Where do you want to go?</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Text style={styles.notifIcon}>🔔</Text>
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <LinearGradient colors={['#c8a84b', '#a07830']} style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() ?? 'T'}</Text>
            </LinearGradient>
          </View>
        </View>

        {/* ── Search Bar ──────────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.searchBar}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search destinations, cities...</Text>
          <View style={styles.searchFilterBtn}>
            <Text style={styles.searchFilterIcon}>⚙️</Text>
          </View>
        </TouchableOpacity>

        {/* ── Visa & Travel Package ──────────────────────────────────── */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.getParent()?.navigate('ServicesTab', { screen: 'VisaPackage' })}
        >
          <LinearGradient
            colors={['#0b4f4a', '#1a8a6e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.visaCard}
          >
            <View style={styles.visaCardContent}>
              <View style={{ flex: 1 }}>
                <Text style={styles.visaCardBadge}>🛂 Tourist Visa</Text>
                <Text style={styles.visaCardTitle}>Visa & Travel Package</Text>
                <Text style={styles.visaCardDesc}>
                  Tourist Visa + Hotel + Flight from SAR 2,499
                </Text>
                <View style={styles.visaCardBtn}>
                  <Text style={styles.visaCardBtnText}>Apply Now →</Text>
                </View>
              </View>
              <Text style={styles.visaCardEmoji}>✈️</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* ── Featured Experiences (Horizontal Scroll) ────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Experiences</Text>
          <TouchableOpacity onPress={() => navigation.getParent()?.navigate('ExploreTab')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={featuredExperiences}
          horizontal
          nestedScrollEnabled
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={FEATURED_CARD_WIDTH + spacing.sm}
          decelerationRate="fast"
          contentContainerStyle={styles.featuredList}
          keyExtractor={(item) => `feat_${item.id}`}
          onScroll={(e) => {
            const idx = Math.round(
              e.nativeEvent.contentOffset.x / (FEATURED_CARD_WIDTH + spacing.sm),
            );
            setFeaturedIndex(idx);
          }}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.featuredCard}
              activeOpacity={0.9}
              onPress={() => goToDetail(item.id)}
            >
              <Image
                source={{ uri: item.images[0] }}
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
                transition={300}
              />
              <LinearGradient
                colors={['transparent', 'rgba(5,31,31,0.85)']}
                style={styles.featuredOverlay}
              >
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>⭐ Featured</Text>
                </View>
                <Text style={styles.featuredName} numberOfLines={2}>
                  {item.name}
                </Text>
                <View style={styles.featuredMeta}>
                  <Text style={styles.featuredCity}>📍 {item.city}</Text>
                  <Text style={styles.featuredPrice}>
                    {item.price === 0 ? 'Free Entry' : `SAR ${item.price}`}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
        />
        {/* Pagination dots */}
        <View style={styles.dotsRow}>
          {featuredExperiences.map((_, i) => (
            <View key={i} style={[styles.dot, featuredIndex === i && styles.dotActive]} />
          ))}
        </View>

        {/* ── Category Row ────────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Category</Text>
          <TouchableOpacity onPress={() => navigation.getParent()?.navigate('ExploreTab')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}
        >
          {CATS.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.catItem}
              onPress={() => {
                if (cat.route) navigation.navigate(cat.route);
                else navigation.getParent()?.navigate(cat.tab);
              }}
            >
              <View style={styles.catCircle}>
                <Text style={styles.catIcon}>{cat.icon}</Text>
              </View>
              <Text style={styles.catLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Recommended ─────────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          <TouchableOpacity onPress={() => navigation.getParent()?.navigate('ExploreTab')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.recGrid}>
          <View style={styles.recCol}>
            {leftRec.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.recCard}
                onPress={() => goToDetail(item.id)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: item.images[0] }}
                  style={StyleSheet.absoluteFillObject}
                  contentFit="cover"
                  transition={200}
                />
                <View style={styles.heartBtn}>
                  <Text style={styles.heartIcon}>♡</Text>
                </View>
                <LinearGradient
                  colors={['transparent', 'rgba(5,31,31,0.80)']}
                  style={styles.recOverlay}
                >
                  <Text style={styles.recCardName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.recCardPrice}>
                    {item.price === 0 ? 'Free Entry' : `SAR ${item.price}`}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ width: spacing.sm }} />
          <View style={styles.recCol}>
            {rightRec.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.recCard}
                onPress={() => goToDetail(item.id)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: item.images[0] }}
                  style={StyleSheet.absoluteFillObject}
                  contentFit="cover"
                  transition={200}
                />
                <View style={styles.heartBtn}>
                  <Text style={styles.heartIcon}>♡</Text>
                </View>
                <LinearGradient
                  colors={['transparent', 'rgba(5,31,31,0.80)']}
                  style={styles.recOverlay}
                >
                  <Text style={styles.recCardName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.recCardPrice}>
                    {item.price === 0 ? 'Free Entry' : `SAR ${item.price}`}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Top Hotels ─────────────────────────────────────────────── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Hotels</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Accommodation')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={topHotels}
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.placeList}
          keyExtractor={(item) => `hotel_${item.id}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.placeCard}
              onPress={() => navigation.push('HotelDetail', { id: item.id })}
              activeOpacity={0.85}
            >
              <Image
                source={{ uri: item.images[0] }}
                style={styles.placeImg}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.placeInfo}>
                <Text style={styles.placeName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.placeCity} numberOfLines={1}>
                  📍 {item.city}
                </Text>
                <View style={styles.placeMeta}>
                  <Text style={styles.placeStar}>
                    {'⭐'} {item.rating.toFixed(1)}
                  </Text>
                  <Text style={styles.placePrice}>SAR {item.pricePerNight}/n</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Scroll-to-top FAB */}
      {showScrollTop && (
        <TouchableOpacity style={styles.scrollTopFab} onPress={scrollToTop} activeOpacity={0.8}>
          <Text style={styles.scrollTopIcon}>↑</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f6f8' },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.pearl,
  },
  headerLeft: { flex: 1 },
  greeting: {
    fontSize: typography.sizes.xxl,
    fontWeight: '800',
    color: colors.charcoal,
    letterSpacing: 0.2,
  },
  subGreeting: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 4 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.pearl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIcon: { fontSize: 18 },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 1.5,
    borderColor: colors.pearl,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: colors.white },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: colors.pearl,
    ...shadows.sm,
  },
  searchIcon: { fontSize: 16, marginRight: spacing.sm },
  searchPlaceholder: { flex: 1, fontSize: typography.sizes.sm, color: colors.slate },
  searchFilterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchFilterIcon: { fontSize: 13 },

  // Visa & Package card
  visaCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    ...shadows.large,
  },
  visaCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visaCardBadge: {
    fontSize: 12,
    color: '#a8e6cf',
    fontWeight: '600' as const,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  visaCardTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  visaCardDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 12,
  },
  visaCardBtn: {
    backgroundColor: '#c8a84b',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  visaCardBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700' as const,
  },
  visaCardEmoji: {
    fontSize: 48,
    marginLeft: spacing.sm,
  },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '800',
    color: colors.charcoal,
    letterSpacing: 0.1,
  },
  seeAll: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.primary },

  // Category
  catRow: { paddingHorizontal: spacing.md, gap: spacing.lg, paddingBottom: spacing.md },
  catItem: { alignItems: 'center', gap: spacing.xs },
  catCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  catIcon: { fontSize: 24 },
  catLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: '500',
    color: colors.charcoal,
    textAlign: 'center',
  },

  // Recommended
  recGrid: { flexDirection: 'row', paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  recCol: { flex: 1 },
  recCard: {
    height: 180,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    backgroundColor: colors.pearl,
    ...shadows.md,
  },
  heartBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  heartIcon: { fontSize: 15, color: colors.error },
  recOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xl,
    zIndex: 1,
  },
  recCardName: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 17,
  },
  recCardPrice: { fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  // Featured Experiences (horizontal snap cards)
  featuredList: { paddingHorizontal: spacing.md, gap: spacing.sm },
  featuredCard: {
    width: FEATURED_CARD_WIDTH,
    height: 150,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.pearl,
    ...shadows.md,
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.xxl,
  },
  featuredBadge: {
    backgroundColor: 'rgba(200,168,75,0.9)',
    borderRadius: borderRadius.full,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  featuredBadgeText: { fontSize: 10, fontWeight: '700', color: colors.white },
  featuredName: {
    fontSize: typography.sizes.lg,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 22,
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  featuredCity: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.85)' },
  featuredPrice: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.sand },

  // Pagination dots
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.pearl, marginHorizontal: 3 },
  dotActive: { width: 20, backgroundColor: colors.primary },

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

  // Places to Visit
  placeList: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingBottom: spacing.sm },
  placeCard: {
    width: 160,
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.pearl,
    ...shadows.sm,
  },
  placeImg: { width: '100%', height: 110, backgroundColor: colors.pearl },
  placeInfo: { padding: spacing.sm },
  placeName: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.charcoal },
  placeCity: { fontSize: 10, color: colors.slate, marginTop: 2 },
  placeMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  placeStar: { fontSize: 10, color: colors.charcoal, fontWeight: '600' },
  placePrice: { fontSize: 10, color: colors.primary, fontWeight: '700' },
});
