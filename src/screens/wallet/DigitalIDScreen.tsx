import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import { colors, gradients, typography, spacing, borderRadius } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';

export default function DigitalIDScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);

  return (
    <View style={styles.container}>
      <Header title="Digital ID" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ID Card */}
        <LinearGradient colors={[...gradients.nightGradient]} style={styles.idCard}>
          <View style={styles.idHeader}>
            <Text style={styles.idHeaderText}>
              {'\uD83C\uDDF8\uD83C\uDDE6'} Kingdom of Saudi Arabia
            </Text>
            <Text style={styles.idType}>Tourist Digital ID</Text>
          </View>
          <View style={styles.idBody}>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0) ?? 'T'}</Text>
            </View>
            <View style={styles.idInfo}>
              <Text style={styles.idName}>{user?.name ?? 'Guest'}</Text>
              <Text style={styles.idNationality}>{user?.nationality ?? 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.idFields}>
            <View style={styles.idField}>
              <Text style={styles.fieldLabel}>Passport No.</Text>
              <Text style={styles.fieldValue}>{user?.passportNumber ?? 'N/A'}</Text>
            </View>
            <View style={styles.idField}>
              <Text style={styles.fieldLabel}>Visa Type</Text>
              <Text style={styles.fieldValue}>{user?.visaType ?? 'N/A'}</Text>
            </View>
            <View style={styles.idField}>
              <Text style={styles.fieldLabel}>Valid Until</Text>
              <Text style={styles.fieldValue}>2026-12-31</Text>
            </View>
          </View>
          <View style={styles.qrWrap}>
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrText}>QR</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Status */}
        <Card variant="elevated" style={styles.statusCard}>
          <Text style={styles.statusTitle}>🛡️ Verification Status</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusDoc}>Passport</Text>
            <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
              <Text style={{ fontSize: 12 }}>✅</Text>
              <Text style={[styles.statusLabel, { color: colors.success }]}>Verified</Text>
            </View>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusRow}>
            <Text style={styles.statusDoc}>Driver's License</Text>
            <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
              <Text style={{ fontSize: 12 }}>✅</Text>
              <Text style={[styles.statusLabel, { color: colors.success }]}>Verified</Text>
            </View>
          </View>
        </Card>

        {/* Manage Documents Button */}
        <TouchableOpacity
          style={styles.manageBtn}
          activeOpacity={0.85}
          onPress={() =>
            navigation.getParent()?.navigate('ProfileTab', { screen: 'DigitalDocuments' })
          }
        >
          <Text style={styles.manageBtnIcon}>📄</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.manageBtnTitle}>Manage Documents</Text>
            <Text style={styles.manageBtnSub}>Upload or update passport, license & more</Text>
          </View>
          <Text style={styles.manageBtnArrow}>→</Text>
        </TouchableOpacity>

        {/* Info Cards */}
        <Card variant="outlined" style={styles.infoCard}>
          <Text style={styles.infoIcon}>{'\u2139\uFE0F'}</Text>
          <Text style={styles.infoText}>
            Your Digital ID can be used for verification at hotels, attractions, and government
            services throughout Saudi Arabia.
          </Text>
        </Card>

        <Card variant="outlined" style={styles.infoCard}>
          <Text style={styles.infoIcon}>{'\uD83D\uDD12'}</Text>
          <Text style={styles.infoText}>
            This digital ID is secured with end-to-end encryption and stored locally on your device.
          </Text>
        </Card>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: spacing.md },

  // ID Card
  idCard: { borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  idHeader: { alignItems: 'center', marginBottom: spacing.lg },
  idHeaderText: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.white },
  idType: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  idBody: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: colors.white },
  idInfo: { marginLeft: spacing.md },
  idName: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.white },
  idNationality: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  idFields: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg },
  idField: {},
  fieldLabel: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.5)' },
  fieldValue: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.white,
    marginTop: 2,
  },
  qrWrap: { alignItems: 'center' },
  qrPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrText: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.charcoal },

  // Status card
  statusCard: { padding: spacing.md, marginBottom: spacing.lg },
  statusTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  statusDoc: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.charcoal },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  statusLabel: { fontSize: typography.sizes.xs, fontWeight: '600', marginLeft: 4 },
  statusDivider: { height: 1, backgroundColor: colors.pearl, marginVertical: spacing.xs },

  // Manage Documents button
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.primary + '30',
  },
  manageBtnIcon: { fontSize: 28, marginRight: spacing.sm },
  manageBtnTitle: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.charcoal },
  manageBtnSub: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 2 },
  manageBtnArrow: { fontSize: 20, color: colors.primary, fontWeight: '700' },

  // Info cards
  infoCard: {
    flexDirection: 'row',
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  infoIcon: { fontSize: 22, marginRight: spacing.sm },
  infoText: { flex: 1, fontSize: typography.sizes.sm, color: colors.slate, lineHeight: 20 },
});
