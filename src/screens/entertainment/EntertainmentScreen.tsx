import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import CategoryPill from '../../components/common/CategoryPill';
import Badge from '../../components/common/Badge';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { SCREEN_WIDTH } from '../../constants/layout';
import { entertainmentVenues, entertainmentEvents } from '../../services/mockData/entertainment';

const EVENT_CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'concert', label: 'Concerts' },
  { key: 'sports', label: 'Sports' },
  { key: 'festival', label: 'Festivals' },
  { key: 'theater', label: 'Theater' },
  { key: 'exhibition', label: 'Exhibitions' },
];

export default function EntertainmentScreen() {
  const navigation = useNavigation<any>();
  const [eventCategory, setEventCategory] = useState('all');

  const filteredEvents =
    eventCategory === 'all'
      ? entertainmentEvents
      : entertainmentEvents.filter((e) => e.type === eventCategory);

  return (
    <View style={styles.container}>
      <Header title="Entertainment" showBack onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Venues */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Venues & Theme Parks</Text>
          <FlatList
            data={entertainmentVenues}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.venueCard}
                onPress={() => navigation.navigate('VenueDetail', { id: item.id })}
              >
                <Image
                  source={{ uri: item.images[0] }}
                  style={styles.venueImage}
                  contentFit="cover"
                  transition={200}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.venueOverlay}
                >
                  <Text style={styles.venueName}>{item.name}</Text>
                  <Text style={styles.venueCity}>{item.city}</Text>
                  <Text style={styles.venueRating}>
                    {'\u2605'} {item.rating}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {EVENT_CATEGORIES.map((c) => (
              <CategoryPill
                key={c.key}
                label={c.label}
                isActive={eventCategory === c.key}
                onPress={() => setEventCategory(c.key)}
              />
            ))}
          </ScrollView>

          {filteredEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventCard}
              onPress={() => navigation.navigate('EventDetail', { id: event.id })}
            >
              <Image
                source={{ uri: event.images[0] }}
                style={styles.eventImage}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.eventInfo}>
                <View style={styles.eventBadges}>
                  {event.isTrending && <Badge text="Trending" variant="trending" size="sm" />}
                  {event.isSoldOut && <Badge text="Sold Out" variant="soldOut" size="sm" />}
                </View>
                <Text style={styles.eventName} numberOfLines={1}>
                  {event.name}
                </Text>
                <Text style={styles.eventVenue} numberOfLines={1}>
                  {event.venue}
                </Text>
                <View style={styles.eventMeta}>
                  <Text style={styles.eventDate}>{event.date}</Text>
                  <Text style={styles.eventCity}>{event.city}</Text>
                </View>
                <Text style={styles.eventPrice}>
                  From SAR {Math.min(...event.ticketTypes.map((t) => t.price))}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  section: { marginTop: spacing.md },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  horizontalList: { paddingLeft: spacing.md, paddingRight: spacing.sm },
  categoryRow: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  venueCard: {
    width: SCREEN_WIDTH * 0.65,
    height: 180,
    borderRadius: borderRadius.lg,
    marginRight: spacing.sm,
    overflow: 'hidden',
    ...shadows.medium,
  },
  venueImage: { width: '100%', height: '100%' },
  venueOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm + 4,
    paddingTop: spacing.xl,
  },
  venueName: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.white },
  venueCity: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  venueRating: {
    fontSize: typography.sizes.xs,
    color: colors.sand,
    fontWeight: '600',
    marginTop: 4,
  },
  eventCard: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.small,
  },
  eventImage: { width: 110, height: 130 },
  eventInfo: { flex: 1, padding: spacing.sm, justifyContent: 'center' },
  eventBadges: { flexDirection: 'row', gap: spacing.xs },
  eventName: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.charcoal,
    marginTop: 4,
  },
  eventVenue: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 2 },
  eventMeta: { flexDirection: 'row', gap: spacing.md, marginTop: 4 },
  eventDate: { fontSize: typography.sizes.xs, color: colors.sand, fontWeight: '600' },
  eventCity: { fontSize: typography.sizes.xs, color: colors.slate },
  eventPrice: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    color: colors.charcoal,
    marginTop: 4,
  },
});
