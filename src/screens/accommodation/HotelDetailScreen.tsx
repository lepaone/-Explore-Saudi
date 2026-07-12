import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ImageCarousel from '../../components/common/ImageCarousel';
import Button from '../../components/common/Button';
import RatingStars from '../../components/common/RatingStars';
import Card from '../../components/common/Card';
import PriceBadge from '../../components/common/PriceBadge';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { hotels } from '../../services/mockData/hotels';
import { useWalletStore } from '../../store/useWalletStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatCurrency } from '../../utils/formatters';

export default function HotelDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const hotel = hotels.find((h) => h.id === route.params?.id);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const { balance, addTransaction } = useWalletStore();
  const user = useAuthStore((s) => s.user);

  if (!hotel)
    return (
      <View style={styles.center}>
        <Text>Hotel not found</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageCarousel images={hotel.images} height={300} autoPlay />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>{'\u2190'}</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.starsRow}>
            {Array.from({ length: hotel.stars }, (_, i) => (
              <Text key={i} style={styles.star}>
                {'\u2605'}
              </Text>
            ))}
          </View>
          <Text style={styles.name}>{hotel.name}</Text>
          <Text style={styles.nameAr}>{hotel.nameAr}</Text>
          <Text style={styles.city}>
            {'\uD83D\uDCCD'} {hotel.city}
          </Text>

          <View style={styles.ratingRow}>
            <RatingStars rating={hotel.rating} showCount count={hotel.reviewCount} />
          </View>

          <Text style={styles.description}>{hotel.description}</Text>

          {/* Amenities */}
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenityGrid}>
            {hotel.amenities.map((a) => (
              <View key={a} style={styles.amenityTag}>
                <Text style={styles.amenityText}>{a}</Text>
              </View>
            ))}
          </View>

          {/* Room Types */}
          <Text style={styles.sectionTitle}>Room Types</Text>
          {hotel.roomTypes.map((room) => (
            <TouchableOpacity key={room.name} onPress={() => setSelectedRoom(room.name)}>
              <Card
                variant={selectedRoom === room.name ? 'elevated' : 'outlined'}
                style={[styles.roomCard, selectedRoom === room.name && styles.roomCardSelected]}
              >
                <View style={styles.roomHeader}>
                  <Text style={styles.roomName}>{room.name}</Text>
                  <PriceBadge price={room.price} size="md" />
                </View>
                <Text style={styles.roomCapacity}>
                  {'\uD83D\uDC65'} Up to {room.capacity} guests
                </Text>
                <View style={styles.roomAmenities}>
                  {room.amenities.map((a) => (
                    <Text key={a} style={styles.roomAmenity}>
                      {'\u2022'} {a}
                    </Text>
                  ))}
                </View>
                <Text style={styles.perNight}>per night</Text>
              </Card>
            </TouchableOpacity>
          ))}

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>From</Text>
          <PriceBadge price={hotel.pricePerNight} size="lg" />
          <Text style={styles.bottomPerNight}>per night</Text>
        </View>
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.checkInBtn}
            onPress={() => {
              const floor = Math.floor(2 + Math.random() * 10);
              const unit = Math.floor(1 + Math.random() * 20)
                .toString()
                .padStart(2, '0');
              const today = new Date();
              const checkIn = today.toISOString().split('T')[0];
              const out = new Date(today);
              out.setDate(out.getDate() + 3);
              const checkOut = out.toISOString().split('T')[0];
              navigation.navigate('DigitalCheckIn', {
                hotelName: hotel.name,
                roomNumber: `${floor}${unit}`,
                checkIn,
                checkOut,
              });
            }}
          >
            <Text style={styles.checkInBtnText}>🏨 Check In</Text>
          </TouchableOpacity>
          <Button
            title="Book Now"
            onPress={() => {
              navigation.navigate('HotelReservation', {
                hotelId: hotel.id,
                roomName: selectedRoom,
              });
            }}
            size="lg"
            disabled={!selectedRoom}
          />
        </View>
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
  starsRow: { flexDirection: 'row', marginBottom: 4 },
  star: { fontSize: 16, color: colors.sand },
  name: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.charcoal },
  nameAr: { fontSize: typography.sizes.md, color: colors.slate, marginTop: 4 },
  city: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: spacing.sm },
  ratingRow: { marginTop: spacing.sm },
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
  amenityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  amenityTag: {
    backgroundColor: colors.pearl,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  amenityText: { fontSize: typography.sizes.sm, color: colors.charcoal },
  roomCard: { marginBottom: spacing.sm, padding: spacing.md },
  roomCardSelected: { borderColor: colors.sand, borderWidth: 2 },
  roomHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  roomName: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  roomCapacity: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: spacing.xs },
  roomAmenities: { marginTop: spacing.sm },
  roomAmenity: { fontSize: typography.sizes.xs, color: colors.slate, lineHeight: 20 },
  perNight: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 4 },
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
    ...shadows.large,
  },
  bottomLabel: { fontSize: typography.sizes.xs, color: colors.slate },
  bottomPerNight: { fontSize: typography.sizes.xs, color: colors.slate },
  bottomActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  checkInBtn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInBtnText: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.primary },
});
