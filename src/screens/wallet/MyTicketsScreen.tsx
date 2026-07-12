import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { useWalletStore } from '../../store/useWalletStore';
import { formatDate } from '../../utils/formatters';

const STATUS_VARIANT: Record<string, 'trending' | 'soldOut' | 'new'> = {
  active: 'new',
  used: 'soldOut',
  expired: 'soldOut',
};

export default function MyTicketsScreen() {
  const navigation = useNavigation();
  const { tickets } = useWalletStore();

  return (
    <View style={styles.container}>
      <Header title="My Tickets" showBack onBack={() => navigation.goBack()} />
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card variant="elevated" style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
              <Badge text={item.status} variant={STATUS_VARIANT[item.status] ?? 'new'} />
              <Text style={styles.ticketType}>{item.ticketType}</Text>
            </View>
            <Text style={styles.eventName}>{item.eventName}</Text>
            <Text style={styles.venue}>{item.venue}</Text>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
            <View style={styles.qrSection}>
              <View style={styles.qrPlaceholder}>
                <Text style={styles.qrText}>QR</Text>
              </View>
              <Text style={styles.qrCode}>{item.qrCode}</Text>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{'\uD83C\uDFAB'}</Text>
            <Text style={styles.emptyText}>No tickets yet</Text>
            <Text style={styles.emptySub}>Book events to see your tickets here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  list: { padding: spacing.md, paddingBottom: 100 },
  ticketCard: { padding: spacing.md, marginBottom: spacing.md },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketType: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.sand },
  eventName: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    marginTop: spacing.sm,
  },
  venue: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 4 },
  date: { fontSize: typography.sizes.sm, color: colors.sand, fontWeight: '600', marginTop: 4 },
  qrSection: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.pearl,
  },
  qrPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.md,
    backgroundColor: colors.pearl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrText: { fontSize: typography.sizes.xxl, fontWeight: '700', color: colors.charcoal },
  qrCode: {
    fontSize: typography.sizes.sm,
    color: colors.slate,
    marginTop: spacing.sm,
    fontFamily: 'monospace',
  },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: spacing.sm },
  emptyText: { fontSize: typography.sizes.lg, fontWeight: '600', color: colors.charcoal },
  emptySub: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 4 },
});
