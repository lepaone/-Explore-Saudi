import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import PriceBadge from '../../components/common/PriceBadge';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { SCREEN_WIDTH } from '../../constants/layout';
import { attractions } from '../../services/mockData/attractions';
import { useWalletStore } from '../../store/useWalletStore';
import { formatCurrency } from '../../utils/formatters';

const TABS = ['Hotels', 'Restaurants', 'Activities'] as const;

export default function AttractionDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Hotels');
  const [expanded, setExpanded] = useState(false);

  // Ticket booking state
  const [ticketQty, setTicketQty] = useState(1);
  const [bookingStep, setBookingStep] = useState<'browse' | 'checkout' | 'success'>('browse');
  const [ticketCode, setTicketCode] = useState('');

  const { balance, addTransaction } = useWalletStore();

  const attraction = attractions.find((a) => a.id === route.params?.id);

  if (!attraction) {
    return (
      <View style={styles.center}>
        <Text>Attraction not found</Text>
      </View>
    );
  }

  const totalPrice = attraction.price * ticketQty;

  const handleContinue = () => {
    if (attraction.price === 0) {
      // Free attraction → show directions confirmation
      Alert.alert(
        'Free Entry',
        `${attraction.name} is free to visit!\n\n📍 ${attraction.city}, Saudi Arabia\n🕙 ${attraction.openingHours}`,
        [{ text: 'Get Directions', onPress: () => {} }, { text: 'OK' }],
      );
    } else {
      setBookingStep('checkout');
    }
  };

  const handlePurchase = () => {
    if (balance < totalPrice) {
      Alert.alert(
        'Insufficient Balance',
        `You need ${formatCurrency(totalPrice)} but your balance is ${formatCurrency(balance)}.\n\nPlease top up your wallet first.`,
        [{ text: 'OK' }],
      );
      return;
    }

    const code = `TKT-${attraction.name.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setTicketCode(code);

    addTransaction({
      id: `txn_${Date.now()}`,
      type: 'payment',
      amount: -totalPrice,
      currency: 'SAR',
      description: `${attraction.name} - ${ticketQty} ticket${ticketQty > 1 ? 's' : ''}`,
      date: new Date().toISOString(),
      category: 'entertainment',
      merchantLogo: '',
    });

    setBookingStep('success');
  };

  // ── Success Screen ──
  if (bookingStep === 'success') {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>🎫</Text>
        <Text style={styles.successTitle}>Ticket Purchased!</Text>
        <Card variant="elevated" style={styles.successCard}>
          <Text style={styles.successAttrName}>{attraction.name}</Text>
          <Text style={styles.successDetail}>📍 {attraction.city}, Saudi Arabia</Text>
          <Text style={styles.successDetail}>
            🎟️ {ticketQty} ticket{ticketQty > 1 ? 's' : ''}
          </Text>
          <Text style={styles.successDetail}>🕙 {attraction.openingHours}</Text>
          <View style={styles.successDivider} />
          <Text style={styles.successCode}>Ticket: {ticketCode}</Text>
          <Text style={styles.successTotal}>Total: {formatCurrency(totalPrice)}</Text>
        </Card>
        <View style={styles.successButtons}>
          <Button title="Back to Explore" onPress={() => navigation.goBack()} fullWidth />
        </View>
      </View>
    );
  }

  // ── Checkout Screen ──
  if (bookingStep === 'checkout') {
    return (
      <View style={styles.container}>
        <View style={styles.checkoutHeader}>
          <TouchableOpacity onPress={() => setBookingStep('browse')}>
            <Text style={styles.checkoutBack}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.checkoutTitle}>Buy Tickets</Text>
          <View style={{ width: 50 }} />
        </View>
        <ScrollView contentContainerStyle={styles.checkoutScroll}>
          <Card variant="elevated" style={styles.checkoutCard}>
            <Text style={styles.checkoutName}>{attraction.name}</Text>
            <Text style={styles.checkoutCity}>📍 {attraction.city}</Text>
            <Text style={styles.checkoutHours}>🕙 {attraction.openingHours}</Text>
          </Card>

          <Text style={styles.checkoutSectionTitle}>🎟️ Number of Tickets</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setTicketQty(Math.max(1, ticketQty - 1))}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{ticketQty}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setTicketQty(Math.min(10, ticketQty + 1))}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <Card variant="elevated" style={styles.priceCard}>
            <Text style={styles.priceSectionTitle}>💰 Price Breakdown</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                {formatCurrency(attraction.price)} × {ticketQty}
              </Text>
              <Text style={styles.priceValue}>{formatCurrency(totalPrice)}</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(totalPrice)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.walletLabel}>Wallet Balance</Text>
              <Text style={[styles.walletValue, balance < totalPrice && { color: colors.error }]}>
                {formatCurrency(balance)}
              </Text>
            </View>
          </Card>

          <View style={{ height: 120 }} />
        </ScrollView>

        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.bottomQtyText}>
              {ticketQty} ticket{ticketQty > 1 ? 's' : ''}
            </Text>
            <Text style={styles.bottomTotalText}>{formatCurrency(totalPrice)}</Text>
          </View>
          <TouchableOpacity style={styles.purchaseBtn} onPress={handlePurchase}>
            <Text style={styles.purchaseBtnText}>Purchase →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Browse / Detail Screen ──
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Hero Image with overlay ───────────────────────────────── */}
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: attraction.images[0] }}
            style={styles.heroImg}
            contentFit="cover"
            transition={200}
          />

          {/* Top action bar: back / share / heart */}
          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.heroBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.heroBtnIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.heroActRight}>
              <TouchableOpacity style={styles.heroBtn}>
                <Text style={styles.heroBtnIcon}>⤴</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroBtn}>
                <Text style={styles.heroBtnIcon}>♡</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom overlay: name + city + rating chip */}
          <LinearGradient colors={['transparent', 'rgba(5,31,31,0.88)']} style={styles.heroOverlay}>
            <Text style={styles.heroName}>{attraction.name}</Text>
            <Text style={styles.heroCity}>{attraction.city}, Saudi Arabia</Text>
            <View style={styles.heroRatingChip}>
              <Text style={styles.heroRatingStar}>⭐</Text>
              <Text style={styles.heroRatingNum}>{attraction.rating.toFixed(1)}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* ── Tabs ─────────────────────────────────────────────────── */}
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
        >
          {TABS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, activeTab === t && styles.tabActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Photo Grid ───────────────────────────────────────────── */}
        <View style={styles.photoGrid}>
          <Image
            source={{ uri: attraction.images[1] ?? attraction.images[0] }}
            style={styles.photoLeft}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.photoRightCol}>
            <Image
              source={{ uri: attraction.images[2] ?? attraction.images[0] }}
              style={styles.photoSmall}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.photoMore}>
              <Text style={styles.photoMoreText}>10+</Text>
            </View>
          </View>
        </View>

        {/* ── Details ──────────────────────────────────────────────── */}
        <View style={styles.content}>
          <Text style={styles.detailsLabel}>DETAILS</Text>
          <Text style={styles.description} numberOfLines={expanded ? undefined : 4}>
            {attraction.description}
          </Text>
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text style={styles.readMore}>{expanded ? 'Show less' : 'Read More'}</Text>
          </TouchableOpacity>

          {/* Meta row */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📍</Text>
              <Text style={styles.metaText}>{attraction.city}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⭐</Text>
              <Text style={styles.metaText}>{attraction.rating.toFixed(1)} / 5</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>🕙</Text>
              <Text style={styles.metaText} numberOfLines={1}>
                {attraction.openingHours}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── Bottom Bar ───────────────────────────────────────────────── */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel2}>
            {attraction.price === 0 ? 'Free Entry' : 'Entry Fee'}
          </Text>
          <PriceBadge price={attraction.price} size="lg" />
        </View>
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueBtnText}>
            {attraction.price === 0 ? 'Get Directions →' : 'Buy Ticket →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PHOTO_H = 150;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Hero
  heroWrap: { width: '100%', height: 280 },
  heroImg: { width: '100%', height: '100%', backgroundColor: colors.pearl },
  heroActions: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  heroActRight: { flexDirection: 'row', gap: spacing.sm },
  heroBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  heroBtnIcon: { fontSize: 17, color: colors.charcoal },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: 60,
  },
  heroName: {
    fontSize: typography.sizes.xl,
    fontWeight: '800',
    color: colors.white,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroCity: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
  heroRatingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginTop: spacing.xs,
    gap: 4,
  },
  heroRatingStar: { fontSize: 13 },
  heroRatingNum: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.white },

  // Tabs
  tabRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.pearl,
  },
  tab: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md + 4,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.pearl,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.charcoal },
  tabTextActive: { color: colors.white },

  // Photo grid
  photoGrid: {
    flexDirection: 'row',
    height: PHOTO_H,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    gap: 4,
  },
  photoLeft: { width: '58%', height: '100%', backgroundColor: colors.pearl },
  photoRightCol: { flex: 1, gap: 4 },
  photoSmall: { flex: 1, backgroundColor: colors.pearl },
  photoMore: {
    height: 46,
    backgroundColor: 'rgba(5,31,31,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoMoreText: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.white },

  // Content
  content: { paddingHorizontal: spacing.md, paddingTop: spacing.lg },
  detailsLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.slate,
    marginBottom: spacing.xs,
  },
  description: { fontSize: typography.sizes.md, color: colors.slate, lineHeight: 23 },
  readMore: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.pearl,
    flexWrap: 'wrap',
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaIcon: { fontSize: 14 },
  metaText: { fontSize: typography.sizes.sm, color: colors.slate },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.pearl,
    ...shadows.lg,
  },
  priceLabel2: { fontSize: typography.sizes.xs, color: colors.slate, marginBottom: 4 },
  continueBtn: {
    backgroundColor: colors.primary,
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    ...shadows.md,
  },
  continueBtnText: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.white },

  // Checkout
  checkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 54,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.pearl,
    backgroundColor: colors.white,
  },
  checkoutBack: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.primary },
  checkoutTitle: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.charcoal },
  checkoutScroll: { padding: spacing.md },
  checkoutCard: { padding: spacing.md, marginBottom: spacing.lg },
  checkoutName: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.charcoal },
  checkoutCity: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 4 },
  checkoutHours: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 2 },
  checkoutSectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  qtyBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.pearl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 24, fontWeight: '700', color: colors.charcoal },
  qtyValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.charcoal,
    minWidth: 40,
    textAlign: 'center',
  },

  // Price breakdown
  priceCard: { padding: spacing.md },
  priceSectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  priceLabel: { fontSize: typography.sizes.sm, color: colors.slate },
  priceValue: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.charcoal },
  priceDivider: { height: 1, backgroundColor: colors.pearl, marginVertical: spacing.sm },
  totalLabel: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.charcoal },
  totalValue: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.primary },
  walletLabel: { fontSize: typography.sizes.sm, color: colors.slate },
  walletValue: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.success },

  bottomQtyText: { fontSize: typography.sizes.xs, color: colors.slate },
  bottomTotalText: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.charcoal },
  purchaseBtn: {
    backgroundColor: colors.primary,
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    ...shadows.md,
  },
  purchaseBtnText: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.white },

  // Success
  successContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  successIcon: { fontSize: 64, marginBottom: spacing.md },
  successTitle: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.charcoal },
  successCard: { marginTop: spacing.lg, padding: spacing.lg, width: '100%', alignItems: 'center' },
  successAttrName: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.charcoal },
  successDetail: { fontSize: typography.sizes.md, color: colors.slate, marginTop: spacing.xs },
  successDivider: {
    height: 1,
    backgroundColor: colors.pearl,
    width: '100%',
    marginVertical: spacing.sm,
  },
  successCode: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing.xs,
  },
  successTotal: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    marginTop: spacing.xs,
  },
  successButtons: { marginTop: spacing.xl, width: '100%', gap: spacing.sm },
});
