import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/common/Header';
import CategoryPill from '../../components/common/CategoryPill';
import Card from '../../components/common/Card';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

const CATEGORIES = ['Greetings', 'Dining', 'Transport', 'Shopping', 'Emergency', 'General'];

const PHRASES: Record<string, Array<{ en: string; ar: string; phonetic: string }>> = {
  Greetings: [
    { en: 'Hello / Peace be upon you', ar: 'السلام عليكم', phonetic: 'As-salamu alaykum' },
    { en: 'Welcome', ar: 'أهلاً وسهلاً', phonetic: 'Ahlan wa sahlan' },
    { en: 'Good morning', ar: 'صباح الخير', phonetic: 'Sabah al-khayr' },
    { en: 'Good evening', ar: 'مساء الخير', phonetic: 'Masa al-khayr' },
    { en: 'How are you?', ar: 'كيف حالك؟', phonetic: 'Kayf halak?' },
    { en: 'Thank you', ar: 'شكراً', phonetic: 'Shukran' },
    { en: 'Goodbye', ar: 'مع السلامة', phonetic: "Ma'a as-salama" },
  ],
  Dining: [
    { en: 'The bill, please', ar: 'الحساب لو سمحت', phonetic: 'Al-hisab law samaht' },
    { en: 'Is this halal?', ar: 'هل هذا حلال؟', phonetic: 'Hal hatha halal?' },
    { en: 'Water, please', ar: 'ماء لو سمحت', phonetic: "Ma' law samaht" },
    { en: 'Delicious!', ar: 'لذيذ!', phonetic: 'Latheeth!' },
    { en: "I'm vegetarian", ar: 'أنا نباتي', phonetic: 'Ana nabati' },
    { en: 'No spicy, please', ar: 'بدون حار لو سمحت', phonetic: 'Bidun har law samaht' },
  ],
  Transport: [
    { en: 'Where is...?', ar: 'أين...؟', phonetic: 'Ayna...?' },
    { en: 'How much to...?', ar: 'كم إلى...؟', phonetic: 'Kam ila...?' },
    { en: 'Please stop here', ar: 'وقف هنا لو سمحت', phonetic: 'Wagif huna law samaht' },
    { en: 'Airport', ar: 'المطار', phonetic: 'Al-matar' },
    { en: 'Hotel', ar: 'الفندق', phonetic: 'Al-funduq' },
    { en: 'Left / Right', ar: 'يسار / يمين', phonetic: 'Yasar / Yameen' },
  ],
  Shopping: [
    { en: 'How much?', ar: 'بكم؟', phonetic: 'Bikam?' },
    { en: 'Too expensive', ar: 'غالي جداً', phonetic: 'Ghali jiddan' },
    { en: 'Discount?', ar: 'في خصم؟', phonetic: 'Fi khasm?' },
    { en: "I'll take it", ar: 'آخذه', phonetic: 'Aakhuthuh' },
    { en: 'Cash / Card', ar: 'كاش / بطاقة', phonetic: 'Cash / Bitaqa' },
  ],
  Emergency: [
    { en: 'Help!', ar: 'مساعدة!', phonetic: "Musa'ada!" },
    { en: 'Call the police', ar: 'اتصل بالشرطة', phonetic: 'Ittasil bish-shurta' },
    { en: 'I need a doctor', ar: 'أحتاج طبيب', phonetic: 'Ahtaj tabeeb' },
    { en: 'Hospital', ar: 'مستشفى', phonetic: 'Mustashfa' },
    { en: "I'm lost", ar: 'أنا ضائع', phonetic: "Ana da'i" },
  ],
  General: [
    { en: 'Yes / No', ar: 'نعم / لا', phonetic: "Na'am / La" },
    { en: 'Please', ar: 'لو سمحت', phonetic: 'Law samaht' },
    { en: 'Sorry', ar: 'آسف', phonetic: 'Aasif' },
    { en: "I don't understand", ar: 'لا أفهم', phonetic: 'La afham' },
    { en: 'Do you speak English?', ar: 'هل تتكلم إنجليزي؟', phonetic: 'Hal tatakallam inglizi?' },
    { en: 'My name is...', ar: 'اسمي...', phonetic: 'Ismi...' },
  ],
};

export default function LanguageHelperScreen() {
  const navigation = useNavigation();
  const [category, setCategory] = useState('Greetings');

  return (
    <View style={styles.container}>
      <Header title="Language Helper" showBack onBack={() => navigation.goBack()} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {CATEGORIES.map((c) => (
          <CategoryPill
            key={c}
            label={c}
            isActive={category === c}
            onPress={() => setCategory(c)}
          />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll}>
        {PHRASES[category]?.map((phrase, idx) => (
          <Card key={idx} variant="outlined" style={styles.phraseCard}>
            <Text style={styles.english}>{phrase.en}</Text>
            <Text style={styles.arabic}>{phrase.ar}</Text>
            <Text style={styles.phonetic}>{phrase.phonetic}</Text>
          </Card>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  categoryRow: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  scroll: { padding: spacing.md },
  phraseCard: { padding: spacing.md, marginBottom: spacing.sm },
  english: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  arabic: {
    fontSize: typography.sizes.xl,
    color: colors.teal,
    marginTop: spacing.sm,
    textAlign: 'right',
  },
  phonetic: {
    fontSize: typography.sizes.sm,
    color: colors.sand,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
});
