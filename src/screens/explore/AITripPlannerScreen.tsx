import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { colors, gradients, typography, spacing, borderRadius } from '../../constants/theme';

const INTERESTS = [
  'Heritage',
  'Adventure',
  'Food',
  'Shopping',
  'Nature',
  'Nightlife',
  'Sports',
  'Culture',
  'Relaxation',
  'Photography',
];
const CITIES = ['Riyadh', 'Jeddah', 'AlUla', 'Abha', 'Madinah', 'Makkah', 'Dammam', 'Taif'];

const SAMPLE_PLAN = {
  title: 'Your 3-Day Riyadh Adventure',
  days: [
    {
      day: 1,
      title: 'Heritage & Culture',
      activities: [
        { time: '9:00 AM', activity: 'Visit Masmak Fortress', icon: '🏛️' },
        { time: '11:30 AM', activity: 'Explore Saudi National Museum', icon: '🎨' },
        { time: '1:00 PM', activity: 'Lunch at Najd Village (Kabsa)', icon: '🍽️' },
        { time: '3:30 PM', activity: 'Diriyah - At-Turaif District', icon: '🏰' },
        { time: '6:00 PM', activity: 'Bujairi Terrace dining', icon: '🌅' },
        { time: '8:30 PM', activity: 'Boulevard Riyadh City', icon: '🎉' },
      ],
    },
    {
      day: 2,
      title: 'Modern & Entertainment',
      activities: [
        { time: '9:30 AM', activity: 'Kingdom Centre Tower Sky Bridge', icon: '🏙️' },
        { time: '11:00 AM', activity: 'Shopping at Kingdom Centre Mall', icon: '🛍️' },
        { time: '1:00 PM', activity: 'Lunch at Nusr-Et Steakhouse', icon: '🥩' },
        { time: '3:00 PM', activity: 'KAFD Grand Mosque & District', icon: '🕌' },
        { time: '5:00 PM', activity: 'Via Riyadh lifestyle destination', icon: '✨' },
        { time: '8:00 PM', activity: 'Boulevard World cultural experience', icon: '🌍' },
      ],
    },
    {
      day: 3,
      title: 'Adventure & Nature',
      activities: [
        { time: '6:00 AM', activity: 'Edge of the World sunrise trip', icon: '🏔️' },
        { time: '11:00 AM', activity: 'Desert safari & camel ride', icon: '🐪' },
        { time: '1:30 PM', activity: 'Traditional lunch in the desert', icon: '🍖' },
        { time: '4:00 PM', activity: 'Al Baik for the iconic experience', icon: '🍗' },
        { time: '6:00 PM', activity: 'Souq Al Zal traditional market', icon: '🏺' },
        { time: '8:00 PM', activity: 'Farewell dinner at Zuma', icon: '🍣' },
      ],
    },
  ],
};

