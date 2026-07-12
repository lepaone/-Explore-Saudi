import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { useWalletStore } from '../../store/useWalletStore';
import { formatCurrency } from '../../utils/formatters';

const CATEGORY_ICONS: Record<string, string> = {
  dining: '🍽️',
  entertainment: '🎭',
  transport: '🚗',
  exchange: '💱',
  'top-up': '💰',
  refund: '↩️',
};

export default function ExpenseTrackerScreen() {
  const navigation = useNavigation();
  const { transactions } = useWalletStore();

  const expenses = transactions.filter((t) => t.amount < 0);
  const totalSpent = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const byCategory = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
    return acc;
  }, {});

  const categories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);

  return (
    <View style={styles.container}>
      <Header title="Expense Tracker" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Total Spent */}
        <Card variant="elevated" style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Spent This Month</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalSpent)}</Text>
          <Text style={styles.totalCount}>{expenses.length} transactions</Text>
        </Card>

        {/* Category Breakdown */}
        <Text style={styles.sectionTitle}>By Category</Text>
        {categories.map(([cat, amount]) => {
          const pct = (amount / totalSpent) * 100;
          return (
            <View key={cat} style={styles.catRow}>
              <Text style={styles.catIcon}>{CATEGORY_ICONS[cat] ?? '💳'}</Text>
              <View style={styles.catInfo}>
                <View style={styles.catHeader}>
                  <Text style={styles.catName}>{cat}</Text>
                  <Text style={styles.catAmount}>{formatCurrency(amount)}</Text>
                </View>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${pct}%` }]} />
                </View>
              </View>
            </View>
          );
        })}

        {/* All Expenses */}
        <Text style={styles.sectionTitle}>All Expenses</Text>
        {expenses.map((txn) => (
          <View key={txn.id} style={styles.txnRow}>
            <Text style={styles.txnIcon}>{CATEGORY_ICONS[txn.category] ?? '💳'}</Text>
            <View style={styles.txnInfo}>
              <Text style={styles.txnDesc}>{txn.description}</Text>
              <Text style={styles.txnCategory}>{txn.category}</Text>
            </View>
            <Text style={styles.txnAmount}>{formatCurrency(Math.abs(txn.amount))}</Text>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: spacing.md },
  totalCard: { padding: spacing.xl, alignItems: 'center', marginBottom: spacing.lg },
  totalLabel: { fontSize: typography.sizes.sm, color: colors.slate },
  totalAmount: { fontSize: 36, fontWeight: '700', color: colors.charcoal, marginTop: spacing.xs },
  totalCount: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 4 },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  catRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  catIcon: { fontSize: 24, marginRight: spacing.sm },
  catInfo: { flex: 1 },
  catHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  catName: {
    fontSize: typography.sizes.sm,
    fontWeight: '500',
    color: colors.charcoal,
    textTransform: 'capitalize',
  },
  catAmount: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.charcoal },
  progressBg: { height: 6, backgroundColor: colors.pearl, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.sand, borderRadius: 3 },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.pearl,
  },
  txnIcon: { fontSize: 20, marginRight: spacing.sm },
  txnInfo: { flex: 1 },
  txnDesc: { fontSize: typography.sizes.sm, fontWeight: '500', color: colors.charcoal },
  txnCategory: {
    fontSize: typography.sizes.xs,
    color: colors.slate,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  txnAmount: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
});
