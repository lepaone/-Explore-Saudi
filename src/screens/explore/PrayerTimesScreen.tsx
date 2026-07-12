import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import {
  colors,
  gradients,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../constants/theme';
import { prayerTimes, nearbyMosques } from '../../services/mockData/prayerTimes';

const PRAYER_ICONS: Record<string, string> = {
  Fajr: '🌅',
  Dhuhr: '☀️',
  Asr: '🌤️',
  Maghrib: '🌇',
  Isha: '🌙',
};

export default function PrayerTimesScreen() {
  const navigation = useNavigation();

  const nextPrayer = prayerTimes.find((p) => p.isNext);

  return (
    <View style={styles.container}>
      <Header title="Prayer Times" showBack onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Next Prayer Highlight */}
        <LinearGradient colors={[...gradients.tealGradient]} style={styles.hero}>
          <Text style={styles.heroLabel}>Next Prayer</Text>
          <Text style={styles.heroName}>{nextPrayer?.name}</Text>
          <Text style={styles.heroNameAr}>{nextPrayer?.nameAr}</Text>
          <Text style={styles.heroTime}>{nextPrayer?.time}</Text>
          <Text style={styles.heroCity}>{'\uD83D\uDCCD'} Riyadh, Saudi Arabia</Text>
        </LinearGradient>

        {/* All Prayer Times */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Prayer Times</Text>
          {prayerTimes.map((prayer) => (
            <View
              key={prayer.name}
              style={[styles.prayerRow, prayer.isNext && styles.prayerRowActive]}
            >
              <View style={styles.prayerLeft}>
                <Text style={styles.prayerIcon}>{PRAYER_ICONS[prayer.name]}</Text>
                <View>
                  <Text style={[styles.prayerName, prayer.isNext && styles.prayerNameActive]}>
                    {prayer.name}
                  </Text>
                  <Text style={styles.prayerNameAr}>{prayer.nameAr}</Text>
                </View>
              </View>
              <Text style={[styles.prayerTime, prayer.isNext && styles.prayerTimeActive]}>
                {prayer.time}
              </Text>
            </View>
          ))}
        </View>

        {/* Nearby Mosques */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Mosques</Text>
          {nearbyMosques.map((mosque) => (
            <Card key={mosque.id} variant="outlined" style={styles.mosqueCard}>
              <View style={styles.mosqueRow}>
                <View style={styles.mosqueIconWrap}>
                  <Text style={styles.mosqueIcon}>{'\uD83D\uDD4C'}</Text>
                </View>
                <View style={styles.mosqueInfo}>
                  <Text style={styles.mosqueName}>{mosque.name}</Text>
                  <Text style={styles.mosqueNameAr}>{mosque.nameAr}</Text>
                </View>
                <View style={styles.mosqueDistance}>
                  <Text style={styles.distanceText}>{mosque.distance}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Qibla Direction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Qibla Direction</Text>
          <Card variant="elevated" style={styles.qiblaCard}>
            <View style={styles.qiblaContent}>
              <Text style={styles.qiblaIcon}>{'\uD83E\uDDED'}</Text>
              <Text style={styles.qiblaTitle}>Qibla Compass</Text>
              <Text style={styles.qiblaDesc}>Point your device towards 245.7° SW from Riyadh</Text>
              <View style={styles.qiblaCompass}>
                <Text style={styles.compassText}>{'\uD83D\uDD4B'}</Text>
                <Text style={styles.compassDegree}>245.7° SW</Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  hero: {
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  heroLabel: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.8)' },
  heroName: {
    fontSize: typography.sizes.hero,
    fontWeight: '700',
    color: colors.white,
    marginTop: spacing.xs,
  },
  heroNameAr: { fontSize: typography.sizes.xl, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  heroTime: {
    fontSize: typography.sizes.xxl,
    fontWeight: '700',
    color: colors.white,
    marginTop: spacing.sm,
  },
  heroCity: {
    fontSize: typography.sizes.sm,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.sm,
  },
  section: { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  prayerRowActive: { backgroundColor: 'rgba(132,110,219,0.08)' },
  prayerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  prayerIcon: { fontSize: 24 },
  prayerName: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  prayerNameActive: { color: colors.teal },
  prayerNameAr: { fontSize: typography.sizes.xs, color: colors.slate },
  prayerTime: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.charcoal },
  prayerTimeActive: { color: colors.teal },
  mosqueCard: { marginBottom: spacing.sm },
  mosqueRow: { flexDirection: 'row', alignItems: 'center' },
  mosqueIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.pearl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mosqueIcon: { fontSize: 22 },
  mosqueInfo: { flex: 1, marginLeft: spacing.sm },
  mosqueName: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  mosqueNameAr: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 2 },
  mosqueDistance: {
    backgroundColor: colors.pearl,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  distanceText: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.teal },
  qiblaCard: { padding: spacing.xl },
  qiblaContent: { alignItems: 'center' },
  qiblaIcon: { fontSize: 48, marginBottom: spacing.sm },
  qiblaTitle: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.charcoal },
  qiblaDesc: {
    fontSize: typography.sizes.sm,
    color: colors.slate,
    textAlign: 'center',
    marginTop: 4,
  },
  qiblaCompass: { alignItems: 'center', marginTop: spacing.lg },
  compassText: { fontSize: 64 },
  compassDegree: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.teal,
    marginTop: spacing.sm,
  },
});
