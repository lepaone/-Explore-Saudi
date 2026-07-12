import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

const MOODS = ['😍 Amazing', '😊 Great', '😌 Good', '😐 Okay', '😕 Not Great'];

export default function ShareExperienceScreen() {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [mood, setMood] = useState('');

  return (
    <View style={styles.container}>
      <Header title="Share Experience" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>How was your trip?</Text>
        <View style={styles.moodRow}>
          {MOODS.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.moodChip, mood === m && styles.moodChipActive]}
              onPress={() => setMood(m)}
            >
              <Text style={[styles.moodText, mood === m && styles.moodTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Tell us about it</Text>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={setText}
          placeholder="Share your experience in Saudi Arabia..."
          placeholderTextColor={colors.slate}
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.sectionTitle}>Add Photos</Text>
        <TouchableOpacity style={styles.photoBtn}>
          <Text style={styles.photoIcon}>{'\uD83D\uDCF7'}</Text>
          <Text style={styles.photoText}>Tap to add photos</Text>
        </TouchableOpacity>

        <View style={styles.btnWrap}>
          <Button
            title="Share"
            onPress={() => navigation.goBack()}
            size="lg"
            fullWidth
            disabled={!text.trim()}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: spacing.md },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  moodChip: {
    paddingVertical: spacing.xs + 4,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.pearl,
  },
  moodChipActive: { backgroundColor: colors.sand },
  moodText: { fontSize: typography.sizes.sm, color: colors.charcoal },
  moodTextActive: { color: colors.white },
  textInput: {
    borderWidth: 1,
    borderColor: colors.pearl,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.charcoal,
    minHeight: 120,
  },
  photoBtn: {
    borderWidth: 2,
    borderColor: colors.pearl,
    borderStyle: 'dashed',
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  photoIcon: { fontSize: 36, marginBottom: spacing.xs },
  photoText: { fontSize: typography.sizes.sm, color: colors.slate },
  btnWrap: { marginTop: spacing.xl },
});
