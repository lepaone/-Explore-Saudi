import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

type CheckInStep = 'preferences' | 'verifying' | 'preparing' | 'ready';

const PROGRESS_STEPS: { key: CheckInStep; icon: string; label: string; sub: string }[] = [
  {
    key: 'verifying',
    icon: '🛂',
    label: 'Verifying Identity',
    sub: 'Checking your passport & booking...',
  },
  {
    key: 'preparing',
    icon: '🏨',
    label: 'Preparing Your Room',
    sub: 'Your room is being prepared...',
  },
  { key: 'ready', icon: '🗝️', label: 'Key Ready!', sub: 'Your digital room key is ready.' },
];

const FLOOR_OPTIONS = [
  { key: 'high', label: 'High Floor', icon: '🏙️' },
  { key: 'mid', label: 'Mid Floor', icon: '🏢' },
  { key: 'low', label: 'Low Floor', icon: '🏠' },
];

const PILLOW_OPTIONS = [
  { key: 'soft', label: 'Soft', icon: '☁️' },
  { key: 'firm', label: 'Firm', icon: '🧱' },
];

// Simple QR-code placeholder (5×5 grid of small squares)
function QRPlaceholder() {
  const pattern = [
    [1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
  ];
  return (
    <View style={qr.wrap}>
      {pattern.map((row, r) => (
        <View key={r} style={qr.row}>
          {row.map((cell, c) => (
            <View key={c} style={[qr.cell, cell ? qr.cellFilled : qr.cellEmpty]} />
          ))}
        </View>
      ))}
    </View>
  );
}
const qr = StyleSheet.create({
  wrap: {
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    alignSelf: 'center',
  },
  row: { flexDirection: 'row' },
  cell: { width: 14, height: 14, margin: 2, borderRadius: 2 },
  cellFilled: { backgroundColor: colors.primary },
  cellEmpty: { backgroundColor: colors.pearl },
});

export default function DigitalCheckInScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const user = useAuthStore((s) => s.user);

  const {
    hotelName = 'Hotel',
    roomNumber = '1204',
    checkIn = '2026-04-10',
    checkOut = '2026-04-14',
  } = route.params ?? {};

  // Preferences state
  const [currentStep, setCurrentStep] = useState<CheckInStep>('preferences');
  const [floorPref, setFloorPref] = useState('high');
  const [pillowPref, setPillowPref] = useState('soft');
  const [earlyCheckIn, setEarlyCheckIn] = useState(false);
  const [idVerified] = useState(true); // Simulated: passport always "uploaded"

  // Animation state
  const progress = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.85)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  const startCheckIn = () => {
    setCurrentStep('verifying');
  };

  useEffect(() => {
    if (currentStep === 'verifying') {
      Animated.timing(progress, { toValue: 0.45, duration: 1500, useNativeDriver: false }).start(
        () => {
          setCurrentStep('preparing');
          Animated.timing(progress, {
            toValue: 0.85,
            duration: 1500,
            useNativeDriver: false,
          }).start(() => {
            setCurrentStep('ready');
            Animated.timing(progress, {
              toValue: 1,
              duration: 400,
              useNativeDriver: false,
            }).start();
            Animated.parallel([
              Animated.spring(cardScale, {
                toValue: 1,
                useNativeDriver: true,
                tension: 60,
                friction: 8,
              }),
              Animated.timing(cardOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]).start();
          });
        },
      );
    }
  }, [currentStep === 'verifying']);

  const activeProgressStep = PROGRESS_STEPS.find((s) => s.key === currentStep);
  const isReady = currentStep === 'ready';
  const isPreferences = currentStep === 'preferences';
  const isProcessing = currentStep === 'verifying' || currentStep === 'preparing';

  const progressWidth = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  // Preferences screen
  if (isPreferences) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.prefScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.screenTitle}>Digital Check-In</Text>
          <Text style={styles.screenSub}>{hotelName}</Text>

          {/* Guest Information */}
          <Card variant="elevated" style={styles.guestCard}>
            <Text style={styles.guestCardTitle}>👤 Guest Information</Text>
            <View style={styles.guestRow}>
              <Text style={styles.guestLabel}>Name</Text>
              <Text style={styles.guestValue}>{user?.name ?? 'Guest'}</Text>
            </View>
            <View style={styles.guestRow}>
              <Text style={styles.guestLabel}>Passport</Text>
              <Text style={styles.guestValue}>{user?.passportNumber ?? 'N/A'}</Text>
            </View>
            <View style={styles.guestRow}>
              <Text style={styles.guestLabel}>Nationality</Text>
              <Text style={styles.guestValue}>{user?.nationality ?? 'N/A'}</Text>
            </View>
          </Card>

          {/* Booking Details */}
          <Card variant="elevated" style={styles.guestCard}>
            <Text style={styles.guestCardTitle}>📋 Booking Details</Text>
            <View style={styles.guestRow}>
              <Text style={styles.guestLabel}>Hotel</Text>
              <Text style={styles.guestValue}>{hotelName}</Text>
            </View>
            <View style={styles.guestRow}>
              <Text style={styles.guestLabel}>Room</Text>
              <Text style={styles.guestValue}>{roomNumber}</Text>
            </View>
            <View style={styles.guestRow}>
              <Text style={styles.guestLabel}>Check-In</Text>
              <Text style={styles.guestValue}>{checkIn}</Text>
            </View>
            <View style={styles.guestRow}>
              <Text style={styles.guestLabel}>Check-Out</Text>
              <Text style={styles.guestValue}>{checkOut}</Text>
            </View>
          </Card>

          {/* ID Verification Status */}
          <Card variant="outlined" style={styles.idCard}>
            <View style={styles.idCardRow}>
              <Text style={styles.idCardIcon}>{idVerified ? '✅' : '⚠️'}</Text>
              <View style={styles.idCardInfo}>
                <Text style={styles.idCardTitle}>
                  {idVerified ? 'Identity Verified' : 'ID Verification Required'}
                </Text>
                <Text style={styles.idCardSub}>
                  {idVerified
                    ? 'Your passport has been verified for check-in.'
                    : 'Please upload your passport in Digital ID to proceed.'}
                </Text>
              </View>
            </View>
          </Card>

          {/* Room Preferences */}
          <Text style={styles.prefTitle}>🏨 Room Preferences</Text>

          {/* Floor Preference */}
          <Text style={styles.prefLabel}>Floor Preference</Text>
          <View style={styles.prefRow}>
            {FLOOR_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.prefOption, floorPref === opt.key && styles.prefOptionActive]}
                onPress={() => setFloorPref(opt.key)}
              >
                <Text style={styles.prefOptionIcon}>{opt.icon}</Text>
                <Text
                  style={[
                    styles.prefOptionText,
                    floorPref === opt.key && styles.prefOptionTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Pillow Type */}
          <Text style={styles.prefLabel}>Pillow Type</Text>
          <View style={styles.prefRow}>
            {PILLOW_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.prefOption, pillowPref === opt.key && styles.prefOptionActive]}
                onPress={() => setPillowPref(opt.key)}
              >
                <Text style={styles.prefOptionIcon}>{opt.icon}</Text>
                <Text
                  style={[
                    styles.prefOptionText,
                    pillowPref === opt.key && styles.prefOptionTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Early Check-in Toggle */}
          <TouchableOpacity
            style={[styles.toggleRow, earlyCheckIn && styles.toggleRowActive]}
            onPress={() => setEarlyCheckIn(!earlyCheckIn)}
          >
            <View>
              <Text style={styles.toggleLabel}>⏰ Early Check-in</Text>
              <Text style={styles.toggleSub}>
                Request check-in before 2:00 PM (subject to availability)
              </Text>
            </View>
            <View style={[styles.toggleSwitch, earlyCheckIn && styles.toggleSwitchOn]}>
              <View style={[styles.toggleKnob, earlyCheckIn && styles.toggleKnobOn]} />
            </View>
          </TouchableOpacity>

          <View style={{ height: spacing.lg }} />

          <Button title="Start Check-In" onPress={startCheckIn} size="lg" fullWidth />

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Processing & Ready screen (original flow enhanced)
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>‹</Text>
      </TouchableOpacity>

      <Text style={styles.screenTitle}>Digital Check-In</Text>
      <Text style={styles.screenSub}>{hotelName}</Text>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      {/* Step icons row */}
      <View style={styles.stepIcons}>
        {PROGRESS_STEPS.map((s, i) => {
          const done = PROGRESS_STEPS.findIndex((x) => x.key === currentStep) > i;
          const active = s.key === currentStep;
          return (
            <React.Fragment key={s.key}>
              <View
                style={[
                  styles.stepIcon,
                  active && styles.stepIconActive,
                  done && styles.stepIconDone,
                ]}
              >
                <Text style={styles.stepIconEmoji}>{done ? '✓' : s.icon}</Text>
              </View>
              {i < PROGRESS_STEPS.length - 1 && (
                <View style={[styles.stepConnector, done && styles.stepConnectorDone]} />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* Current step label */}
      {activeProgressStep && (
        <View style={styles.stepLabelWrap}>
          <Text style={styles.stepLabelText}>{activeProgressStep.label}</Text>
          <Text style={styles.stepLabelSub}>{activeProgressStep.sub}</Text>
        </View>
      )}

      {/* Digital Key Card — shown only when ready */}
      {isReady && (
        <Animated.View
          style={[styles.cardWrap, { transform: [{ scale: cardScale }], opacity: cardOpacity }]}
        >
          <LinearGradient
            colors={['#0f4522', '#1b6b3a', '#2d8f55']}
            style={styles.keyCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Deco circles */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />

            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardHotelName}>{hotelName}</Text>
                <Text style={styles.cardRoomLabel}>Room {roomNumber}</Text>
              </View>
              <Text style={styles.cardKeyIcon}>🗝️</Text>
            </View>

            <QRPlaceholder />

            <View style={styles.cardFooter}>
              <View style={styles.cardDates}>
                <View>
                  <Text style={styles.cardDateLabel}>Check-In</Text>
                  <Text style={styles.cardDateValue}>{checkIn}</Text>
                </View>
                <View style={styles.cardDateDivider} />
                <View>
                  <Text style={styles.cardDateLabel}>Check-Out</Text>
                  <Text style={styles.cardDateValue}>{checkOut}</Text>
                </View>
              </View>
              <Text style={styles.cardGuest}>👤 {user?.name ?? 'Guest'}</Text>
            </View>

            {/* Room access info */}
            <View style={styles.accessRow}>
              <View style={styles.accessItem}>
                <Text style={styles.accessIcon}>🏙️</Text>
                <Text style={styles.accessText}>
                  {FLOOR_OPTIONS.find((f) => f.key === floorPref)?.label}
                </Text>
              </View>
              <View style={styles.accessItem}>
                <Text style={styles.accessIcon}>{pillowPref === 'soft' ? '☁️' : '🧱'}</Text>
                <Text style={styles.accessText}>
                  {pillowPref === 'soft' ? 'Soft Pillow' : 'Firm Pillow'}
                </Text>
              </View>
              {earlyCheckIn && (
                <View style={styles.accessItem}>
                  <Text style={styles.accessIcon}>⏰</Text>
                  <Text style={styles.accessText}>Early</Text>
                </View>
              )}
            </View>
          </LinearGradient>

          {/* Add to Wallet button */}
          <TouchableOpacity
            style={styles.walletBtn}
            onPress={() => Alert.alert('Added!', 'Digital key added to your Explore Saudi Wallet.')}
          >
            <LinearGradient
              colors={['#c8a84b', '#a07830']}
              style={styles.walletBtnGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.walletBtnText}>💳 Add to Wallet</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center' },
  backBtn: {
    position: 'absolute',
    top: 55,
    left: spacing.md,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 30, color: colors.charcoal, lineHeight: 34 },
  screenTitle: {
    marginTop: 60,
    fontSize: typography.sizes.xl,
    fontWeight: '800',
    color: colors.charcoal,
  },
  screenSub: {
    fontSize: typography.sizes.sm,
    color: colors.slate,
    marginTop: 4,
    marginBottom: spacing.lg,
  },

  // Preferences scroll
  prefScroll: {
    paddingHorizontal: spacing.md,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'stretch',
    width: '100%',
  },

  // Guest info card
  guestCard: { padding: spacing.md, marginBottom: spacing.md },
  guestCardTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.pearl,
  },
  guestLabel: { fontSize: typography.sizes.sm, color: colors.slate },
  guestValue: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.charcoal },

  // ID verification card
  idCard: { padding: spacing.md, marginBottom: spacing.lg },
  idCardRow: { flexDirection: 'row', alignItems: 'center' },
  idCardIcon: { fontSize: 28, marginRight: spacing.sm },
  idCardInfo: { flex: 1 },
  idCardTitle: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.charcoal },
  idCardSub: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: 4 },

  // Preferences
  prefTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  prefLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  prefRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  prefOption: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.pearl,
    ...shadows.sm,
  },
  prefOptionActive: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  prefOptionIcon: { fontSize: 24, marginBottom: spacing.xs },
  prefOptionText: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.charcoal },
  prefOptionTextActive: { color: colors.primary },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.pearl,
    marginBottom: spacing.lg,
  },
  toggleRowActive: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  toggleLabel: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  toggleSub: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 4, maxWidth: 250 },
  toggleSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.pearl,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleSwitchOn: { backgroundColor: colors.primary },
  toggleKnob: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.white },
  toggleKnobOn: { alignSelf: 'flex-end' },

  // Progress bar
  progressTrack: {
    width: '80%',
    height: 6,
    backgroundColor: colors.pearl,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 3 },

  // Step icons
  stepIcons: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.pearl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconActive: { backgroundColor: colors.primary },
  stepIconDone: { backgroundColor: colors.success },
  stepIconEmoji: { fontSize: 22 },
  stepConnector: { width: 32, height: 3, backgroundColor: colors.pearl },
  stepConnectorDone: { backgroundColor: colors.success },

  // Step label
  stepLabelWrap: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  stepLabelText: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    textAlign: 'center',
  },
  stepLabelSub: {
    fontSize: typography.sizes.sm,
    color: colors.slate,
    marginTop: 4,
    textAlign: 'center',
  },

  // Key card
  cardWrap: { width: '90%', alignItems: 'stretch' },
  keyCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.large,
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -80,
    right: -40,
  },
  circle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(200,168,75,0.1)',
    bottom: -50,
    left: '30%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  cardHotelName: { fontSize: typography.sizes.lg, fontWeight: '800', color: colors.white },
  cardRoomLabel: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  cardKeyIcon: { fontSize: 32 },
  cardFooter: { marginTop: spacing.lg },
  cardDates: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  cardDateLabel: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.6)' },
  cardDateValue: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    color: colors.white,
    marginTop: 2,
  },
  cardDateDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: spacing.lg,
  },
  cardGuest: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.8)' },

  // Room access info
  accessRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
  },
  accessItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  accessIcon: { fontSize: 14 },
  accessText: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.7)' },

  // Wallet button
  walletBtn: { marginTop: spacing.md, borderRadius: borderRadius.lg, overflow: 'hidden' },
  walletBtnGrad: { paddingVertical: 14, alignItems: 'center' },
  walletBtnText: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.4,
  },
});
