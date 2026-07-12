import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
  colors,
  gradients,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../constants/theme';
import { SCREEN_WIDTH } from '../../constants/layout';
import { useVisaStore } from '../../store/useVisaStore';
import { useAuthStore } from '../../store/useAuthStore';
import { hotels } from '../../services/mockData/hotels';
import { formatCurrency } from '../../utils/formatters';

const FLIGHTS = [
  {
    id: 'f1',
    airline: 'Saudi Airlines (SAUDIA)',
    flightNumber: 'SV-301',
    departure: '08:30',
    arrival: '14:45',
    departureCity: 'Dubai (DXB)',
    arrivalCity: 'Riyadh (RUH)',
    class: 'Economy' as const,
    price: 850,
  },
  {
    id: 'f2',
    airline: 'Saudi Airlines (SAUDIA)',
    flightNumber: 'SV-502',
    departure: '10:15',
    arrival: '13:30',
    departureCity: 'London (LHR)',
    arrivalCity: 'Jeddah (JED)',
    class: 'Business' as const,
    price: 4200,
  },
  {
    id: 'f3',
    airline: 'flynas',
    flightNumber: 'XY-210',
    departure: '06:00',
    arrival: '09:15',
    departureCity: 'Cairo (CAI)',
    arrivalCity: 'Riyadh (RUH)',
    class: 'Economy' as const,
    price: 650,
  },
  {
    id: 'f4',
    airline: 'Saudi Airlines (SAUDIA)',
    flightNumber: 'SV-118',
    departure: '14:00',
    arrival: '20:30',
    departureCity: 'Istanbul (IST)',
    arrivalCity: 'Riyadh (RUH)',
    class: 'Business' as const,
    price: 3800,
  },
  {
    id: 'f5',
    airline: 'flyAdeal',
    flightNumber: 'F3-400',
    departure: '11:45',
    arrival: '15:00',
    departureCity: 'Bahrain (BAH)',
    arrivalCity: 'Jeddah (JED)',
    class: 'Economy' as const,
    price: 520,
  },
];

const ACTIVITIES = [
  {
    id: 'a1',
    name: 'Diriyah At-Turaif Heritage Tour',
    date: 'Flexible',
    city: 'Riyadh',
    price: 150,
  },
  { id: 'a2', name: 'Red Sea Coral Reef Diving', date: 'Flexible', city: 'NEOM', price: 450 },
  { id: 'a3', name: 'AlUla Hegra Guided Experience', date: 'Flexible', city: 'AlUla', price: 280 },
  { id: 'a4', name: 'Desert Safari & Camel Ride', date: 'Flexible', city: 'Riyadh', price: 200 },
  { id: 'a5', name: 'Jeddah Al-Balad Walking Tour', date: 'Flexible', city: 'Jeddah', price: 120 },
  { id: 'a6', name: 'Edge of the World Hike', date: 'Flexible', city: 'Riyadh', price: 180 },
  {
    id: 'a7',
    name: 'Boulevard Riyadh City Night Out',
    date: 'Flexible',
    city: 'Riyadh',
    price: 100,
  },
  {
    id: 'a8',
    name: 'Traditional Saudi Cooking Class',
    date: 'Flexible',
    city: 'Jeddah',
    price: 160,
  },
];

const STEPS = ['Package', 'Visa Info', 'Review'];

