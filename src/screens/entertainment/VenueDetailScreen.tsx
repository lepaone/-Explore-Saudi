import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ImageCarousel from '../../components/common/ImageCarousel';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import PriceBadge from '../../components/common/PriceBadge';
import RatingStars from '../../components/common/RatingStars';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { entertainmentVenues } from '../../services/mockData/entertainment';
import { useWalletStore } from '../../store/useWalletStore';
import { formatCurrency } from '../../utils/formatters';

export default function VenueDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const venue = entertainmentVenues.find((v) => v.id === route.params?.id);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const { balance, addTransaction, addTicket } = useWalletStore();

  if (!venue)
    return (
      <View style={styles.center}>
        <Text>Venue not found</Text>
      </View>
    );

  const selectedTicketData = venue.ticketTypes.find((t) => t.id === selectedTicket);
  const selectedPrice = selectedTicketData?.price ?? 0;

  const handlePurchase = () => {
    if (balance < selectedPrice) {
      Alert.alert(
        'Insufficient Balance',
        `You need ${formatCurrency(selectedPrice)} but your balance is ${formatCurrency(balance)}.\n\nPlease top up your wallet first.`,
        [{ text: 'OK' }],
      );
      return;
    }
    addTransaction({
      id: `txn_${Date.now()}`,
      type: 'payment',
      amount: -selectedPrice,
      currency: 'SAR',
      description: `${venue.name} - ${selectedTicketData?.name}`,
      date: new Date().toISOString(),
      category: 'entertainment',
      merchantLogo: '',
    });
    addTicket({
      id: `tkt_${Date.now()}`,
      eventName: venue.name,
      venue: venue.city,
      date: new Date().toISOString(),
      ticketType: selectedTicketData?.name ?? 'Standard',
      qrCode: `ES-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      status: 'active',
    });
    setBooked(true);
  };

  if (booked) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>{'\u2705'}</Text>
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successSub}>Your ticket has been added to your wallet</Text>
        <Card variant="elevated" style={styles.successCard}>
          <Text style={styles.successEvent}>{venue.name}</Text>
          <Text style={styles.successVenue}>{venue.city}</Text>
          <Text style={styles.successTicket}>
            {selectedTicketData?.name} - {formatCurrency(selectedPrice)}
          </Text>
        </Card>
        <View style={styles.successButtons}>
          <Button
            title="View My Tickets"
            onPress={() =>
              navigation.getParent()?.getParent()?.navigate('WalletTab', { screen: 'MyTickets' })
            }
            fullWidth
          />
          <Button
            title="Back to Entertainment"
            onPress={() => navigation.navigate('Entertainment')}
            variant="outline"
            fullWidth
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageCarousel images={venue.images} height={280} />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>{'\u2190'}</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.name}>{venue.name}</Text>
          <Text style={styles.nameAr}>{venue.nameAr}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>
              {'\uD83D\uDCCD'} {venue.city}
            </Text>
            <Text style={styles.metaItem}>
              {'\uD83D\uDD52'} {venue.openingHours}
            </Text>
          </View>

          <View style={styles.ratingRow}>
            <RatingStars rating={venue.rating} />
            <Text style={styles.ratingNum}>{venue.rating.toFixed(1)} out of 5</Text>
          </View>

          <Text style={styles.description}>{venue.description}</Text>

          {/* Features */}
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureGrid}>
            {venue.features.map((f) => (
              <View key={f} style={styles.featureTag}>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          {/* Tickets */}
          <Text style={styles.sectionTitle}>Tickets</Text>
          {venue.ticketTypes.map((ticket) => (
            <TouchableOpacity key={ticket.id} onPress={() => setSelectedTicket(ticket.id)}>
              <Card
                variant={selectedTicket === ticket.id ? 'elevated' : 'outlined'}
                style={[
                  styles.ticketCard,
                  selectedTicket === ticket.id && styles.ticketCardSelected,
                ]}
              >
                <View style={styles.ticketRow}>
                  <View style={styles.ticketRadio}>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedTicket === ticket.id && styles.radioOuterActive,
                      ]}
                    >
                      {selectedTicket === ticket.id && <View style={styles.radioInner} />}
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.ticketName}>{ticket.name}</Text>
                    <Text style={styles.ticketDesc}>{ticket.description}</Text>
                  </View>
                  <PriceBadge price={ticket.price} size="md" />
                </View>
              </Card>
            </TouchableOpacity>
          ))}

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      {selectedTicket && (
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.bottomLabel}>Total</Text>
            <PriceBadge price={selectedPrice} size="lg" />
          </View>
          <Button title="Buy Ticket" onPress={handlePurchase} size="lg" />
        </View>
      )}
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
  metaRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
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
  ratingRow: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.pearl,
  },
  ratingNum: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 4 },
  ticketCard: { marginBottom: spacing.sm, padding: spacing.md },
  ticketCardSelected: { borderColor: colors.sand, borderWidth: 2 },
  ticketRow: { flexDirection: 'row', alignItems: 'center' },
  ticketRadio: { marginRight: spacing.sm },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.pearl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: { borderColor: colors.sand },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.sand },
  ticketName: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  ticketDesc: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 2 },
  ticketRight: { alignItems: 'flex-end', gap: spacing.sm },
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
  bottomLabel: { fontSize: typography.sizes.xs, color: colors.slate, marginBottom: 4 },
  successContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  successIcon: { fontSize: 64, marginBottom: spacing.md },
  successTitle: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.charcoal },
  successSub: { fontSize: typography.sizes.md, color: colors.slate, marginTop: spacing.xs },
  successCard: { marginTop: spacing.lg, padding: spacing.lg, width: '100%', alignItems: 'center' },
  successEvent: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    textAlign: 'center',
  },
  successVenue: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 4 },
  successTicket: {
    fontSize: typography.sizes.sm,
    color: colors.sand,
    fontWeight: '600',
    marginTop: 4,
  },
  successButtons: { marginTop: spacing.xl, width: '100%', gap: spacing.sm },
});
