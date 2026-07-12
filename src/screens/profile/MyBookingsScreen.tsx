import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

const BOOKINGS = [
  {
    id: '1',
    type: 'Hotel',
    name: 'Four Seasons Riyadh',
    date: '2026-04-10 — 2026-04-13',
    status: 'upcoming',
    icon: '🏨',
  },
  {
    id: '2',
    type: 'Restaurant',
    name: 'Nusr-Et Steakhouse',
    date: '2026-04-08, 8:00 PM',
    status: 'upcoming',
    icon: '🍽️',
  },
  {
    id: '3',
    type: 'Event',
    name: 'F1 Saudi Grand Prix',
    date: '2026-04-17 — 2026-04-19',
    status: 'upcoming',
    icon: '🏎️',
  },
  {
    id: '4',
    type: 'Attraction',
    name: 'Hegra (AlUla)',
    date: '2026-03-25',
    status: 'completed',
    icon: '🏛️',
  },
  {
    id: '5',
    type: 'Hotel',
    name: 'Banyan Tree AlUla',
    date: '2026-03-24 — 2026-03-26',
    status: 'completed',
    icon: '🏨',
  },
];

export default function MyBookingsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header title="My Bookings" showBack onBack={() => navigation.goBack()} />
      <FlatList
        data={BOOKINGS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card variant="outlined" style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.icon}>{item.icon}</Text>
              <View style={styles.info}>
                <View style={styles.headerRow}>
                  <Text style={styles.type}>{item.type}</Text>
                  <Badge
                    text={item.status}
                    variant={item.status === 'upcoming' ? 'new' : 'trending'}
                    size="sm"
                  />
                </View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  list: { padding: spacing.md, paddingBottom: 100 },
  card: { marginBottom: spacing.sm, padding: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 32, marginRight: spacing.sm },
  info: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  type: {
    fontSize: typography.sizes.xs,
    color: colors.sand,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  name: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal, marginTop: 4 },
  date: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 2 },
});
