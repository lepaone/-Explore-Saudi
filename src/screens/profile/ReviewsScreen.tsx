import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import RatingStars from '../../components/common/RatingStars';
import { colors, typography, spacing } from '../../constants/theme';

const REVIEWS = [
  {
    id: '1',
    place: 'Hegra (AlUla)',
    rating: 5,
    text: 'Absolutely breathtaking! The Nabataean tombs are incredible. A must-visit.',
    date: '2026-03-25',
  },
  {
    id: '2',
    place: 'Nusr-Et Steakhouse',
    rating: 4,
    text: 'Great food and atmosphere. The golden tomahawk is an experience!',
    date: '2026-03-20',
  },
  {
    id: '3',
    place: 'Banyan Tree AlUla',
    rating: 5,
    text: 'Best hotel experience ever. Stargazing from the private villa was magical.',
    date: '2026-03-24',
  },
  {
    id: '4',
    place: 'Edge of the World',
    rating: 5,
    text: 'The view is unreal. Make sure to go at sunrise for the best experience.',
    date: '2026-03-15',
  },
  {
    id: '5',
    place: 'Boulevard Riyadh City',
    rating: 4,
    text: 'So much to do! Great food and entertainment options. Gets crowded on weekends.',
    date: '2026-03-10',
  },
];

export default function ReviewsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header title="My Reviews" showBack onBack={() => navigation.goBack()} />
      <FlatList
        data={REVIEWS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card variant="outlined" style={styles.card}>
            <Text style={styles.place}>{item.place}</Text>
            <RatingStars rating={item.rating} size="sm" />
            <Text style={styles.text}>{item.text}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  list: { padding: spacing.md, paddingBottom: 100 },
  card: { padding: spacing.md, marginBottom: spacing.sm },
  place: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  text: {
    fontSize: typography.sizes.sm,
    color: colors.slate,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  date: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: spacing.sm },
});
