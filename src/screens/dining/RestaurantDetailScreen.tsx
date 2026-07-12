import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation, useRoute } from '@react-navigation/native';
import ImageCarousel from '../../components/common/ImageCarousel';
import Button from '../../components/common/Button';
import RatingStars from '../../components/common/RatingStars';
import Card from '../../components/common/Card';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { restaurants } from '../../services/mockData/restaurants';
import { formatCurrency } from '../../utils/formatters';

export default function RestaurantDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const restaurant = restaurants.find((r) => r.id === route.params?.id);

  if (!restaurant)
    return (
      <View style={styles.center}>
        <Text>Restaurant not found</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageCarousel images={restaurant.images} height={280} />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>{'\u2190'}</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{restaurant.name}</Text>
              <Text style={styles.nameAr}>{restaurant.nameAr}</Text>
            </View>
            {restaurant.isOpen && (
              <View style={styles.openBadge}>
                <Text style={styles.openText}>Open</Text>
              </View>
            )}
          </View>

          <Text style={styles.cuisine}>
            {restaurant.cuisine} - {restaurant.city}
          </Text>

          <View style={styles.metaRow}>
            <RatingStars rating={restaurant.rating} showCount count={restaurant.reviewCount} />
            <Text style={styles.priceRange}>{'$'.repeat(restaurant.priceRange)}</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>{'\uD83D\uDD52'}</Text>
              <Text style={styles.infoText}>Wait: {restaurant.waitTime}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>{'\uD83C\uDF7D\uFE0F'}</Text>
              <Text style={styles.infoText}>{restaurant.cuisine}</Text>
            </View>
          </View>

          {/* Dietary Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dietary Options</Text>
            <View style={styles.tagRow}>
              {restaurant.dietaryOptions.map((opt) => (
                <View key={opt} style={styles.tag}>
                  <Text style={styles.tagText}>{opt}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Menu Highlights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Menu Highlights</Text>
            {restaurant.menuHighlights.map((item, idx) => (
              <Card key={idx} variant="outlined" style={styles.menuCard}>
                <View style={styles.menuRow}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.menuImage}
                    contentFit="cover"
                    transition={200}
                  />
                  <View style={styles.menuInfo}>
                    <Text style={styles.menuName}>{item.name}</Text>
                    <Text style={styles.menuDesc} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <Text style={styles.menuPrice}>{formatCurrency(item.price)}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          title="Reserve a Table"
          onPress={() => navigation.navigate('Reservation', { restaurantId: restaurant.id })}
          size="lg"
          fullWidth
        />
      </View>
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
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  name: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.charcoal },
  nameAr: { fontSize: typography.sizes.md, color: colors.slate, marginTop: 4 },
  openBadge: {
    backgroundColor: colors.success,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  openText: { color: colors.white, fontWeight: '600', fontSize: typography.sizes.xs },
  cuisine: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: spacing.sm },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  priceRange: { fontSize: typography.sizes.lg, color: colors.sand, fontWeight: '700' },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.pearl,
  },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  infoIcon: { fontSize: 18 },
  infoText: { fontSize: typography.sizes.sm, color: colors.slate },
  section: { marginTop: spacing.lg },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: {
    backgroundColor: colors.pearl,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  tagText: { fontSize: typography.sizes.sm, color: colors.charcoal },
  menuCard: { marginBottom: spacing.sm, padding: spacing.sm },
  menuRow: { flexDirection: 'row' },
  menuImage: { width: 80, height: 80, borderRadius: borderRadius.md },
  menuInfo: { flex: 1, marginLeft: spacing.sm, justifyContent: 'center' },
  menuName: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  menuDesc: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 2 },
  menuPrice: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.sand, marginTop: 4 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.pearl,
  },
});
