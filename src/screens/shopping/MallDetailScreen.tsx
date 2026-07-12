import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ImageCarousel from '../../components/common/ImageCarousel';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { malls } from '../../services/mockData/shopping';

export default function MallDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const mall = malls.find((m) => m.id === route.params?.id);

  if (!mall)
    return (
      <View style={styles.center}>
        <Text>Mall not found</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageCarousel images={mall.images} height={280} />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>{'\u2190'}</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.name}>{mall.name}</Text>
          <Text style={styles.nameAr}>{mall.nameAr}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>
              {'\uD83D\uDCCD'} {mall.city}
            </Text>
            <Text style={styles.metaItem}>
              {'\uD83D\uDD52'} {mall.openingHours}
            </Text>
            <Text style={styles.metaItem}>
              {'\uD83C\uDFEA'} {mall.storeCount}+ stores
            </Text>
          </View>

          <Text style={styles.description}>{mall.description}</Text>

          {/* Features */}
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureGrid}>
            {mall.features.map((f) => (
              <View key={f} style={styles.featureTag}>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          {/* Promotions */}
          {mall.promotions.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Current Promotions</Text>
              {mall.promotions.map((promo, idx) => (
                <Card key={idx} variant="elevated" style={styles.promoCard}>
                  <Badge text="Sale" variant="discount" />
                  <Text style={styles.promoTitle}>{promo.title}</Text>
                  <Text style={styles.promoDiscount}>{promo.discount}</Text>
                  <Text style={styles.promoValid}>Valid until {promo.validUntil}</Text>
                </Card>
              ))}
            </View>
          )}

          {/* Location */}
          <Text style={styles.sectionTitle}>Location</Text>
          <Card variant="outlined" style={styles.locationCard}>
            <Text style={styles.locationIcon}>{'\uD83D\uDDFA\uFE0F'}</Text>
            <View>
              <Text style={styles.locationName}>{mall.city}, Saudi Arabia</Text>
              <Text style={styles.locationCoords}>
                {mall.latitude.toFixed(4)}, {mall.longitude.toFixed(4)}
              </Text>
            </View>
          </Card>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  backIcon: { fontSize: 20, color: colors.charcoal },
  content: { padding: spacing.md },
  name: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.charcoal },
  nameAr: { fontSize: typography.sizes.md, color: colors.slate, marginTop: 4 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.md },
  metaItem: { fontSize: typography.sizes.sm, color: colors.slate },
  description: {
    fontSize: typography.sizes.md,
    color: colors.slate,
    lineHeight: 24,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  featureTag: {
    backgroundColor: colors.pearl,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  featureText: { fontSize: typography.sizes.sm, color: colors.charcoal },
  promoCard: { padding: spacing.md, marginBottom: spacing.sm },
  promoTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.charcoal,
    marginTop: spacing.sm,
  },
  promoDiscount: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.sand,
    marginTop: 4,
  },
  promoValid: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 4 },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  locationIcon: { fontSize: 28 },
  locationName: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  locationCoords: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 2 },
});
