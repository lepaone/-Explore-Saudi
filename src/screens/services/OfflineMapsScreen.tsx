import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

const INITIAL_MAPS = [
  { id: '1', city: 'Riyadh', size: '45 MB', downloaded: true },
  { id: '2', city: 'Jeddah', size: '38 MB', downloaded: true },
  { id: '3', city: 'Makkah', size: '22 MB', downloaded: false },
  { id: '4', city: 'Madinah', size: '20 MB', downloaded: false },
  { id: '5', city: 'AlUla', size: '15 MB', downloaded: false },
  { id: '6', city: 'Abha', size: '18 MB', downloaded: false },
  { id: '7', city: 'Dammam', size: '25 MB', downloaded: false },
  { id: '8', city: 'Taif', size: '16 MB', downloaded: false },
];

export default function OfflineMapsScreen() {
  const navigation = useNavigation();
  const [maps, setMaps] = useState(INITIAL_MAPS);

  return (
    <View style={styles.container}>
      <Header title="Offline Maps" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card variant="outlined" style={styles.infoCard}>
          <Text style={styles.infoIcon}>{'\uD83D\uDCE1'}</Text>
          <Text style={styles.infoText}>
            Download city maps for offline navigation. Maps include streets, landmarks, and points
            of interest.
          </Text>
        </Card>

        {maps.map((map) => (
          <View key={map.id} style={styles.mapRow}>
            <Text style={styles.mapIcon}>{'\uD83D\uDDFA\uFE0F'}</Text>
            <View style={styles.mapInfo}>
              <Text style={styles.mapCity}>{map.city}</Text>
              <Text style={styles.mapSize}>{map.size}</Text>
            </View>
            {map.downloaded ? (
              <View style={styles.downloadedBadge}>
                <Text style={styles.downloadedText}>{'\u2705'} Downloaded</Text>
              </View>
            ) : (
              <Button
                title="Download"
                onPress={() => {
                  setMaps((prev) =>
                    prev.map((m) => (m.id === map.id ? { ...m, downloaded: true } : m)),
                  );
                  Alert.alert(
                    'Download Complete',
                    `${map.city} map (${map.size}) has been downloaded for offline use.`,
                    [{ text: 'OK' }],
                  );
                }}
                size="sm"
                variant="outline"
              />
            )}
          </View>
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
  mapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.pearl,
  },
  mapIcon: { fontSize: 28, marginRight: spacing.sm },
  mapInfo: { flex: 1 },
  mapCity: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  mapSize: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 2 },
  downloadedBadge: {},
  downloadedText: { fontSize: typography.sizes.sm, color: colors.success, fontWeight: '600' },
});