export default function AITripPlannerScreen() {
  const navigation = useNavigation();
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [days, setDays] = useState('3');
  const [selectedCity, setSelectedCity] = useState('Riyadh');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Heritage', 'Food']);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    );
  };

  const generatePlan = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('result');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Header
        title="AI Trip Planner"
        subtitle="Powered by AI"
        showBack
        onBack={() => navigation.goBack()}
      />

      {step === 'input' ? (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <LinearGradient colors={[...gradients.tealGradient]} style={styles.hero}>
            <Text style={styles.heroIcon}>{'\uD83E\uDD16'}</Text>
            <Text style={styles.heroTitle}>Plan Your Perfect Trip</Text>
            <Text style={styles.heroSub}>
              Tell us your preferences and we'll create a personalized itinerary
            </Text>
          </LinearGradient>

          {/* City */}
          <View style={styles.section}>
            <Text style={styles.label}>Destination</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipRow}>
                {CITIES.map((city) => (
                  <TouchableOpacity
                    key={city}
                    style={[styles.chip, selectedCity === city && styles.chipActive]}
                    onPress={() => setSelectedCity(city)}
                  >
                    <Text style={[styles.chipText, selectedCity === city && styles.chipTextActive]}>
                      {city}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Days */}
          <View style={styles.section}>
            <Text style={styles.label}>Duration (days)</Text>
            <View style={styles.daysRow}>
              {['1', '2', '3', '5', '7'].map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.dayBtn, days === d && styles.dayBtnActive]}
                  onPress={() => setDays(d)}
                >
                  <Text style={[styles.dayText, days === d && styles.dayTextActive]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Interests */}
          <View style={styles.section}>
            <Text style={styles.label}>Your Interests</Text>
            <View style={styles.interestGrid}>
              {INTERESTS.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[styles.chip, selectedInterests.includes(interest) && styles.chipActive]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedInterests.includes(interest) && styles.chipTextActive,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.btnWrap}>
            <Button
              title={loading ? 'Generating...' : 'Generate My Trip'}
              onPress={generatePlan}
              size="lg"
              fullWidth
              loading={loading}
            />
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>{SAMPLE_PLAN.title}</Text>
            <Text style={styles.resultSub}>
              {selectedCity} - {days} days - {selectedInterests.join(', ')}
            </Text>
          </View>

          {SAMPLE_PLAN.days.map((day) => (
            <Card key={day.day} variant="outlined" style={styles.dayCard}>
              <View style={styles.dayHeader}>
                <LinearGradient colors={[colors.sand, colors.sandDark]} style={styles.dayBadge}>
                  <Text style={styles.dayBadgeText}>Day {day.day}</Text>
                </LinearGradient>
                <Text style={styles.dayTitle}>{day.title}</Text>
              </View>
              {day.activities.map((act, idx) => (
                <View key={idx} style={styles.activityRow}>
                  <Text style={styles.activityTime}>{act.time}</Text>
                  <View style={styles.activityLine} />
                  <Text style={styles.activityIcon}>{act.icon}</Text>
                  <Text style={styles.activityText}>{act.activity}</Text>
                </View>
              ))}
            </Card>
          ))}

          <View style={styles.btnWrap}>
            <Button
              title="Regenerate Plan"
              onPress={() => setStep('input')}
              variant="outline"
              fullWidth
            />
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flex: 1 },
  hero: {
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  heroIcon: { fontSize: 48, marginBottom: spacing.sm },
  heroTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: typography.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  section: { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  label: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  chipRow: { flexDirection: 'row', gap: spacing.sm },
  chip: {
    paddingVertical: spacing.xs + 4,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.pearl,
  },
  chipActive: { backgroundColor: colors.sand },
  chipText: { fontSize: typography.sizes.sm, color: colors.charcoal, fontWeight: '500' },
  chipTextActive: { color: colors.white },
  daysRow: { flexDirection: 'row', gap: spacing.sm },
  dayBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.pearl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBtnActive: { backgroundColor: colors.sand },
  dayText: { fontSize: typography.sizes.lg, fontWeight: '600', color: colors.charcoal },
  dayTextActive: { color: colors.white },
  interestGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  btnWrap: { paddingHorizontal: spacing.md, marginTop: spacing.xl },
  resultHeader: { padding: spacing.md },
  resultTitle: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.charcoal },
  resultSub: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 4 },
  dayCard: { marginHorizontal: spacing.md, marginBottom: spacing.md, padding: spacing.md },
  dayHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  dayBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 4,
    borderRadius: borderRadius.sm,
  },
  dayBadgeText: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.white },
  dayTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.charcoal,
    marginLeft: spacing.sm,
  },
  activityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  activityTime: { fontSize: typography.sizes.xs, color: colors.slate, width: 65 },
  activityLine: {
    width: 1,
    height: 20,
    backgroundColor: colors.pearl,
    marginHorizontal: spacing.xs,
  },
  activityIcon: { fontSize: 18, marginRight: spacing.xs },
  activityText: { fontSize: typography.sizes.sm, color: colors.charcoal, flex: 1 },
});
