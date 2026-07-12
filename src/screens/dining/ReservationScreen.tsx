import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { restaurants } from '../../services/mockData/restaurants';
import { useAuthStore } from '../../store/useAuthStore';

const TIME_SLOTS = [
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
  '9:30 PM',
];
const PARTY_SIZES = [1, 2, 3, 4, 5, 6, 7, 8];

export default function ReservationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const restaurant = restaurants.find((r) => r.id === route.params?.restaurantId);
  const user = useAuthStore((s) => s.user);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [partySize, setPartySize] = useState(2);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const toggleRequest = (req: string) => {
    setSelectedRequests((prev) =>
      prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req],
    );
  };

  if (!restaurant)
    return (
      <View style={styles.center}>
        <Text>Restaurant not found</Text>
      </View>
    );

  if (confirmed) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>{'\u2705'}</Text>
        <Text style={styles.successTitle}>Reservation Confirmed!</Text>
        <Card variant="elevated" style={styles.successCard}>
          <Text style={styles.successRestaurant}>{restaurant.name}</Text>
          <Text style={styles.successDetail}>
            {'\uD83D\uDC64'} {user?.name ?? 'Guest'}
          </Text>
          <Text style={styles.successDetail}>{'\uD83D\uDCC5'} Today</Text>
          <Text style={styles.successDetail}>
            {'\uD83D\uDD52'} {selectedTime}
          </Text>
          <Text style={styles.successDetail}>
            {'\uD83D\uDC65'} Party of {partySize}
          </Text>
          {selectedRequests.length > 0 && (
            <Text style={styles.successDetail}>
              {'\u2728'} {selectedRequests.join(', ')}
            </Text>
          )}
        </Card>
        <View style={styles.successButtons}>
          <Button title="Back to Restaurant" onPress={() => navigation.goBack()} fullWidth />
          <Button
            title="Back to Dining"
            onPress={() => navigation.navigate('Dining')}
            variant="outline"
            fullWidth
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Reserve a Table" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card variant="outlined" style={styles.restaurantCard}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantCuisine}>
            {restaurant.cuisine} - {restaurant.city}
          </Text>
        </Card>

        {/* Party Size */}
        <Text style={styles.sectionTitle}>Party Size</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.sizeRow}>
            {PARTY_SIZES.map((size) => (
              <TouchableOpacity
                key={size}
                style={[styles.sizeBtn, partySize === size && styles.sizeBtnActive]}
                onPress={() => setPartySize(size)}
              >
                <Text style={[styles.sizeText, partySize === size && styles.sizeTextActive]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Time Slots */}
        <Text style={styles.sectionTitle}>Available Times</Text>
        <View style={styles.timeGrid}>
          {TIME_SLOTS.map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.timeSlot, selectedTime === time && styles.timeSlotActive]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[styles.timeText, selectedTime === time && styles.timeTextActive]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Special Requests */}
        <Text style={styles.sectionTitle}>Special Requests</Text>
        <View style={styles.requestGrid}>
          {[
            'Window Seat',
            'High Chair',
            'Birthday Setup',
            'Quiet Area',
            'Outdoor',
            'Wheelchair Access',
          ].map((req) => (
            <TouchableOpacity
              key={req}
              style={[
                styles.requestChip,
                selectedRequests.includes(req) && styles.requestChipActive,
              ]}
              onPress={() => toggleRequest(req)}
            >
              <Text
                style={[
                  styles.requestText,
                  selectedRequests.includes(req) && styles.requestTextActive,
                ]}
              >
                {req}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          title="Confirm Reservation"
          onPress={() => setConfirmed(true)}
          size="lg"
          fullWidth
          disabled={!selectedTime}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: spacing.md, paddingBottom: 120 },
  restaurantCard: { padding: spacing.md, marginBottom: spacing.lg },
  restaurantName: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.charcoal },
  restaurantCuisine: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 4 },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  sizeRow: { flexDirection: 'row', gap: spacing.sm },
  sizeBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.pearl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeBtnActive: { backgroundColor: colors.sand },
  sizeText: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  sizeTextActive: { color: colors.white },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  timeSlot: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.pearl,
  },
  timeSlotActive: { backgroundColor: colors.sand },
  timeText: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.charcoal },
  timeTextActive: { color: colors.white },
  requestGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  requestChip: {
    paddingVertical: spacing.xs + 4,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.pearl,
  },
  requestChipActive: { backgroundColor: colors.sand, borderColor: colors.sand },
  requestText: { fontSize: typography.sizes.sm, color: colors.slate },
  requestTextActive: { color: colors.white },
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
  successRestaurant: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.charcoal },
  successDetail: { fontSize: typography.sizes.md, color: colors.slate, marginTop: spacing.xs },
  successButtons: { marginTop: spacing.xl, width: '100%', gap: spacing.sm },
});
