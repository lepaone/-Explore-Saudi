import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import GradientCard from '../../components/common/GradientCard';
import { colors, gradients, typography, spacing, borderRadius } from '../../constants/theme';
import { useWalletStore } from '../../store/useWalletStore';
import { formatCurrency, getTimeAgo } from '../../utils/formatters';

const WALLET_ACTIONS = [
  { id: '1', icon: '🪪', label: 'Digital ID', route: 'DigitalID' },
  { id: '2', icon: '💳', label: 'Pay', route: 'Payment' },
  { id: '3', icon: '💱', label: 'Exchange', route: 'CurrencyExchange' },
  { id: '4', icon: '📊', label: 'Expenses', route: 'ExpenseTracker' },
  { id: '5', icon: '🎫', label: 'Loyalty', route: 'LoyaltyCards' },
  { id: '6', icon: '🎟️', label: 'Tickets', route: 'MyTickets' },
];

export default function WalletDashboardScreen() {
  const navigation = useNavigation<any>();
  const { balance, currency, getRecentTransactions } = useWalletStore();
  const recentTxns = getRecentTransactions(5);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <GradientCard colors={[...gradients.nightGradient]} style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(balance, currency)}</Text>
          <View style={styles.balanceActions}>
            <TouchableOpacity
              style={styles.balanceBtn}
              onPress={() =>
                Alert.alert('Top Up', 'SAR 1,000 has been added to your wallet.', [{ text: 'OK' }])
              }
            >
              <Text style={styles.balanceBtnIcon}>{'\u2795'}</Text>
              <Text style={styles.balanceBtnText}>Top Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.balanceBtn}
              onPress={() =>
                Alert.alert('Send Money', 'Enter the recipient details to send money.', [
                  { text: 'OK' },
                ])
              }
            >
              <Text style={styles.balanceBtnIcon}>{'\uD83D\uDCE4'}</Text>
              <Text style={styles.balanceBtnText}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.balanceBtn}
              onPress={() =>
                Alert.alert(
                  'Receive Money',
                  'Share your wallet ID to receive funds:\nWallet: SA-EXPLORE-2026',
                  [{ text: 'Copy', onPress: () => {} }, { text: 'OK' }],
                )
              }
            >
              <Text style={styles.balanceBtnIcon}>{'\uD83D\uDCE5'}</Text>
              <Text style={styles.balanceBtnText}>Receive</Text>
            </TouchableOpacity>
          </View>
        </GradientCard>

        {/* Quick Actions */}
        <View style={styles.actionsGrid}>
          {WALLET_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionItem}
              onPress={() => navigation.navigate(action.route)}
            >
              <View style={styles.actionIconWrap}>
                <Text style={styles.actionIcon}>{action.icon}</Text>
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {recentTxns.map((txn) => (
            <View key={txn.id} style={styles.txnRow}>
              <View style={styles.txnIconWrap}>
                <Text style={styles.txnIcon}>
                  {txn.type === 'topup'
                    ? '\u2795'
                    : txn.type === 'refund'
                      ? '\u21A9\uFE0F'
                      : '\uD83D\uDCB3'}
                </Text>
              </View>
              <View style={styles.txnInfo}>
                <Text style={styles.txnDesc}>{txn.description}</Text>
                <Text style={styles.txnDate}>{getTimeAgo(txn.date)}</Text>
              </View>
              <Text
                style={[styles.txnAmount, txn.amount > 0 ? styles.txnPositive : styles.txnNegative]}
              >
                {txn.amount > 0 ? '+' : ''}
                {formatCurrency(txn.amount, txn.currency)}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  balanceCard: { margin: spacing.md, padding: spacing.xl, alignItems: 'center' },
  balanceLabel: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.7)' },
  balanceAmount: { fontSize: 40, fontWeight: '700', color: colors.white, marginTop: spacing.xs },
  balanceActions: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.lg },
  balanceBtn: { alignItems: 'center' },
  balanceBtnIcon: {
    fontSize: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    textAlign: 'center',
    lineHeight: 48,
    overflow: 'hidden',
  },
  balanceBtnText: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  actionItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.pearl,
    borderRadius: borderRadius.lg,
  },
  actionIconWrap: { marginBottom: spacing.xs },
  actionIcon: { fontSize: 28 },
  actionLabel: { fontSize: typography.sizes.sm, color: colors.charcoal, fontWeight: '500' },
  section: { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.pearl,
  },
  txnIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.pearl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  txnIcon: { fontSize: 18 },
  txnInfo: { flex: 1 },
  txnDesc: { fontSize: typography.sizes.sm, fontWeight: '500', color: colors.charcoal },
  txnDate: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 2 },
  txnAmount: { fontSize: typography.sizes.md, fontWeight: '700' },
  txnPositive: { color: colors.success },
  txnNegative: { color: colors.charcoal },
});
