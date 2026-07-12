import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', rate: 0.2667 },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', rate: 0.2445 },
  { code: 'GBP', name: 'British Pound', flag: '🇬��', rate: 0.211 },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', rate: 0.9793 },
  { code: 'KWD', name: 'Kuwaiti Dinar', flag: '🇰🇼', rate: 0.0819 },
  { code: 'INR', name: 'Indian Rupee', flag: '���🇳', rate: 22.31 },
  { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭', rate: 14.93 },
  { code: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬', rate: 12.5 },
];

export default function CurrencyExchangeScreen() {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('100');
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);

  const sarAmount = Number(amount) || 0;
  const convertedAmount = sarAmount * selectedCurrency.rate;

  return (
    <View style={styles.container}>
      <Header title="Currency Exchange" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Converter */}
        <Card variant="elevated" style={styles.converterCard}>
          <View style={styles.fromSection}>
            <Text style={styles.label}>From</Text>
            <View style={styles.currencyRow}>
              <Text style={styles.flag}>{'\uD83C\uDDF8\uD83C\uDDE6'}</Text>
              <Text style={styles.currencyCode}>SAR</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
          </View>

          <View style={styles.swapBtn}>
            <Text style={styles.swapIcon}>{'\u21C5'}</Text>
          </View>

          <View style={styles.toSection}>
            <Text style={styles.label}>To</Text>
            <View style={styles.currencyRow}>
              <Text style={styles.flag}>{selectedCurrency.flag}</Text>
              <Text style={styles.currencyCode}>{selectedCurrency.code}</Text>
              <Text style={styles.result}>{convertedAmount.toFixed(2)}</Text>
            </View>
          </View>

          <Text style={styles.rateText}>
            1 SAR = {selectedCurrency.rate.toFixed(4)} {selectedCurrency.code}
          </Text>
        </Card>

        {/* Currency List */}
        <Text style={styles.sectionTitle}>Select Currency</Text>
        {CURRENCIES.map((curr) => (
          <TouchableOpacity
            key={curr.code}
            style={[styles.currItem, selectedCurrency.code === curr.code && styles.currItemActive]}
            onPress={() => setSelectedCurrency(curr)}
          >
            <Text style={styles.currFlag}>{curr.flag}</Text>
            <View style={styles.currInfo}>
              <Text style={styles.currCode}>{curr.code}</Text>
              <Text style={styles.currName}>{curr.name}</Text>
            </View>
            <Text style={styles.currRate}>1 SAR = {curr.rate.toFixed(4)}</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: spacing.md },
  converterCard: { padding: spacing.lg, marginBottom: spacing.lg },
  fromSection: { marginBottom: spacing.sm },
  toSection: { marginTop: spacing.sm },
  label: { fontSize: typography.sizes.xs, color: colors.slate, marginBottom: spacing.xs },
  currencyRow: { flexDirection: 'row', alignItems: 'center' },
  flag: { fontSize: 28, marginRight: spacing.sm },
  currencyCode: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    marginRight: spacing.sm,
  },
  input: { flex: 1, fontSize: 28, fontWeight: '700', color: colors.charcoal, textAlign: 'right' },
  result: { flex: 1, fontSize: 28, fontWeight: '700', color: colors.sand, textAlign: 'right' },
  swapBtn: { alignItems: 'center', paddingVertical: spacing.xs },
  swapIcon: { fontSize: 24, color: colors.sand },
  rateText: {
    fontSize: typography.sizes.xs,
    color: colors.slate,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  currItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.pearl,
    paddingHorizontal: spacing.xs,
  },
  currItemActive: { backgroundColor: 'rgba(132,110,219,0.08)', borderRadius: borderRadius.md },
  currFlag: { fontSize: 24, marginRight: spacing.sm },
  currInfo: { flex: 1 },
  currCode: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  currName: { fontSize: typography.sizes.xs, color: colors.slate },
  currRate: { fontSize: typography.sizes.sm, color: colors.slate },
});
