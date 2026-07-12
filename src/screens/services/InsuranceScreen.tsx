import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { colors, gradients, typography, spacing, borderRadius } from '../../constants/theme';
import { useWalletStore } from '../../store/useWalletStore';
import { useAuthStore } from '../../store/useAuthStore';
import { formatCurrency } from '../../utils/formatters';

const PLANS = [
  {
    id: '1',
    name: 'Basic Cover',
    price: 75,
    period: '/ trip',
    features: ['Emergency medical up to SAR 50,000', 'Trip cancellation', '24/7 helpline'],
    recommended: false,
  },
  {
    id: '2',
    name: 'Premium Cover',
    price: 150,
    period: '/ trip',
    features: [
      'Emergency medical up to SAR 200,000',
      'Trip cancellation & delay',
      'Lost baggage up to SAR 5,000',
      'Adventure sports cover',
      '24/7 helpline + concierge',
    ],
    recommended: true,
  },
  {
    id: '3',
    name: 'Family Cover',
    price: 250,
    period: '/ trip',
    features: [
      'Covers up to 4 family members',
      'Emergency medical up to SAR 500,000',
      'Full trip protection',
      'Lost baggage & personal items',
      'Adventure & extreme sports',
      'Priority 24/7 assistance',
    ],
    recommended: false,
  },
];

export default function InsuranceScreen() {
  const navigation = useNavigation();
  const { balance, addTransaction } = useWalletStore();
  const user = useAuthStore((s) => s.user);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Header title="Travel Insurance" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card variant="outlined" style={styles.infoCard}>
          <Text style={styles.infoIcon}>{'\uD83D\uDEE1\uFE0F'}</Text>
          <Text style={styles.infoText}>
            Protect your Saudi adventure with comprehensive travel insurance tailored for visitors.
          </Text>
        </Card>

        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            variant={plan.recommended ? 'elevated' : 'outlined'}
            style={[styles.planCard, plan.recommended && styles.planCardRecommended]}
          >
            {plan.recommended && (
              <LinearGradient colors={[colors.sand, colors.sandDark]} style={styles.recommendBadge}>
                <Text style={styles.recommendText}>Recommended</Text>
              </LinearGradient>
            )}
            <Text style={styles.planName}>{plan.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.planPrice}>SAR {plan.price}</Text>
              <Text style={styles.planPeriod}>{plan.period}</Text>
            </View>
            {plan.features.map((f, i) => (
              <Text key={i} style={styles.feature}>
                {'\u2713'} {f}
              </Text>
            ))}
            <View style={styles.btnWrap}>
              <Button
                title={selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                onPress={() => {
                  if (balance < plan.price) {
                    Alert.alert(
                      'Insufficient Balance',
                      `You need ${formatCurrency(plan.price)} but your balance is ${formatCurrency(balance)}.\n\nPlease top up your wallet first.`,
                      [{ text: 'OK' }],
                    );
                    return;
                  }
                  addTransaction({
                    id: `txn_${Date.now()}`,
                    type: 'payment',
                    amount: -plan.price,
                    currency: 'SAR',
                    description: `Travel Insurance - ${plan.name}`,
                    date: new Date().toISOString(),
                    category: 'insurance',
                    merchantLogo: 'https://img.icons8.com/color/48/insurance.png',
                  });
                  setSelectedPlan(plan.id);
                  Alert.alert(
                    'Insurance Purchased!',
                    `${user?.name ?? 'Guest'} — your ${plan.name} plan is confirmed.\n\nPrice: ${formatCurrency(plan.price)} ${plan.period}\n${formatCurrency(plan.price)} deducted from wallet.\n\nCoverage will begin upon your arrival in Saudi Arabia.`,
                    [{ text: 'OK' }],
                  );
                }}
                variant={plan.recommended ? 'primary' : 'outline'}
                fullWidth
              />
            </View>
          </Card>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: spacing.md },
  infoCard: {
    flexDirection: 'row',
    padding: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  infoIcon: { fontSize: 24, marginRight: spacing.sm },
  infoText: { flex: 1, fontSize: typography.sizes.sm, color: colors.slate, lineHeight: 20 },
  planCard: { padding: spacing.lg, marginBottom: spacing.md },
  planCardRecommended: { borderColor: colors.sand, borderWidth: 2 },
  recommendBadge: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  recommendText: { fontSize: typography.sizes.xs, fontWeight: '700', color: colors.white },
  planName: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.charcoal },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  planPrice: { fontSize: typography.sizes.xxl, fontWeight: '700', color: colors.sand },
  planPeriod: { fontSize: typography.sizes.sm, color: colors.slate },
  feature: { fontSize: typography.sizes.sm, color: colors.charcoal, lineHeight: 24, marginTop: 2 },
  btnWrap: { marginTop: spacing.md },
});
