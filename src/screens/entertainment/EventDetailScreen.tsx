import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ImageCarousel from '../../components/common/ImageCarousel';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import PriceBadge from '../../components/common/PriceBadge';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { entertainmentEvents } from '../../services/mockData/entertainment';
import { formatDate } from '../../utils/formatters';

export default function EventDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const event = entertainmentEvents.find((e) => e.id === route.params?.id);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  if (!event)
    return (
      <View style={styles.center}>
        <Text>Event not found</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageCarousel images={event.images} height={280} />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>{'\u2190'}</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.badgeRow}>
            {event.isTrending && <Badge text="Trending" variant="trending" />}
            {event.isSoldOut && <Badge text="Sold Out" variant="soldOut" />}
            <Badge text={event.type} variant="new" />
          </View>

          <Text style={styles.name}>{event.name}</Text>
          <Text style={styles.nameAr}>{event.nameAr}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>{'\uD83D\uDCCD'}</Text>
              <Text style={styles.infoLabel}>Venue</Text>
              <Text style={styles.infoValue}>{event.venue}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>{'\uD83D\uDCC5'}</Text>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{formatDate(event.date)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>{'\uD83C\uDFD9\uFE0F'}</Text>
              <Text style={styles.infoLabel}>City</Text>
              <Text style={styles.infoValue}>{event.city}</Text>
            </View>
          </View>

          <Text style={styles.description}>{event.description}</Text>

          {/* Ticket Selection */}
          <Text style={styles.sectionTitle}>Select Tickets</Text>
          {event.ticketTypes.map((ticket) => (
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
                    <Text style={styles.ticketAvail}>{ticket.available} available</Text>
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
            <PriceBadge
              price={event.ticketTypes.find((t) => t.id === selectedTicket)?.price ?? 0}
              size="lg"
            />
          </View>
          <Button
            title="Buy Ticket"
            onPress={() =>
              navigation.navigate('TicketCheckout', {
                eventId: event.id,
                ticketTypeId: selectedTicket,
                quantity: 1,
              })
            }
            size="lg"
          />
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
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  name: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.charcoal },
  nameAr: { fontSize: typography.sizes.md, color: colors.slate, marginTop: 4 },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.pearl,
  },
  infoItem: { alignItems: 'center', flex: 1 },
  infoIcon: { fontSize: 22, marginBottom: 4 },
  infoLabel: { fontSize: typography.sizes.xs, color: colors.slate },
  infoValue: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.charcoal,
    marginTop: 2,
    textAlign: 'center',
  },
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
  ticketAvail: { fontSize: typography.sizes.xs, color: colors.success, marginTop: 2 },
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
});
