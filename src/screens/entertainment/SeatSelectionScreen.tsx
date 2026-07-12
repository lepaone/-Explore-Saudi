import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SEATS_PER_ROW = 10;

const generateSeats = () => {
  const taken = new Set<string>();
  for (let i = 0; i < 20; i++) {
    const row = ROWS[Math.floor(Math.random() * ROWS.length)];
    const seat = Math.floor(Math.random() * SEATS_PER_ROW) + 1;
    taken.add(`${row}${seat}`);
  }
  return taken;
};

const TAKEN = generateSeats();

export default function SeatSelectionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (seatId: string) => {
    if (TAKEN.has(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId],
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Select Seats" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Stage */}
        <View style={styles.stage}>
          <Text style={styles.stageText}>STAGE</Text>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.pearl }]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.sand }]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.slate }]} />
            <Text style={styles.legendText}>Taken</Text>
          </View>
        </View>

        {/* Seats */}
        <View style={styles.seatsContainer}>
          {ROWS.map((row) => (
            <View key={row} style={styles.seatRow}>
              <Text style={styles.rowLabel}>{row}</Text>
              {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                const seatId = `${row}${i + 1}`;
                const isTaken = TAKEN.has(seatId);
                const isSelected = selectedSeats.includes(seatId);
                return (
                  <TouchableOpacity
                    key={seatId}
                    style={[
                      styles.seat,
                      isTaken && styles.seatTaken,
                      isSelected && styles.seatSelected,
                    ]}
                    onPress={() => toggleSeat(seatId)}
                    disabled={isTaken}
                  >
                    <Text
                      style={[
                        styles.seatText,
                        isTaken && styles.seatTextTaken,
                        isSelected && styles.seatTextSelected,
                      ]}
                    >
                      {i + 1}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <Text style={styles.rowLabel}>{row}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        {selectedSeats.length > 0 && (
          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>Selected: {selectedSeats.join(', ')}</Text>
            <Text style={styles.summaryCount}>{selectedSeats.length} seat(s)</Text>
          </View>
        )}
      </ScrollView>

      {selectedSeats.length > 0 && (
        <View style={styles.bottomBar}>
          <Button
            title={`Continue with ${selectedSeats.length} seat(s)`}
            onPress={() =>
              navigation.navigate('TicketCheckout', {
                eventId: route.params?.eventId,
                ticketTypeId: 'custom',
                quantity: selectedSeats.length,
              })
            }
            size="lg"
            fullWidth
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: spacing.md, paddingBottom: 120 },
  stage: {
    backgroundColor: colors.charcoal,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginHorizontal: spacing.xl,
  },
  stageText: {
    color: colors.white,
    fontWeight: '700',
    letterSpacing: 4,
    fontSize: typography.sizes.sm,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 16, height: 16, borderRadius: 4 },
  legendText: { fontSize: typography.sizes.xs, color: colors.slate },
  seatsContainer: { alignItems: 'center' },
  seatRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  rowLabel: {
    width: 20,
    fontSize: typography.sizes.xs,
    color: colors.slate,
    fontWeight: '600',
    textAlign: 'center',
  },
  seat: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.pearl,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  seatTaken: { backgroundColor: colors.slate },
  seatSelected: { backgroundColor: colors.sand },
  seatText: { fontSize: 10, fontWeight: '600', color: colors.charcoal },
  seatTextTaken: { color: 'rgba(255,255,255,0.5)' },
  seatTextSelected: { color: colors.white },
  summary: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.pearl,
    borderRadius: borderRadius.md,
  },
  summaryLabel: { fontSize: typography.sizes.sm, color: colors.charcoal },
  summaryCount: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.sand,
    marginTop: 4,
  },
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
