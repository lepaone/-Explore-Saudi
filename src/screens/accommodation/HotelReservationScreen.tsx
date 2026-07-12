import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import PriceBadge from '../../components/common/PriceBadge';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { hotels } from '../../services/mockData/hotels';
import { useWalletStore } from '../../store/useWalletStore';
import { useBookingStore } from '../../store/useBookingStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatCurrency } from '../../utils/formatters';

const GUEST_COUNTS = [1, 2, 3, 4, 5, 6];
const SPECIAL_REQUESTS = [
  'Early Check-in',
  'Late Check-out',
  'Extra Bed',
  'Airport Transfer',
  'High Floor',
  'Non-Smoking',
  'Quiet Room',
  'Baby Crib',
];

// Generate date options for the next 30 days
function getDateOptions(startOffset = 0, count = 14): { label: string; value: string }[] {
  const options = [];
  for (let i = startOffset; i < startOffset + count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const value = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    });
    options.push({ label, value });
  }
  return options;
}

export default function HotelReservationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { hotelId, roomName } = route.params ?? {};
  const hotel = hotels.find((h) => h.id === hotelId);
  const room = hotel?.roomTypes.find((r) => r.name === roomName);
  const user = useAuthStore((s) => s.user);
  const { balance, addTransaction } = useWalletStore();
  const { addBooking } = useBookingStore();

  const [checkInDate, setCheckInDate] = useState<string | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const checkInOptions = useMemo(() => getDateOptions(1, 14), []);
  const checkOutOptions = useMemo(() => {
    if (!checkInDate) return getDateOptions(2, 14);
    const checkInIdx = checkInOptions.findIndex((d) => d.value === checkInDate);
    return getDateOptions(checkInIdx + 2, 14);
  }, [checkInDate]);

  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 0;
    const diff = new Date(checkOutDate).getTime() - new Date(checkInDate).getTime();
    return Math.max(1, Math.ceil(diff / 86400000));
  }, [checkInDate, checkOutDate]);

  const pricePerNight = room?.price ?? hotel?.pricePerNight ?? 0;
  const totalPrice = pricePerNight * nights;

  const toggleRequest = (req: string) => {
    setSelectedRequests((prev) =>
      prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req],
    );
  };

  const handleConfirm = () => {
    if (balance < totalPrice) {
      Alert.alert(
        'Insufficient Balance',
        `You need ${formatCurrency(totalPrice)} but your balance is ${formatCurrency(balance)}.\n\nPlease top up your wallet first.`,
        [{ text: 'OK' }],
      );
      return;
    }

    const code = `${hotel!.name.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setConfirmationCode(code);

    addTransaction({
      id: `txn_${Date.now()}`,
      type: 'payment',
      amount: -totalPrice,
      currency: 'SAR',
      description: `${hotel!.name} - ${roomName} (${nights} nights)`,
      date: new Date().toISOString(),
      category: 'accommodation',
      merchantLogo: '',
    });

    addBooking({
      id: `bk_${Date.now()}`,
      hotelName: hotel!.name,
      roomType: roomName,
      checkIn: checkInDate!,
      checkOut: checkOutDate!,
      guestName: user?.name ?? 'Guest',
      confirmationCode: code,
      status: 'upcoming',
    });

    setConfirmed(true);
    setAssignedRoom(generatedRoom);
  };

  // Generate a room number based on special requests (floor preference)
  const [assignedRoom, setAssignedRoom] = useState('');
  const generatedRoom = useMemo(() => {
    const floor = selectedRequests.includes('High Floor')
      ? Math.floor(8 + Math.random() * 5)
      : Math.floor(2 + Math.random() * 6);
    const unit = Math.floor(1 + Math.random() * 20)
      .toString()
      .padStart(2, '0');
    return `${floor}${unit}`;
  }, [selectedRequests]);

  if (!hotel || !room) {
    return (
      <View style={styles.center}>
        <Text>Hotel or room not found</Text>
      </View>
    );
  }

  // Success confirmation screen
  if (confirmed) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Card variant="elevated" style={styles.successCard}>
          <Text style={styles.successHotel}>{hotel.name}</Text>
          <Text style={styles.successDetail}>👤 {user?.name ?? 'Guest'}</Text>
          <Text style={styles.successDetail}>
            🏨 {roomName} • Room {assignedRoom}
          </Text>
          <Text style={styles.successDetail}>
            📅 {checkInDate} → {checkOutDate}
          </Text>
          <Text style={styles.successDetail}>
            🌙 {nights} night{nights > 1 ? 's' : ''}
          </Text>
          <Text style={styles.successDetail}>
            👥 {guests} guest{guests > 1 ? 's' : ''}
          </Text>
          {selectedRequests.length > 0 && (
            <Text style={styles.successDetail}>✨ {selectedRequests.join(', ')}</Text>
          )}
          <View style={styles.successDivider} />
          <Text style={styles.successCode}>Confirmation: {confirmationCode}</Text>
          <Text style={styles.successTotal}>Total: {formatCurrency(totalPrice)}</Text>
        </Card>
        <View style={styles.successButtons}>
          <Button
            title="🏨 Digital Check-In"
            onPress={() =>
              navigation.navigate('DigitalCheckIn', {
                hotelName: hotel.name,
                roomNumber: assignedRoom,
                checkIn: checkInDate,
                checkOut: checkOutDate,
              })
            }
            fullWidth
          />
          <Button
            title="Back to Hotel"
            onPress={() => navigation.navigate('HotelDetail', { id: hotel.id })}
            variant="outline"
            fullWidth
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Reserve Hotel" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hotel & Room Summary */}
        <Card variant="outlined" style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryHotel}>{hotel.name}</Text>
              <Text style={styles.summarySub}>📍 {hotel.city}</Text>
              <View style={styles.summaryStars}>
                {Array.from({ length: hotel.stars }, (_, i) => (
                  <Text key={i} style={styles.summaryStar}>
                    {'\u2605'}
                  </Text>
                ))}
              </View>
            </View>
            <View style={styles.summaryPriceWrap}>
              <PriceBadge price={pricePerNight} size="md" />
              <Text style={styles.summaryPerNight}>per night</Text>
            </View>
          </View>
          <View style={styles.roomBadge}>
            <Text style={styles.roomBadgeText}>🛏️ {roomName}</Text>
            <Text style={styles.roomCapacity}>Up to {room.capacity} guests</Text>
          </View>
        </Card>

        {/* Check-in Date */}
        <Text style={styles.sectionTitle}>📅 Check-in Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.dateRow}>
            {checkInOptions.map((d) => (
              <TouchableOpacity
                key={d.value}
                style={[styles.dateChip, checkInDate === d.value && styles.dateChipActive]}
                onPress={() => {
                  setCheckInDate(d.value);
                  // Reset checkout if it's before new checkin
                  if (checkOutDate && checkOutDate <= d.value) setCheckOutDate(null);
                }}
              >
                <Text style={[styles.dateText, checkInDate === d.value && styles.dateTextActive]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Check-out Date */}
        <Text style={styles.sectionTitle}>📅 Check-out Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.dateRow}>
            {checkOutOptions.map((d) => (
              <TouchableOpacity
                key={d.value}
                style={[styles.dateChip, checkOutDate === d.value && styles.dateChipActive]}
                onPress={() => setCheckOutDate(d.value)}
              >
                <Text style={[styles.dateText, checkOutDate === d.value && styles.dateTextActive]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Number of Guests */}
        <Text style={styles.sectionTitle}>👥 Number of Guests</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.guestRow}>
            {GUEST_COUNTS.map((size) => (
              <TouchableOpacity
                key={size}
                style={[styles.guestBtn, guests === size && styles.guestBtnActive]}
                onPress={() => setGuests(size)}
              >
                <Text style={[styles.guestText, guests === size && styles.guestTextActive]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Special Requests */}
        <Text style={styles.sectionTitle}>✨ Special Requests</Text>
        <View style={styles.requestGrid}>
          {SPECIAL_REQUESTS.map((req) => (
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

        {/* Booking Summary */}
        {checkInDate && checkOutDate && nights > 0 && (
          <Card variant="elevated" style={styles.priceCard}>
            <Text style={styles.priceTitle}>💰 Price Breakdown</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                {formatCurrency(pricePerNight)} × {nights} night{nights > 1 ? 's' : ''}
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
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View>
          {nights > 0 ? (
            <>
              <Text style={styles.bottomNights}>
                {nights} night{nights > 1 ? 's' : ''}
              </Text>
              <Text style={styles.bottomTotal}>{formatCurrency(totalPrice)}</Text>
            </>
          ) : (
            <Text style={styles.bottomPrompt}>Select dates</Text>
          )}
        </View>
        <Button
          title="Confirm & Pay"
          onPress={handleConfirm}
          size="lg"
          disabled={!checkInDate || !checkOutDate || nights < 1}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: spacing.md, paddingBottom: 120 },

  // Summary card
  summaryCard: { padding: spacing.md, marginBottom: spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  summaryInfo: { flex: 1, marginRight: spacing.sm },
  summaryHotel: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.charcoal },
  summarySub: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 4 },
  summaryStars: { flexDirection: 'row', marginTop: 4 },
  summaryStar: { fontSize: 14, color: colors.sand },
  summaryPriceWrap: { alignItems: 'flex-end' },
  summaryPerNight: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 2 },
  roomBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.pearl,
  },
  roomBadgeText: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  roomCapacity: { fontSize: typography.sizes.xs, color: colors.slate },

  // Section title
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },

  // Date selection
  dateRow: { flexDirection: 'row', gap: spacing.sm, paddingBottom: spacing.xs },
  dateChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.pearl,
  },
  dateChipActive: { backgroundColor: colors.sand },
  dateText: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.charcoal },
  dateTextActive: { color: colors.white },

  // Guest count
  guestRow: { flexDirection: 'row', gap: spacing.sm },
  guestBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.pearl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestBtnActive: { backgroundColor: colors.sand },
  guestText: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  guestTextActive: { color: colors.white },

  // Special requests
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

  // Price card
  priceCard: { padding: spacing.md, marginTop: spacing.lg },
  priceTitle: {
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
    ...shadows.large,
  },
  bottomNights: { fontSize: typography.sizes.xs, color: colors.slate },
  bottomTotal: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.charcoal },
  bottomPrompt: { fontSize: typography.sizes.sm, color: colors.slate },

  // Success screen
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
  successHotel: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.charcoal },
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
