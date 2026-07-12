import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/common/Header';
import { colors, gradients, typography, spacing, borderRadius } from '../../constants/theme';

const LOYALTY_CARDS = [
  {
    id: '1',
    name: 'Riyadh Season Pass',
    tier: 'Gold',
    points: 2450,
    icon: '🎭',
    colors: ['#846edb', '#6a58af'] as const,
  },
  {
    id: '2',
    name: 'Saudi Airlines Alfursan',
    tier: 'Silver',
    points: 15200,
    icon: '✈️',
    colors: ['#051f1f', '#053333'] as const,
  },
  {
    id: '3',
    name: 'Jarir Bookstore Rewards',
    tier: 'Member',
    points: 890,
    icon: '📚',
    colors: ['#547070', '#214242'] as const,
  },
  {
    id: '4',
    name: 'Starbucks Saudi',
    tier: 'Green',
    points: 340,
    icon: '☕',
    colors: ['#2fba89', '#82d9bf'] as const,
  },
  {
    id: '5',
    name: 'Al Futtaim Rewards',
    tier: 'Member',
    points: 1200,
    icon: '🛍️',
    colors: ['#962640', '#cf6d84'] as const,
  },
];

export default function LoyaltyCardsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header title="Loyalty Cards" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {LOYALTY_CARDS.map((card) => (
          <LinearGradient key={card.id} colors={card.colors} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{card.icon}</Text>
              <Text style={styles.cardTier}>{card.tier}</Text>
            </View>
            <Text style={styles.cardName}>{card.name}</Text>
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.pointsLabel}>Points</Text>
                <Text style={styles.pointsValue}>{card.points.toLocaleString()}</Text>
              </View>
              <View style={styles.barcode}>
                <Text style={styles.barcodeText}>||||||||||||</Text>
              </View>
            </View>
          </LinearGradient>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: spacing.md },
  card: { borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardIcon: { fontSize: 28 },
  cardTier: {
    fontSize: typography.sizes.xs,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardName: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.white,
    marginTop: spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.lg,
  },
  pointsLabel: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.6)' },
  pointsValue: { fontSize: typography.sizes.xxl, fontWeight: '700', color: colors.white },
  barcode: { opacity: 0.5 },
  barcodeText: { fontSize: 24, color: colors.white, letterSpacing: -2 },
});
