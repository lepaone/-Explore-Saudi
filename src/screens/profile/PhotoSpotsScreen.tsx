import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { SCREEN_WIDTH } from '../../constants/layout';

const PHOTO_SPOTS = [
  {
    id: '1',
    name: 'Elephant Rock, AlUla',
    tip: 'Best at golden hour (sunset)',
    image:
      'https://images.pexels.com/photos/459319/pexels-photo-459319.jpeg?auto=compress&cs=tinysrgb&w=800',
    city: 'AlUla',
  },
  {
    id: '2',
    name: 'Edge of the World',
    tip: 'Sunrise for dramatic shadows',
    image:
      'https://images.pexels.com/photos/31744093/pexels-photo-31744093.jpeg?auto=compress&cs=tinysrgb&w=800',
    city: 'Riyadh',
  },
  {
    id: '3',
    name: 'Maraya Concert Hall',
    tip: 'Reflections best at midday',
    image:
      'https://images.pexels.com/photos/9822971/pexels-photo-9822971.jpeg?auto=compress&cs=tinysrgb&w=800',
    city: 'AlUla',
  },
  {
    id: '4',
    name: 'Jeddah Corniche Fountain',
    tip: 'Night photography with illumination',
    image:
      'https://images.pexels.com/photos/4023386/pexels-photo-4023386.jpeg?auto=compress&cs=tinysrgb&w=800',
    city: 'Jeddah',
  },
  {
    id: '5',
    name: 'Al-Balad Historic District',
    tip: 'Morning light on Roshan balconies',
    image:
      'https://images.pexels.com/photos/19509209/pexels-photo-19509209.jpeg?auto=compress&cs=tinysrgb&w=800',
    city: 'Jeddah',
  },
  {
    id: '6',
    name: 'Diriyah At-Turaif',
    tip: 'Blue hour for warm tones on mud-brick',
    image:
      'https://images.pexels.com/photos/18672830/pexels-photo-18672830.jpeg?auto=compress&cs=tinysrgb&w=800',
    city: 'Riyadh',
  },
  {
    id: '7',
    name: 'Kingdom Tower Sky Bridge',
    tip: 'Sunset panoramic city views',
    image:
      'https://images.pexels.com/photos/35761/pexels-photo-35761.jpeg?auto=compress&cs=tinysrgb&w=800',
    city: 'Riyadh',
  },
  {
    id: '8',
    name: 'Rijal Almaa Village',
    tip: 'Colorful facades in bright daylight',
    image:
      'https://images.pexels.com/photos/50628/pexels-photo-50628.jpeg?auto=compress&cs=tinysrgb&w=800',
    city: 'Asir',
  },
];

export default function PhotoSpotsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header
        title="Photo Spots"
        subtitle="Best places for photos"
        showBack
        onBack={() => navigation.goBack()}
      />
      <FlatList
        data={PHOTO_SPOTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.image }}
              style={styles.cardImage}
              contentFit="cover"
              transition={300}
            />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.overlay}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.city}>
                {'\uD83D\uDCCD'} {item.city}
              </Text>
              <View style={styles.tipRow}>
                <Text style={styles.tipIcon}>{'\uD83D\uDCF8'}</Text>
                <Text style={styles.tip}>{item.tip}</Text>
              </View>
            </LinearGradient>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  list: { padding: spacing.md, paddingBottom: 100 },
  card: {
    height: 220,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.medium,
  },
  cardImage: { width: '100%', height: '100%' },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingTop: spacing.xl,
  },
  name: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.white },
  city: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  tipRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  tipIcon: { fontSize: 14, marginRight: spacing.xs },
  tip: { fontSize: typography.sizes.sm, color: colors.sand, fontStyle: 'italic' },
});
