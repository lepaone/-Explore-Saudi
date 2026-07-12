import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { colors, gradients, typography, spacing, borderRadius } from '../../constants/theme';
import { entertainmentEvents } from '../../services/mockData/entertainment';
import { useWalletStore } from '../../store/useWalletStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function TicketCheckoutScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { eventId, ticketTypeId, quantity } = route.params ?? {};
  const event = entertainmentEvents.find((e) => e.id === eventId);
  const ticket = event?.ticketTypes.find((t) => t.id === ticketTypeId);
  const { balance, addTransaction, addTicket } = useWalletStore();
  const user = useAuthStore((s) => s.user);
  const [success, setSuccess] = useState(false);

  const totalPrice = (ticket?.price ?? 0) * (quantity ?? 1);

  const handlePurchase = () => {
    if (balance < totalPrice) return;
    addTransaction({
      id: `txn_${Date.now()}`,
      type: 'payment',
      amount: -totalPrice,
      currency: 'SAR',
      description: event?.name ?? 'Event Ticket',
      date: new Date().toISOString(),
      category: 'entertainment',
      merchantLogo: 'https://img.icons8.com/color/48/ticket.png',
    });
    addTicket({
      id: `tkt_${Date.now()}`,
      eventName: event?.name ?? '',
      venue: event?.venue ?? '',
      date: event?.date ?? '',
      ticketType: ticket?.name ?? 'Standard',
      qrCode: `ES-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      status: 'active',
    });
    setSuccess(true);
  };

  if (success) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>{'\u2705'}</Text>
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successSub}>Your ticket has been added to your wallet</Text>
        <Card variant="elevated" style={styles.successCard}>
          <Text style={styles.successEvent}>{event?.name}</Text>
          <Text style={styles.successVenue}>{event?.venue}</Text>
          <Text style={styles.successDate}>{formatDate(event?.date ?? '')}</Text>
          <Text style={styles.successTicket}>
            {ticket?.name} x{quantity}
          </Text>
          <Text style={styles.successGuest}>
            {'\uD83D\uDC64'} {user?.name ?? 'Guest'}
          </Text>
          <Text style={styles.successDeducted}>
            {'\uD83D\uDCB3'} {formatCurrency(totalPrice)} deducted from wallet
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
            title="Back to Events"
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
      <Header title="Checkout" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Order Summary */}
        <Card variant="elevated" style={styles.orderCard}>
          <Text style={styles.orderTitle}>{event?.name}</Text>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Guest</Text>
            <Text style={styles.orderValue}>{user?.name ?? 'Guest'}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Venue</Text>
            <Text style={styles.orderValue}>{event?.venue}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Date</Text>
            <Text style={styles.orderValue}>{formatDate(event?.date ?? '')}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Ticket</Text>
            <Text style={styles.orderValue}>{ticket?.name}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Quantity</Text>
            <Text style={styles.orderValue}>{quantity}</Text>
          </View>
          <View style={[styles.orderRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalPrice)}</Text>
          </View>
        </Card>

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <Card variant="outlined" style={styles.paymentCard}>
          <LinearGradient colors={[...gradients.tealGradient]} style={styles.walletBadge}>
            <Text style={styles.walletIcon}>{'\uD83D\uDCB3'}</Text>
          </LinearGradient>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentName}>Explore Saudi Wallet</Text>
            <Text style={styles.paymentBalance}>Balance: {formatCurrency(balance)}</Text>
          </View>
          <View style={styles.radioOuter}>
            <View style={styles.radioInner} />
          </View>
        </Card>

        {balance < totalPrice && (
          <Text style={styles.insufficientText}>
            Insufficient balance. Please top up your wallet.
          </Text>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          title={`Pay ${formatCurrency(totalPrice)}`}
          onPress={handlePurchase}
          size="lg"
          fullWidth
          disabled={balance < totalPrice}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: spacing.md, paddingBottom: 120 },
  orderCard: { padding: spacing.md },
  orderTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.pearl,
  },
  orderLabel: { fontSize: typography.sizes.sm, color: colors.slate },
  orderValue: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.charcoal },
  totalRow: { borderBottomWidth: 0, paddingTop: spacing.md },
  totalLabel: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.charcoal },
  totalValue: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.sand },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  walletBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletIcon: { fontSize: 22 },
  paymentInfo: { flex: 1, marginLeft: spacing.sm },
  paymentName: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  paymentBalance: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 2 },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.sand },
  insufficientText: { fontSize: typography.sizes.sm, color: colors.error, marginTop: spacing.sm },
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
  successSub: { fontSize: typography.sizes.md, color: colors.slate, marginTop: spacing.xs },
  successCard: { marginTop: spacing.lg, padding: spacing.lg, width: '100%', alignItems: 'center' },
  successEvent: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    textAlign: 'center',
  },
  successVenue: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 4 },
  successDate: {
    fontSize: typography.sizes.sm,
    color: colors.sand,
    fontWeight: '600',
    marginTop: 4,
  },
  successTicket: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 4 },
  successGuest: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.charcoal,
    marginTop: spacing.sm,
  },
  successDeducted: {
    fontSize: typography.sizes.sm,
    color: colors.sand,
    fontWeight: '600',
    marginTop: 4,
  },
  successButtons: { marginTop: spacing.xl, width: '100%', gap: spacing.sm },
});