export default function VisaPackageScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const {
    currentPackage,
    visaApplication,
    setFlight,
    setHotel,
    addActivity,
    removeActivity,
    submitApplication,
  } = useVisaStore();
  const [step, setStep] = useState(0);
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [nights, setNights] = useState(5);
  const eligibleHotels = hotels.filter((h) => h.stars >= 4);

  // Visa form state
  const [visaForm, setVisaForm] = useState({
    fullName: user?.name ?? '',
    nationality: user?.nationality ?? '',
    passportNumber: user?.passportNumber ?? '',
    passportExpiry: '2028-06-15',
    dateOfBirth: '1990-05-20',
    gender: 'Male',
    phone: '+971-55-123-4567',
    email: user?.email ?? '',
    purposeOfVisit: 'Tourism',
    arrivalDate: '2026-05-01',
    departureDate: '2026-05-06',
  });

  const handleSelectFlight = (f: (typeof FLIGHTS)[0]) => {
    setSelectedFlightId(f.id);
    setFlight({ ...f, confirmed: true });
  };

  const handleSelectHotel = (h: (typeof eligibleHotels)[0]) => {
    setSelectedHotelId(h.id);
    const room = h.roomTypes[0];
    setHotel({
      id: h.id,
      name: h.name,
      city: h.city,
      stars: h.stars,
      checkIn: '2026-05-01',
      checkOut: '2026-05-06',
      roomType: room.name,
      pricePerNight: room.price,
      totalPrice: room.price * nights,
      confirmed: true,
    });
  };

  const handleSubmit = () => {
    submitApplication(visaForm);
    setStep(2);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <LinearGradient colors={['#051f1f', '#053333', '#214242']} style={styles.heroHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{'\u2039'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.heroEmoji}>{'\u2708\uFE0F'}</Text>
        <Text style={styles.heroTitle}>Your Visa Ready with{'\n'}Your Tourism Package</Text>
        <Text style={styles.heroSub}>
          Book your flight + 4★ hotel and get your e-Visa instantly
        </Text>

        {/* Step Indicator */}
        <View style={styles.stepRow}>
          {STEPS.map((s, i) => (
            <View key={s} style={styles.stepItem}>
              <View style={[styles.stepDot, i <= step && styles.stepDotActive]}>
                <Text style={[styles.stepNum, i <= step && styles.stepNumActive]}>
                  {i < step ? '✓' : i + 1}
                </Text>
              </View>
              <Text style={[styles.stepLabel, i <= step && styles.stepLabelActive]}>{s}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {step === 0 && (
          <>
            {/* Flight Selection */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>{'\u2708\uFE0F'}</Text>
                <Text style={styles.sectionTitle}>Select Your Flight</Text>
              </View>
              <Text style={styles.sectionSub}>Confirmed flight is required for visa</Text>
              {FLIGHTS.map((f) => (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.flightCard, selectedFlightId === f.id && styles.selectedCard]}
                  onPress={() => handleSelectFlight(f)}
                >
                  <View style={styles.flightTop}>
                    <Text style={styles.airlineName}>{f.airline}</Text>
                    <Text style={styles.flightClass}>{f.class}</Text>
                  </View>
                  <View style={styles.flightRoute}>
                    <View style={styles.flightCity}>
                      <Text style={styles.flightTime}>{f.departure}</Text>
                      <Text style={styles.flightCityName}>{f.departureCity}</Text>
                    </View>
                    <View style={styles.flightLine}>
                      <View style={styles.flightDot} />
                      <View style={styles.flightDash} />
                      <Text style={styles.flightPlane}>{'\u2708'}</Text>
                      <View style={styles.flightDash} />
                      <View style={styles.flightDot} />
                    </View>
                    <View style={styles.flightCity}>
                      <Text style={styles.flightTime}>{f.arrival}</Text>
                      <Text style={styles.flightCityName}>{f.arrivalCity}</Text>
                    </View>
                  </View>
                  <View style={styles.flightBottom}>
                    <Text style={styles.flightNum}>{f.flightNumber}</Text>
                    <Text style={styles.flightPrice}>{formatCurrency(f.price)}</Text>
                  </View>
                  {selectedFlightId === f.id && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>{'\u2713'} Selected</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Hotel Selection */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>{'\uD83C\uDFE8'}</Text>
                <Text style={styles.sectionTitle}>Select Your Hotel (4★+)</Text>
              </View>
              <Text style={styles.sectionSub}>Minimum 4-star hotel required for visa package</Text>

              <View style={styles.nightsRow}>
                <Text style={styles.nightsLabel}>Number of Nights:</Text>
                <View style={styles.nightsControl}>
                  <TouchableOpacity
                    style={styles.nightsBtn}
                    onPress={() => setNights(Math.max(2, nights - 1))}
                  >
                    <Text style={styles.nightsBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.nightsNum}>{nights}</Text>
                  <TouchableOpacity
                    style={styles.nightsBtn}
                    onPress={() => setNights(Math.min(30, nights + 1))}
                  >
                    <Text style={styles.nightsBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {eligibleHotels.map((h) => (
                <TouchableOpacity
                  key={h.id}
                  style={[styles.hotelCard, selectedHotelId === h.id && styles.selectedCard]}
                  onPress={() => handleSelectHotel(h)}
                >
                  <View style={styles.hotelTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.hotelName}>{h.name}</Text>
                      <View style={styles.starsRow}>
                        <Text style={styles.starsText}>{'⭐'.repeat(h.stars)}</Text>
                        <Text style={styles.hotelCity}>{h.city}</Text>
                      </View>
                    </View>
                    <View style={styles.hotelPriceBox}>
                      <Text style={styles.hotelPriceNight}>
                        {formatCurrency(h.roomTypes[0].price)}
                      </Text>
                      <Text style={styles.hotelPriceLabel}>/night</Text>
                    </View>
                  </View>
                  <View style={styles.hotelAmenities}>
                    {h.amenities.slice(0, 4).map((a) => (
                      <View key={a} style={styles.amenityChip}>
                        <Text style={styles.amenityText}>{a}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.hotelBottom}>
                    <Text style={styles.hotelRating}>
                      {'⭐'} {h.rating} ({h.reviewCount} reviews)
                    </Text>
                    <Text style={styles.hotelTotal}>
                      {nights} nights:{' '}
                      <Text style={{ fontWeight: '700' }}>
                        {formatCurrency(h.roomTypes[0].price * nights)}
                      </Text>
                    </Text>
                  </View>
                  {selectedHotelId === h.id && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>{'\u2713'} Selected</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Activities */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>{'\uD83C\uDFAD'}</Text>
                <Text style={styles.sectionTitle}>Add Activities (Optional)</Text>
              </View>
              <Text style={styles.sectionSub}>Enhance your package with experiences</Text>
              {ACTIVITIES.map((a) => {
                const added = currentPackage.activities.some((x) => x.id === a.id);
                return (
                  <TouchableOpacity
                    key={a.id}
                    style={[styles.activityCard, added && styles.activityAdded]}
                    onPress={() => (added ? removeActivity(a.id) : addActivity(a))}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.activityName}>{a.name}</Text>
                      <Text style={styles.activityCity}>{a.city}</Text>
                    </View>
                    <Text style={styles.activityPrice}>{formatCurrency(a.price)}</Text>
                    <View style={[styles.addBtn, added && styles.addBtnActive]}>
                      <Text style={[styles.addBtnText, added && styles.addBtnTextActive]}>
                        {added ? '✓' : '+'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Package Summary */}
            {(currentPackage.flight || currentPackage.hotel) && (
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Package Summary</Text>
                {currentPackage.flight && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Flight</Text>
                    <Text style={styles.summaryVal}>
                      {formatCurrency(currentPackage.flight.price)}
                    </Text>
                  </View>
                )}
                {currentPackage.hotel && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Hotel ({nights} nights)</Text>
                    <Text style={styles.summaryVal}>
                      {formatCurrency(currentPackage.hotel.totalPrice)}
                    </Text>
                  </View>
                )}
                {currentPackage.activities.length > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>
                      Activities ({currentPackage.activities.length})
                    </Text>
                    <Text style={styles.summaryVal}>
                      {formatCurrency(currentPackage.activities.reduce((s, a) => s + a.price, 0))}
                    </Text>
                  </View>
                )}
                <View style={[styles.summaryRow, styles.summaryTotal]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalVal}>{formatCurrency(currentPackage.totalPrice)}</Text>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.nextBtn,
                !(currentPackage.flight?.confirmed && currentPackage.hotel?.confirmed) &&
                  styles.nextBtnDisabled,
              ]}
              disabled={!(currentPackage.flight?.confirmed && currentPackage.hotel?.confirmed)}
              onPress={() => setStep(1)}
            >
              <LinearGradient colors={['#051f1f', '#053333']} style={styles.nextBtnGrad}>
                <Text style={styles.nextBtnText}>Continue to Visa Application {'\u2192'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {step === 1 && (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>{'\uD83D\uDCCB'}</Text>
                <Text style={styles.sectionTitle}>Visa Application</Text>
              </View>
              <Text style={styles.sectionSub}>Fill in your details for e-Visa issuance</Text>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Full Name (as in passport)</Text>
                <TextInput
                  style={styles.formInput}
                  value={visaForm.fullName}
                  onChangeText={(t) => setVisaForm({ ...visaForm, fullName: t })}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nationality</Text>
                <TextInput
                  style={styles.formInput}
                  value={visaForm.nationality}
                  onChangeText={(t) => setVisaForm({ ...visaForm, nationality: t })}
                />
              </View>
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.formLabel}>Passport Number</Text>
                  <TextInput
                    style={styles.formInput}
                    value={visaForm.passportNumber}
                    onChangeText={(t) => setVisaForm({ ...visaForm, passportNumber: t })}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Passport Expiry</Text>
                  <TextInput
                    style={styles.formInput}
                    value={visaForm.passportExpiry}
                    onChangeText={(t) => setVisaForm({ ...visaForm, passportExpiry: t })}
                  />
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.formLabel}>Date of Birth</Text>
                  <TextInput
                    style={styles.formInput}
                    value={visaForm.dateOfBirth}
                    onChangeText={(t) => setVisaForm({ ...visaForm, dateOfBirth: t })}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Gender</Text>
                  <TextInput
                    style={styles.formInput}
                    value={visaForm.gender}
                    onChangeText={(t) => setVisaForm({ ...visaForm, gender: t })}
                  />
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number</Text>
                <TextInput
                  style={styles.formInput}
                  value={visaForm.phone}
                  onChangeText={(t) => setVisaForm({ ...visaForm, phone: t })}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  style={styles.formInput}
                  value={visaForm.email}
                  onChangeText={(t) => setVisaForm({ ...visaForm, email: t })}
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.formLabel}>Arrival Date</Text>
                  <TextInput
                    style={styles.formInput}
                    value={visaForm.arrivalDate}
                    onChangeText={(t) => setVisaForm({ ...visaForm, arrivalDate: t })}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Departure Date</Text>
                  <TextInput
                    style={styles.formInput}
                    value={visaForm.departureDate}
                    onChangeText={(t) => setVisaForm({ ...visaForm, departureDate: t })}
                  />
                </View>
              </View>

              {/* Terms */}
              <View style={styles.termsBox}>
                <Text style={styles.termsText}>
                  By submitting, you agree to Saudi Arabia's e-Visa terms and conditions. Your
                  tourism package (confirmed flight + 4★+ hotel) qualifies you for instant visa
                  approval.
                </Text>
              </View>
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.backStepBtn} onPress={() => setStep(0)}>
                <Text style={styles.backStepText}>{'\u2190'} Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                <LinearGradient colors={['#051f1f', '#053333']} style={styles.submitGrad}>
                  <Text style={styles.submitText}>Submit & Get Visa {'\u2192'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === 2 && (
          <View style={styles.resultSection}>
            {visaApplication?.status === 'approved' ? (
              <>
                {/* Approved Visa Card */}
                <LinearGradient colors={['#051f1f', '#053333', '#214242']} style={styles.visaCard}>
                  <View style={styles.visaCardHeader}>
                    <Text style={styles.visaFlag}>{'\uD83C\uDDF8\uD83C\uDDE6'}</Text>
                    <View>
                      <Text style={styles.visaCardTitle}>Kingdom of Saudi Arabia</Text>
                      <Text style={styles.visaCardSub}>Electronic Tourist Visa</Text>
                    </View>
                  </View>
                  <View style={styles.visaDivider} />
                  <View style={styles.visaGrid}>
                    <View style={styles.visaField}>
                      <Text style={styles.visaFieldLabel}>Full Name</Text>
                      <Text style={styles.visaFieldVal}>{visaApplication.fullName}</Text>
                    </View>
                    <View style={styles.visaField}>
                      <Text style={styles.visaFieldLabel}>Visa Number</Text>
                      <Text style={styles.visaFieldVal}>{visaApplication.visaNumber}</Text>
                    </View>
                    <View style={styles.visaField}>
                      <Text style={styles.visaFieldLabel}>Nationality</Text>
                      <Text style={styles.visaFieldVal}>{visaApplication.nationality}</Text>
                    </View>
                    <View style={styles.visaField}>
                      <Text style={styles.visaFieldLabel}>Passport</Text>
                      <Text style={styles.visaFieldVal}>{visaApplication.passportNumber}</Text>
                    </View>
                    <View style={styles.visaField}>
                      <Text style={styles.visaFieldLabel}>Valid From</Text>
                      <Text style={styles.visaFieldVal}>{visaApplication.arrivalDate}</Text>
                    </View>
                    <View style={styles.visaField}>
                      <Text style={styles.visaFieldLabel}>Valid Until</Text>
                      <Text style={styles.visaFieldVal}>{visaApplication.departureDate}</Text>
                    </View>
                  </View>
                  <View style={styles.visaStatus}>
                    <Text style={styles.visaStatusIcon}>{'\u2705'}</Text>
                    <Text style={styles.visaStatusText}>APPROVED</Text>
                  </View>
                </LinearGradient>

                {/* Package Confirmation */}
                <View style={styles.confirmSection}>
                  <Text style={styles.confirmTitle}>
                    {'\uD83C\uDF89'} Your Package is Confirmed!
                  </Text>
                  {currentPackage.flight && (
                    <View style={styles.confirmCard}>
                      <Text style={styles.confirmIcon}>{'\u2708\uFE0F'}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.confirmName}>{currentPackage.flight.airline}</Text>
                        <Text style={styles.confirmDetail}>
                          {currentPackage.flight.departureCity} →{' '}
                          {currentPackage.flight.arrivalCity}
                        </Text>
                      </View>
                      <Text style={styles.confirmCheck}>{'\u2705'}</Text>
                    </View>
                  )}
                  {currentPackage.hotel && (
                    <View style={styles.confirmCard}>
                      <Text style={styles.confirmIcon}>{'\uD83C\uDFE8'}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.confirmName}>{currentPackage.hotel.name}</Text>
                        <Text style={styles.confirmDetail}>
                          {'⭐'.repeat(currentPackage.hotel.stars)} · {currentPackage.hotel.city}
                        </Text>
                      </View>
                      <Text style={styles.confirmCheck}>{'\u2705'}</Text>
                    </View>
                  )}
                  {currentPackage.activities.map((a) => (
                    <View key={a.id} style={styles.confirmCard}>
                      <Text style={styles.confirmIcon}>{'\uD83C\uDFAD'}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.confirmName}>{a.name}</Text>
                        <Text style={styles.confirmDetail}>{a.city}</Text>
                      </View>
                      <Text style={styles.confirmCheck}>{'\u2705'}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.totalCard}>
                  <Text style={styles.totalCardLabel}>Total Package Cost</Text>
                  <Text style={styles.totalCardVal}>
                    {formatCurrency(currentPackage.totalPrice)}
                  </Text>
                </View>

                <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
                  <Text style={styles.doneBtnText}>Done {'\u2713'}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.processingBox}>
                <Text style={styles.processingIcon}>{'\u23F3'}</Text>
                <Text style={styles.processingTitle}>Processing Your Visa...</Text>
                <Text style={styles.processingSub}>Your tourism package is being verified</Text>
              </View>
            )}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  heroHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: { marginBottom: spacing.sm },
  backText: { color: 'rgba(255,255,255,0.8)', fontSize: typography.sizes.md },
  heroEmoji: { fontSize: 40, marginBottom: spacing.xs },
  heroTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 34,
  },
  heroSub: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.8)', marginTop: spacing.xs },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: spacing.xl,
  },
  stepItem: { alignItems: 'center' },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: { backgroundColor: colors.white },
  stepNum: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.5)' },
  stepNumActive: { color: colors.teal },
  stepLabel: { fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  stepLabelActive: { color: colors.white },
  body: { flex: 1 },
  section: { padding: spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  sectionIcon: { fontSize: 22, marginRight: spacing.xs },
  sectionTitle: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.charcoal },
  sectionSub: { fontSize: typography.sizes.xs, color: colors.slate, marginBottom: spacing.md },
  flightCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.pearl,
  },
  selectedCard: { borderColor: colors.teal, borderWidth: 2 },
  flightTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  airlineName: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.charcoal },
  flightClass: {
    fontSize: typography.sizes.xs,
    color: colors.teal,
    fontWeight: '600',
    backgroundColor: 'rgba(132,110,219,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  flightRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  flightCity: { alignItems: 'center', width: 100 },
  flightTime: { fontSize: typography.sizes.xl, fontWeight: '700', color: colors.charcoal },
  flightCityName: { fontSize: 10, color: colors.slate, marginTop: 2, textAlign: 'center' },
  flightLine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  flightDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.teal },
  flightDash: { flex: 1, height: 1, backgroundColor: colors.pearl },
  flightPlane: { fontSize: 16, color: colors.teal, marginHorizontal: 4 },
  flightBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  flightNum: { fontSize: typography.sizes.xs, color: colors.slate },
  flightPrice: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.teal },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.teal,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  selectedBadgeText: { color: colors.white, fontSize: 10, fontWeight: '700' },
  nightsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  nightsLabel: { fontSize: typography.sizes.sm, color: colors.charcoal, fontWeight: '600' },
  nightsControl: { flexDirection: 'row', alignItems: 'center' },
  nightsBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nightsBtnText: { color: colors.white, fontSize: 18, fontWeight: '700' },
  nightsNum: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    marginHorizontal: spacing.md,
  },
  hotelCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.pearl,
  },
  hotelTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  hotelName: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.charcoal },
  starsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  starsText: { fontSize: 12 },
  hotelCity: { fontSize: typography.sizes.xs, color: colors.slate, marginLeft: 6 },
  hotelPriceBox: { alignItems: 'flex-end' },
  hotelPriceNight: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.teal },
  hotelPriceLabel: { fontSize: 10, color: colors.slate },
  hotelAmenities: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginVertical: spacing.xs },
  amenityChip: {
    backgroundColor: colors.pearl,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  amenityText: { fontSize: 10, color: colors.slate },
  hotelBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  hotelRating: { fontSize: typography.sizes.xs, color: colors.slate },
  hotelTotal: { fontSize: typography.sizes.sm, color: colors.charcoal },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.pearl,
  },
  activityAdded: { borderColor: colors.teal, backgroundColor: 'rgba(132,110,219,0.03)' },
  activityName: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.charcoal },
  activityCity: { fontSize: typography.sizes.xs, color: colors.slate },
  activityPrice: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    color: colors.teal,
    marginRight: spacing.sm,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnActive: { backgroundColor: colors.teal },
  addBtnText: { fontSize: 16, color: colors.teal, fontWeight: '700' },
  addBtnTextActive: { color: colors.white },
  summaryCard: {
    margin: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  summaryTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  summaryLabel: { fontSize: typography.sizes.sm, color: colors.slate },
  summaryVal: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.charcoal },
  summaryTotal: { borderTopWidth: 1, borderTopColor: colors.pearl, marginTop: 4, paddingTop: 8 },
  totalLabel: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.charcoal },
  totalVal: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.teal },
  nextBtn: { margin: spacing.md, borderRadius: borderRadius.lg, overflow: 'hidden' },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnGrad: { paddingVertical: 16, alignItems: 'center', borderRadius: borderRadius.lg },
  nextBtnText: { color: colors.white, fontSize: typography.sizes.md, fontWeight: '700' },
  formGroup: { marginBottom: spacing.md },
  formLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
    color: colors.slate,
    marginBottom: 4,
  },
  formInput: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: typography.sizes.md,
    color: colors.charcoal,
    borderWidth: 1,
    borderColor: colors.pearl,
  },
  formRow: { flexDirection: 'row' },
  termsBox: {
    backgroundColor: 'rgba(132,110,219,0.05)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  termsText: { fontSize: typography.sizes.xs, color: colors.slate, lineHeight: 18 },
  btnRow: { flexDirection: 'row', padding: spacing.md, gap: spacing.sm },
  backStepBtn: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: colors.pearl,
    borderRadius: borderRadius.lg,
  },
  backStepText: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  submitBtn: { flex: 2, borderRadius: borderRadius.lg, overflow: 'hidden' },
  submitGrad: { paddingVertical: 16, alignItems: 'center', borderRadius: borderRadius.lg },
  submitText: { color: colors.white, fontSize: typography.sizes.md, fontWeight: '700' },
  resultSection: { padding: spacing.md },
  visaCard: { borderRadius: borderRadius.xl, padding: spacing.lg, marginBottom: spacing.md },
  visaCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  visaFlag: { fontSize: 36, marginRight: spacing.sm },
  visaCardTitle: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.white },
  visaCardSub: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.8)' },
  visaDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: spacing.md },
  visaGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  visaField: { width: '50%', marginBottom: spacing.sm },
  visaFieldLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' },
  visaFieldVal: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.white,
    marginTop: 2,
  },
  visaStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  visaStatusIcon: { fontSize: 20, marginRight: spacing.xs },
  visaStatusText: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 2,
  },
  confirmSection: { marginBottom: spacing.md },
  confirmTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.md,
  },
  confirmCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  confirmIcon: { fontSize: 24, marginRight: spacing.sm },
  confirmName: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.charcoal },
  confirmDetail: { fontSize: typography.sizes.xs, color: colors.slate },
  confirmCheck: { fontSize: 18 },
  totalCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  totalCardLabel: { fontSize: typography.sizes.sm, color: colors.slate },
  totalCardVal: {
    fontSize: typography.sizes.hero,
    fontWeight: '700',
    color: colors.teal,
    marginTop: 4,
  },
  doneBtn: {
    backgroundColor: colors.teal,
    borderRadius: borderRadius.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneBtnText: { color: colors.white, fontSize: typography.sizes.md, fontWeight: '700' },
  processingBox: { alignItems: 'center', paddingVertical: spacing.xxl },
  processingIcon: { fontSize: 48 },
  processingTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.charcoal,
    marginTop: spacing.md,
  },
  processingSub: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: spacing.xs },
});
