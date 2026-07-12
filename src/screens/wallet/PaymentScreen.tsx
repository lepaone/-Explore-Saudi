import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { useWalletStore } from '../../store/useWalletStore';
import { formatCurrency } from '../../utils/formatters';

export default function PaymentScreen() {
  const navigation = useNavigation();
  const { balance, addTransaction } = useWalletStore();
  const [amount, setAmount] = useState('');

  const QUICK_AMOUNTS = [50, 100, 200, 500];

  return (
    <View style={styles.container}>
      <Header title="Payment" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card variant="outlined" style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
        </Card>

        <Text style={styles.sectionTitle}>Enter Amount</Text>
        <View style={styles.inputWrap}>
          <Text style={styles.currency}>SAR</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={colors.pearl}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.quickAmounts}>
          {QUICK_AMOUNTS.map((amt) => (
            <TouchableOpacity
              key={amt}
              style={styles.quickBtn}
              onPress={() => setAmount(amt.toString())}
            >
              <Text style={styles.quickText}>{amt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Pay To</Text>
        {['Scan QR Code', 'Enter Phone Number', 'Select from Contacts'].map((method) => (
          <TouchableOpacity key={method} style={styles.methodRow}>
            <Text style={styles.methodIcon}>
              {method.includes('QR')
                ? '\uD83D\uDCF7'
                : method.includes('Phone')
                  ? '\uD83D\uDCF1'
                  : '\uD83D\uDC65'}
            </Text>
            <Text style={styles.methodText}>{method}</Text>
            <Text style={styles.methodArrow}>{'\u203A'}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.btnWrap}>
          <Button
            title="Pay Now"
            onPress={() => {
              const numAmount = Number(amount);
              addTransaction({
                id: `txn_${Date.now()}`,
                type: 'payment',
                amount: -numAmount,
                currency: 'SAR',
                description: 'Payment Sent',
                date: new Date().toISOString(),
                category: 'transfer',
                merchantLogo: 'https://img.icons8.com/color/48/send.png',
              });
              Alert.alert(
                'Payment Sent!',
                `${formatCurrency(numAmount)} has been sent successfully.\n\n${formatCurrency(numAmount)} deducted from wallet.`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      setAmount('');
                      navigation.goBack();
                    },
                  },
                ],
              );
            }}
            size="lg"
            fullWidth
            disabled={!amount || Number(amount) > balance}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: spacing.md },
  balanceCard: { padding: spacing.md, alignItems: 'center', marginBottom: spacing.lg },
  balanceLabel: { fontSize: typography.sizes.sm, color: colors.slate },
  balanceAmount: {
    fontSize: typography.sizes.xxl,
    fontWeight: '700',
    color: colors.charcoal,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.pearl,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  currency: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.slate,
    marginRight: spacing.sm,
  },
  amountInput: { flex: 1, fontSize: 36, fontWeight: '700', color: colors.charcoal },
  quickAmounts: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  quickBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.pearl,
    borderRadius: borderRadius.md,
  },
  quickText: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.pearl,
  },
  methodIcon: { fontSize: 22, marginRight: spacing.sm },
  methodText: { flex: 1, fontSize: typography.sizes.md, color: colors.charcoal },
  methodArrow: { fontSize: 22, color: colors.slate },
  btnWrap: { marginTop: spacing.xl },
});
