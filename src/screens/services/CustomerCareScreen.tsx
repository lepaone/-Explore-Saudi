import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';

const FAQS = [
  {
    q: 'How do I check my visa status?',
    a: 'Log in to the app and go to Profile → Digital Documents → Visa tab. Your visa status and validity are shown on the Visa card. You can also tap the QR code at any Saudi entry point for instant verification.',
  },
  {
    q: 'What is the refund policy for cancelled bookings?',
    a: "Refunds depend on the service provider's cancellation policy. Most hotels offer free cancellation up to 48 hours before check-in. Flight and event tickets may be non-refundable. Contact the provider directly or use our Live Chat for assistance.",
  },
  {
    q: 'What should I do if I lose my passport?',
    a: "Immediately call the Emergency Hotline at 920-000-777. You should also contact your country's embassy in Saudi Arabia and report the loss to the nearest police station. Keep a digital copy of your passport in the app under Digital Documents.",
  },
];

export default function CustomerCareScreen() {
  const navigation = useNavigation<any>();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Customer Care</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient
          colors={['#0f4522', '#1b6b3a', '#2d8f55']}
          style={styles.hero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.heroIcon}>🎧</Text>
          <Text style={styles.heroTitle}>We're here to help</Text>
          <Text style={styles.heroSub}>24/7 support for all Saudi tourism needs</Text>
        </LinearGradient>

        {/* Contact Cards */}
        <Text style={styles.sectionTitle}>Contact Us</Text>

        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => Linking.openURL('tel:920000777')}
        >
          <LinearGradient colors={['#962640', '#cf6d84']} style={styles.contactIcon}>
            <Text style={styles.contactIconText}>📞</Text>
          </LinearGradient>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>Emergency Hotline</Text>
            <Text style={styles.contactDetail}>920-000-777</Text>
            <Text style={styles.contactHint}>Available 24/7 — Free call</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactCard}
          onPress={() =>
            Alert.alert(
              'Live Chat',
              'Connecting you to a support agent…\n\nAverage wait time: 2 minutes',
              [{ text: 'OK' }],
            )
          }
        >
          <LinearGradient colors={['#0f4522', '#1b6b3a']} style={styles.contactIcon}>
            <Text style={styles.contactIconText}>💬</Text>
          </LinearGradient>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>Live Chat</Text>
            <Text style={styles.contactDetail}>Chat with an agent</Text>
            <Text style={styles.contactHint}>Avg. wait: 2 min</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactCard}
          onPress={() => Linking.openURL('mailto:support@visitsaudi.com')}
        >
          <LinearGradient colors={['#a07830', '#c8a84b']} style={styles.contactIcon}>
            <Text style={styles.contactIconText}>📧</Text>
          </LinearGradient>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>Email Support</Text>
            <Text style={styles.contactDetail}>support@visitsaudi.com</Text>
            <Text style={styles.contactHint}>Reply within 24 hours</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* FAQ */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

        {FAQS.map((faq, i) => (
          <TouchableOpacity
            key={i}
            style={styles.faqCard}
            onPress={() => setOpenFaq(openFaq === i ? null : i)}
            activeOpacity={0.8}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQ}>{faq.q}</Text>
              <Text style={styles.faqChevron}>{openFaq === i ? '▲' : '▼'}</Text>
            </View>
            {openFaq === i && <Text style={styles.faqA}>{faq.a}</Text>}
          </TouchableOpacity>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>🌿 Visit Saudi</Text>
          <Text style={styles.footerText}>Saudi Tourism Authority</Text>
          <Text style={styles.footerText}>visitSaudi.com</Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.pearl,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 30, color: colors.charcoal, lineHeight: 34 },
  headerTitle: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.charcoal },
  scroll: { padding: spacing.md },
  hero: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadows.large,
  },
  heroIcon: { fontSize: 48, marginBottom: spacing.sm },
  heroTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 4,
  },
  heroSub: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.pearl,
    ...shadows.small,
  },
  contactIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactIconText: { fontSize: 24 },
  contactInfo: { flex: 1, marginLeft: spacing.md },
  contactName: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.charcoal },
  contactDetail: {
    fontSize: typography.sizes.sm,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  contactHint: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 2 },
  arrow: { fontSize: 22, color: colors.slate },
  faqCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.pearl,
  },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.charcoal,
    marginRight: spacing.sm,
  },
  faqChevron: { fontSize: 12, color: colors.slate },
  faqA: {
    fontSize: typography.sizes.sm,
    color: colors.slate,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.pearl,
  },
  footerLogo: {
    fontSize: typography.sizes.lg,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  footerText: { fontSize: typography.sizes.xs, color: colors.slate },
});
