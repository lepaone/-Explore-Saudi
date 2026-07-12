import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

const EMERGENCY_NUMBERS = [
  { id: '1', icon: '🚔', name: 'Police', number: '999', color: '#3498DB' },
  { id: '2', icon: '🚑', name: 'Ambulance', number: '997', color: '#E74C3C' },
  { id: '3', icon: '🚒', name: 'Fire Department', number: '998', color: '#F39C12' },
  { id: '4', icon: '🏥', name: 'Traffic Accidents', number: '993', color: '#2ECC71' },
  { id: '5', icon: '📞', name: 'Tourist Helpline', number: '930', color: '#846edb' },
  { id: '6', icon: '🏛️', name: 'Embassy Assistance', number: '+966-11-488-3800', color: '#547070' },
];

const USEFUL_INFO = [
  { icon: '🏥', title: 'Nearest Hospital', desc: 'King Faisal Specialist Hospital — 2.3 km' },
  { icon: '💊', title: 'Nearest Pharmacy', desc: 'Al Nahdi Pharmacy — 450m (Open 24h)' },
  { icon: '👮', title: 'Nearest Police Station', desc: 'Olaya Police Station — 1.1 km' },
];

export default function EmergencySOSScreen() {
  const navigation = useNavigation();

  const callNumber = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View style={styles.container}>
      <Header title="Emergency SOS" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* SOS Button */}
        <TouchableOpacity style={styles.sosButton} onPress={() => callNumber('999')}>
          <Text style={styles.sosIcon}>{'\uD83C\uDD98'}</Text>
          <Text style={styles.sosText}>Emergency Call</Text>
          <Text style={styles.sosSub}>Tap to call 999</Text>
        </TouchableOpacity>

        {/* Emergency Numbers */}
        <Text style={styles.sectionTitle}>Emergency Numbers</Text>
        {EMERGENCY_NUMBERS.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => callNumber(item.number)}>
            <Card variant="outlined" style={styles.numCard}>
              <View style={styles.numRow}>
                <View style={[styles.numIconWrap, { backgroundColor: item.color + '20' }]}>
                  <Text style={styles.numIcon}>{item.icon}</Text>
                </View>
                <View style={styles.numInfo}>
                  <Text style={styles.numName}>{item.name}</Text>
                  <Text style={styles.numNumber}>{item.number}</Text>
                </View>
                <Text style={styles.callIcon}>{'\uD83D\uDCDE'}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        {/* Nearby Facilities */}
        <Text style={styles.sectionTitle}>Nearby Facilities</Text>
        {USEFUL_INFO.map((info) => (
          <Card key={info.title} variant="outlined" style={styles.infoCard}>
            <Text style={styles.infoIcon}>{info.icon}</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>{info.title}</Text>
              <Text style={styles.infoDesc}>{info.desc}</Text>
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
  sosButton: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sosIcon: { fontSize: 48 },
  sosText: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.white,
    marginTop: spacing.sm,
  },
  sosSub: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  numCard: { marginBottom: spacing.sm, padding: spacing.md },
  numRow: { flexDirection: 'row', alignItems: 'center' },
  numIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numIcon: { fontSize: 22 },
  numInfo: { flex: 1, marginLeft: spacing.sm },
  numName: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  numNumber: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 2 },
  callIcon: { fontSize: 22 },
  infoCard: {
    flexDirection: 'row',
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  infoIcon: { fontSize: 28, marginRight: spacing.sm },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  infoDesc: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 2 },
});
