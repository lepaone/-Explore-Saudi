import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';

type Step = 'upload' | 'review';

export default function RegistrationScreen() {
  const navigation = useNavigation<any>();
  const login = useAuthStore((s) => s.login);

  const [step, setStep] = useState<Step>('upload');
  const [scanning, setScanning] = useState(false);
  const [passportUri, setPassportUri] = useState<string | null>(null);
  const [ocrDone, setOcrDone] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [nationality, setNationality] = useState('');

  const runOCR = (uri: string) => {
    setScanning(true);
    setTimeout(() => {
      setName('Sarah Al-Mansouri');
      setPassportNumber('P9876543');
      setNationality('Saudi Arabia');
      setScanning(false);
      setOcrDone(true);
      setStep('review');
    }, 2200);
  };

  const pickPassport = () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const uri = URL.createObjectURL(file);
          setPassportUri(uri);
          runOCR(uri);
        }
      };
      input.click();
    } else {
      setPassportUri('mock://camera');
      runOCR('mock://camera');
    }
  };

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Info', 'Please fill in Name, Email and Password.');
      return;
    }
    login(email.trim(), password);
    Alert.alert('Welcome!', `Account created for ${name.trim()}.`, [
      { text: 'Get Started', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Step indicator */}
      <View style={styles.stepRow}>
        <View style={[styles.stepDot, styles.stepActive]}>
          <Text style={styles.stepNum}>{step === 'upload' ? '1' : '✓'}</Text>
        </View>
        <View style={[styles.stepLine, ocrDone && styles.stepLineDone]} />
        <View style={[styles.stepDot, step === 'review' ? styles.stepActive : styles.stepInactive]}>
          <Text style={[styles.stepNum, step !== 'review' && { color: colors.slate }]}>2</Text>
        </View>
        <Text style={styles.stepLabel}>
          {step === 'upload' ? '  Upload Passport' : '  Review & Confirm'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {step === 'upload' ? (
          <View>
            <Text style={styles.sectionTitle}>Passport Upload & OCR</Text>
            <Text style={styles.sectionSub}>
              Upload your passport photo. Our OCR engine will automatically read and fill in your
              details.
            </Text>

            {/* Upload / preview box */}
            {passportUri && passportUri !== 'mock://camera' ? (
              <View style={styles.previewBox}>
                <Image source={{ uri: passportUri }} style={styles.previewImg} resizeMode="cover" />
                {scanning && (
                  <View style={styles.scanOverlay}>
                    <ActivityIndicator size="large" color={colors.gold} />
                    <Text style={styles.scanText}>Reading passport data…</Text>
                    <View style={styles.scanLine} />
                  </View>
                )}
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.uploadBox, scanning && styles.uploadBoxActive]}
                onPress={!scanning ? pickPassport : undefined}
                activeOpacity={0.85}
              >
                {scanning ? (
                  <>
                    <ActivityIndicator size="large" color={colors.gold} />
                    <Text style={styles.scanText}>Processing passport…</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.uploadEmoji}>🛂</Text>
                    <Text style={styles.uploadTitle}>
                      {Platform.OS === 'web' ? 'Click to Upload Passport' : 'Tap to Scan Passport'}
                    </Text>
                    <Text style={styles.uploadSub}>
                      {Platform.OS === 'web'
                        ? 'JPG, PNG or PDF • Max 10 MB'
                        : 'Hold the passport in good lighting'}
                    </Text>
                    <View style={styles.uploadBtn}>
                      <Text style={styles.uploadBtnText}>
                        {Platform.OS === 'web' ? '📎  Choose File' : '📷  Open Camera'}
                      </Text>
                    </View>
                  </>
                )}
                {/* Corner frames */}
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </TouchableOpacity>
            )}

            {/* Feature list */}
            {[
              'Instant data extraction',
              'Name & nationality auto-fill',
              'Passport number detection',
              'Expiry date recognition',
            ].map((f) => (
              <View key={f} style={styles.featureRow}>
                <Text style={styles.featureTick}>✅</Text>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}

            <TouchableOpacity style={styles.skipBtn} onPress={() => setStep('review')}>
              <Text style={styles.skipText}>Skip — enter details manually</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.sectionTitle}>Review Your Details</Text>
            <Text style={styles.sectionSub}>
              {ocrDone
                ? 'Passport scanned successfully. Review the auto-filled data below.'
                : 'Enter your details to complete registration.'}
            </Text>

            {ocrDone && (
              <View style={styles.ocrBanner}>
                <Text style={{ fontSize: 24 }}>🎉</Text>
                <View>
                  <Text style={styles.ocrBannerTitle}>OCR Complete</Text>
                  <Text style={styles.ocrBannerSub}>Passport data extracted successfully</Text>
                </View>
              </View>
            )}

            <View style={styles.formCard}>
              <Field
                label="Full Name *"
                value={name}
                onChangeText={setName}
                placeholder="As on passport"
              />
              <Field
                label="Email Address *"
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Field
                label="Password *"
                value={password}
                onChangeText={setPassword}
                placeholder="Min. 8 characters"
                secureTextEntry
              />
              <Field
                label="Passport Number"
                value={passportNumber}
                onChangeText={setPassportNumber}
                placeholder="e.g. P9876543"
                autoCapitalize="characters"
              />
              <Field
                label="Nationality"
                value={nationality}
                onChangeText={setNationality}
                placeholder="e.g. Saudi Arabia"
                isLast
              />
            </View>

            <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
              <LinearGradient
                colors={['#1b6b3a', '#0f4522']}
                style={styles.registerBtnGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.registerBtnText}>Create Account →</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => {
                setStep('upload');
                setOcrDone(false);
              }}
            >
              <Text style={styles.skipText}>← Back to passport upload</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Field component ────────────────────────────────────────────────────────────
function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry,
  isLast,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: any;
  autoCapitalize?: any;
  secureTextEntry?: boolean;
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
        secureTextEntry={secureTextEntry}
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

// ── Main styles ────────────────────────────────────────────────────────────────
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

  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.cream,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepActive: { backgroundColor: colors.primary },
  stepInactive: { backgroundColor: colors.pearl },
  stepNum: { fontSize: typography.sizes.xs, fontWeight: '700', color: colors.white },
  stepLine: { width: 32, height: 2, backgroundColor: colors.pearl, marginHorizontal: spacing.xs },
  stepLineDone: { backgroundColor: colors.primary },
  stepLabel: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.slate },

  scroll: { padding: spacing.lg },
  sectionTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  sectionSub: {
    fontSize: typography.sizes.sm,
    color: colors.slate,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },

  // Upload box
  uploadBox: {
    minHeight: 230,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.cream,
    borderWidth: 2,
    borderColor: colors.pearl,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  uploadBoxActive: { borderColor: colors.gold },
  uploadEmoji: { fontSize: 52, marginBottom: spacing.sm },
  uploadTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  uploadSub: {
    fontSize: typography.sizes.sm,
    color: colors.slate,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  uploadBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  uploadBtnText: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.white },

  // Preview
  previewBox: {
    height: 210,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    position: 'relative',
  },
  previewImg: { width: '100%', height: '100%' },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,69,34,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  scanLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: colors.gold,
    top: '50%',
  },
  scanText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.goldLight ?? '#e8c96b',
    marginTop: spacing.sm,
  },

  // Corner frames
  corner: { position: 'absolute', width: 28, height: 28, borderColor: colors.primary },
  cornerTL: { top: 12, left: 12, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 4 },
  cornerTR: { top: 12, right: 12, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 4 },
  cornerBL: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 4,
  },

  // Feature list
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs },
  featureTick: { fontSize: 16, marginRight: spacing.sm },
  featureText: { fontSize: typography.sizes.sm, color: colors.charcoal },

  // OCR banner
  ocrBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#e8f5ee',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  ocrBannerTitle: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.charcoal },
  ocrBannerSub: { fontSize: typography.sizes.xs, color: colors.slate },

  formCard: {
    backgroundColor: colors.cream,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.pearl,
  },

  registerBtn: { borderRadius: borderRadius.lg, overflow: 'hidden', marginBottom: spacing.sm },
  registerBtnGrad: { paddingVertical: 15, alignItems: 'center' },
  registerBtnText: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },

  skipBtn: { alignItems: 'center', paddingVertical: spacing.md },
  skipText: { fontSize: typography.sizes.sm, color: colors.slate },
});
