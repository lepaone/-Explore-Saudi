import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import CategoryPill from '../../components/common/CategoryPill';
import Card from '../../components/common/Card';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { transportOptions } from '../../services/mockData/transport';

const TYPES = [
  { key: 'all', label: 'All' },
  { key: 'metro', label: 'Metro' },
  { key: 'train', label: 'Train' },
  { key: 'bus', label: 'Bus' },
  { key: 'taxi', label: 'Taxi' },
  { key: 'rental', label: 'Rental' },
];

export default function TransportScreen() {
  const navigation = useNavigation();
  const [type, setType] = useState('all');

  const filtered =
    type === 'all' ? transportOptions : transportOptions.filter((t) => t.type === type);

  return (
    <View style={styles.container}>
      <Header title="Transport" showBack onBack={() => navigation.goBack()} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {TYPES.map((t) => (
          <CategoryPill
            key={t.key}
            label={t.label}
            isActive={type === t.key}
            onPress={() => setType(t.key)}
          />
        ))}
      </ScrollView>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card variant="outlined" style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.icon}>{item.icon}</Text>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.route}>{item.route}</Text>
                <View style={styles.meta}>
                  <Text style={styles.fare}>SAR {item.fare}</Text>
                  <Text style={styles.duration}>
                    {'\uD83D\uDD52'} {item.duration}
                  </Text>
                </View>
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
  filterRow: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  list: { padding: spacing.md, paddingBottom: 100 },
  card: { marginBottom: spacing.sm, padding: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 32, marginRight: spacing.sm },
  info: { flex: 1 },
  name: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  route: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 2 },
  meta: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  fare: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.sand },
  duration: { fontSize: typography.sizes.sm, color: colors.slate },
});
