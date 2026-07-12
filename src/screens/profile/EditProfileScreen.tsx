import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [nationality, setNationality] = useState(user?.nationality ?? '');
  const [passportNumber, setPassportNumber] = useState(user?.passportNumber ?? '');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Name cannot be empty.');
      return;
    }
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      nationality: nationality.trim(),
      passportNumber: passportNumber.trim(),
    });
    Alert.alert('Saved!', 'Your profile has been updated.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <LinearGradient colors={['#c8a84b', '#a07830']} style={styles.avatar}>
              <Text style={styles.avatarText}>{name.charAt(0)?.toUpperCase() || '?'}</Text>
            </LinearGradient>
            <TouchableOpacity
              style={styles.changePhotoBtn}
              onPress={() => Alert.alert('Coming Soon', 'Photo upload will be available soon.')}
            >
              <Text style={styles.changePhotoText}>Tap to change photo</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            <Field
              label="Full Name *"
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
            />
            <Field
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Field
              label="Nationality"
              value={nationality}
              onChangeText={setNationality}
              placeholder="e.g. Saudi Arabia"
            />
            <Field
              label="Passport Number"
              value={passportNumber}
              onChangeText={setPassportNumber}
              placeholder="e.g. P1234567"
              autoCapitalize="characters"
              isLast
            />
          </View>

          {/* Member Since (read-only) */}
          {user?.memberSince && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{user.memberSince}</Text>
            </View>
          )}

          {/* Save button */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <LinearGradient
              colors={['#1b6b3a', '#0f4522']}
              style={styles.saveBtnGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.saveBtnText}>Save Changes ✓</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{ height: 60 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  isLast,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: any;
  autoCapitalize?: any;
  isLast?: boolean;
}) {
  return (
    <View style={[fStyles.wrap, isLast && { borderBottomWidth: 0 }]}>
      <Text style={fStyles.label}>{label}</Text>
      <TextInput
        style={fStyles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.slate}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}
const fStyles = StyleSheet.create({
  wrap: { paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.pearl },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: '700',
    color: colors.slate,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  input: { fontSize: typography.sizes.md, color: colors.charcoal, paddingVertical: 4 },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.pearl,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 30, color: colors.charcoal, lineHeight: 34 },
  headerTitle: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.charcoal },
  scroll: { padding: spacing.lg },
  avatarSection: { alignItems: 'center', marginBottom: spacing.lg },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 38, fontWeight: '800', color: colors.white },
  changePhotoBtn: { marginTop: spacing.sm },
  changePhotoText: { fontSize: typography.sizes.sm, color: colors.primary, fontWeight: '600' },
  formCard: {
    backgroundColor: colors.cream,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.pearl,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.cream,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  infoLabel: { fontSize: typography.sizes.sm, color: colors.slate },
  infoValue: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.charcoal },
  saveBtn: { borderRadius: borderRadius.lg, overflow: 'hidden', marginBottom: spacing.sm },
  saveBtnGrad: { paddingVertical: 15, alignItems: 'center' },
  saveBtnText: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
});
