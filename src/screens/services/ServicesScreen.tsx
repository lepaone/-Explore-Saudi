import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Card from '../../components/common/Card';
import { colors, gradients, typography, spacing, borderRadius } from '../../constants/theme';

const SERVICES = [
  {
    id: '1',
    icon: '✈️',
    title: 'Visa & Package',
    subtitle: 'Flight, hotel & instant e-Visa',
    route: 'VisaPackage',
    colors: ['#0f4522', '#1b6b3a'] as const,
  },
  {
    id: '2',
    icon: '🚇',
    title: 'Transport',
    subtitle: 'Metro, bus, train & ride-hailing',
    route: 'Transport',
    colors: ['#053333', '#214242'] as const,
  },
  {
    id: '3',
    icon: '🆘',
    title: 'Emergency SOS',
    subtitle: 'Emergency contacts & assistance',
    route: 'EmergencySOS',
    colors: ['#962640', '#cf6d84'] as const,
  },
  {
    id: '4',
    icon: '🗺️',
    title: 'Offline Maps',
    subtitle: 'Download maps for offline use',
    route: 'OfflineMaps',
    colors: ['#053333', '#547070'] as const,
  },
  {
    id: '5',
    icon: '🛡️',
    title: 'Travel Insurance',
    subtitle: 'Health & travel coverage',
    route: 'Insurance',
    colors: ['#2fba89', '#82d9bf'] as const,
  },
  {
    id: '6',
    icon: '🗣️',
    title: 'Language Helper',
    subtitle: 'Arabic phrases & translator',
    route: 'LanguageHelper',
    colors: ['#1b6b3a', '#2d8f55'] as const,
  },
  {
    id: '7',
    icon: '🎧',
    title: 'Customer Care',
    subtitle: 'Support, FAQ & emergency contacts',
    route: 'CustomerCare',
    colors: ['#a07830', '#c8a84b'] as const,
  },
];

export default function ServicesScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
        <Text style={styles.subtitle}>Essential tools for your trip</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {SERVICES.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.serviceCard}
            onPress={() => navigation.navigate(service.route)}
          >
            <LinearGradient colors={service.colors} style={styles.iconWrap}>
              <Text style={styles.icon}>{service.icon}</Text>
            </LinearGradient>
            <View style={styles.info}>
              <Text style={styles.serviceName}>{service.title}</Text>
              <Text style={styles.serviceSub}>{service.subtitle}</Text>
            </View>
            <Text style={styles.arrow}>{'\u203A'}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.md },
  title: { fontSize: typography.sizes.xxl, fontWeight: '700', color: colors.charcoal },
  subtitle: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 2 },
  scroll: { padding: spacing.md },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.pearl,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 26 },
  info: { flex: 1, marginLeft: spacing.md },
  serviceName: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  serviceSub: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 2 },
  arrow: { fontSize: 24, color: colors.slate },
});
