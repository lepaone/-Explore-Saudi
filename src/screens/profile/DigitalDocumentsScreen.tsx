import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { Document } from '../../types/models';

type DocType = 'passport' | 'driver_license' | 'visa' | 'insurance' | 'boarding_pass';

const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc_001',
    type: 'passport',
    title: 'Saudi Arabian Passport',
    number: 'P9876543',
    issuedDate: '2020-06-15',
    expiryDate: '2030-06-14',
    country: 'Saudi Arabia',
  },
  {
    id: 'doc_driver',
    type: 'driver_license',
    title: "Driver's License",
    number: 'DL-SA-4481237',
    issuedDate: '2022-03-10',
    expiryDate: '2027-03-09',
    country: 'Saudi Arabia',
  },
  {
    id: 'doc_002',
    type: 'visa',
    title: 'Tourist Visa',
    number: 'V-SA-4829101',
    issuedDate: '2026-03-01',
    expiryDate: '2026-09-01',
    country: 'Saudi Arabia',
  },
  {
    id: 'doc_003',
    type: 'insurance',
    title: 'Travel Health Insurance',
    number: 'INS-2026-88772',
    issuedDate: '2026-01-01',
    expiryDate: '2026-12-31',
    country: 'International',
  },
  {
    id: 'doc_004',
    type: 'boarding_pass',
    title: 'Boarding Pass',
    number: 'SV 432 · 10A',
    issuedDate: '2026-04-10',
    expiryDate: '2026-04-10',
    country: 'RUH → JED',
  },
];

const TABS: { key: DocType; label: string; icon: string }[] = [
  { key: 'passport', label: 'Passport', icon: '🛂' },
  { key: 'driver_license', label: 'License', icon: '🪪' },
  { key: 'visa', label: 'Visa', icon: '🔏' },
  { key: 'insurance', label: 'Insurance', icon: '🛡️' },
  { key: 'boarding_pass', label: 'Boarding', icon: '✈️' },
];

const DOC_COLORS: Record<DocType, string[]> = {
  passport: ['#053333', '#214242'],
  driver_license: ['#1a3a6b', '#2c5faa'],
  visa: ['#6a58af', '#846edb'],
  insurance: ['#2fba89', '#82d9bf'],
  boarding_pass: ['#962640', '#cf6d84'],
};

const UPLOADABLE: DocType[] = ['passport', 'driver_license'];

export default function DigitalDocumentsScreen() {
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<DocType>('passport');
  const [uploading, setUploading] = useState(false);
  // Map of docType → uploaded image URI
  const [uploadedImages, setUploadedImages] = useState<Partial<Record<DocType, string>>>({});

  const doc = MOCK_DOCUMENTS.find((d) => d.type === activeTab);
  const docColors = DOC_COLORS[activeTab];
  const isUploadable = UPLOADABLE.includes(activeTab);
  const uploadedUri = uploadedImages[activeTab];

  const isExpired = doc ? new Date(doc.expiryDate) < new Date() : false;
  const daysLeft = doc
    ? Math.max(0, Math.ceil((new Date(doc.expiryDate).getTime() - Date.now()) / 86400000))
    : 0;

  const pickDocument = (docType: DocType) => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,.pdf';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const uri = URL.createObjectURL(file);
          simulateUpload(docType, uri);
        }
      };
      input.click();
    } else {
      // Mobile: simulate camera/gallery capture
      simulateUpload(docType, 'mock://captured');
    }
  };

  const simulateUpload = (docType: DocType, uri: string) => {
    setUploading(true);
    setTimeout(() => {
      setUploadedImages((prev) => ({ ...prev, [docType]: uri }));
      setUploading(false);
      Alert.alert('Uploaded', 'Your document has been uploaded successfully.');
    }, 1500);
  };

  const removeDocument = (docType: DocType) => {
    Alert.alert('Remove Document', 'Are you sure you want to remove this document?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setUploadedImages((prev) => ({ ...prev, [docType]: undefined })),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Documents</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab selector */}
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBar}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {doc ? (
          <>
            {/* Upload section for passport & driver license */}
            {isUploadable && (
              <View style={styles.uploadSection}>
                {uploadedUri ? (
                  <View style={styles.uploadedWrap}>
                    {Platform.OS === 'web' ? (
                      <Image
                        source={{ uri: uploadedUri }}
                        style={styles.uploadedImg}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.uploadedMock}>
                        <Text style={styles.uploadedMockIcon}>🪪</Text>
                        <Text style={styles.uploadedMockText}>Document captured</Text>
                      </View>
                    )}
                    <View style={styles.uploadedActions}>
                      <TouchableOpacity
                        style={styles.replaceBtn}
                        onPress={() => pickDocument(activeTab)}
                      >
                        <Text style={styles.replaceBtnText}>📷 Replace</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => removeDocument(activeTab)}
                      >
                        <Text style={styles.removeBtnText}>🗑️ Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={() => pickDocument(activeTab)}
                    activeOpacity={0.8}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <ActivityIndicator color={colors.primary} size="large" />
                        <Text style={styles.uploadingText}>Uploading…</Text>
                      </>
                    ) : (
                      <>
                        <Text style={styles.uploadIcon}>📤</Text>
                        <Text style={styles.uploadTitle}>
                          Upload {activeTab === 'passport' ? 'Passport' : "Driver's License"}
                        </Text>
                        <Text style={styles.uploadSub}>
                          Tap to{' '}
                          {Platform.OS === 'web'
                            ? 'choose a file'
                            : 'take a photo or pick from gallery'}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Document card */}
            <View style={[styles.docCard, { backgroundColor: docColors[0] }]}>
              {/* Card header */}
              <View style={styles.docCardHeader}>
                <View>
                  <Text style={styles.docCardType}>{doc.title.toUpperCase()}</Text>
                  <Text style={styles.docCardOwner}>{user?.name ?? 'Traveller'}</Text>
                </View>
                <Text style={styles.docCardIcon}>
                  {TABS.find((t) => t.key === activeTab)?.icon}
                </Text>
              </View>

              {/* Document number */}
              <Text style={styles.docNumber}>{doc.number}</Text>

              {/* Dates */}
              <View style={styles.docDates}>
                <View>
                  <Text style={styles.docDateLabel}>ISSUED</Text>
                  <Text style={styles.docDateVal}>{doc.issuedDate}</Text>
                </View>
                <View>
                  <Text style={styles.docDateLabel}>EXPIRES</Text>
                  <Text style={styles.docDateVal}>{doc.expiryDate}</Text>
                </View>
                <View>
                  <Text style={styles.docDateLabel}>COUNTRY</Text>
                  <Text style={styles.docDateVal}>{doc.country}</Text>
                </View>
              </View>

              {/* QR / Barcode placeholder */}
              <View style={styles.qrBox}>
                <Text style={styles.qrText}>▐██ ███ ██▌</Text>
                <Text style={styles.qrSub}>Scan to verify</Text>
              </View>
            </View>

            {/* Status banner */}
            <View
              style={[styles.statusBanner, isExpired ? styles.statusExpired : styles.statusValid]}
            >
              <Text style={styles.statusIcon}>{isExpired ? '⚠️' : '✅'}</Text>
              <Text style={styles.statusText}>
                {isExpired ? 'This document has expired' : `Valid · ${daysLeft} days remaining`}
              </Text>
            </View>

            {/* Detail rows */}
            <View style={styles.detailCard}>
              <DetailRow label="Document Type" value={doc.type.replace('_', ' ').toUpperCase()} />
              <DetailRow label="Document Number" value={doc.number} />
              <DetailRow label="Issue Date" value={doc.issuedDate} />
              <DetailRow label="Expiry Date" value={doc.expiryDate} />
              <DetailRow label="Country / Route" value={doc.country} isLast />
            </View>

            <TouchableOpacity style={styles.shareBtn}>
              <Text style={styles.shareBtnText}>📤 Share Document</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📂</Text>
            <Text style={styles.emptyText}>No document found</Text>
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value, isLast }: { label: string; value: string; isLast?: boolean }) {
  return (
    <View style={[detailStyles.row, isLast && { borderBottomWidth: 0 }]}>
      <Text style={detailStyles.label}>{label}</Text>
      <Text style={detailStyles.value}>{value}</Text>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.pearl,
  },
  label: { fontSize: typography.sizes.sm, color: colors.slate },
  value: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.charcoal },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.pearl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 30, color: colors.charcoal, lineHeight: 34 },
  headerTitle: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.charcoal },
  tabBar: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.xs },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full ?? 100,
    backgroundColor: colors.pearl,
    marginRight: spacing.xs,
  },
  tabActive: { backgroundColor: colors.charcoal },
  tabIcon: { fontSize: 16, marginRight: 6 },
  tabLabel: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.slate },
  tabLabelActive: { color: colors.white },
  scroll: { padding: spacing.md },

  // Upload section
  uploadSection: { marginBottom: spacing.md },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  uploadIcon: { fontSize: 40, marginBottom: spacing.sm },
  uploadTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '700',
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  uploadSub: { fontSize: typography.sizes.sm, color: colors.slate, textAlign: 'center' },
  uploadingText: { fontSize: typography.sizes.sm, color: colors.slate, marginTop: spacing.sm },
  uploadedWrap: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  uploadedImg: { width: '100%', height: 180 },
  uploadedMock: {
    height: 140,
    backgroundColor: '#e8f0fb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadedMockIcon: { fontSize: 48, marginBottom: spacing.xs },
  uploadedMockText: { fontSize: typography.sizes.sm, color: colors.slate, fontWeight: '600' },
  uploadedActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  replaceBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  replaceBtnText: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.primary },
  removeBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.error,
    alignItems: 'center',
  },
  removeBtnText: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.error },

  // Document card
  docCard: {
    borderRadius: borderRadius.xl ?? 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.lg,
  },
  docCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  docCardType: {
    fontSize: typography.sizes.xs,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
  },
  docCardOwner: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: colors.white,
    marginTop: 4,
  },
  docCardIcon: { fontSize: 36 },
  docNumber: {
    fontSize: typography.sizes.xl,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 3,
    marginBottom: spacing.lg,
  },
  docDates: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg },
  docDateLabel: {
    fontSize: typography.sizes.xs,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  docDateVal: {
    fontSize: typography.sizes.sm,
    color: colors.white,
    fontWeight: '600',
    marginTop: 2,
  },
  qrBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  qrText: { fontSize: 22, color: colors.white, letterSpacing: 2 },
  qrSub: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.6)', marginTop: 6 },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  statusValid: { backgroundColor: '#e6f9f3' },
  statusExpired: { backgroundColor: '#fdecea' },
  statusIcon: { fontSize: 18, marginRight: spacing.sm },
  statusText: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.charcoal },
  detailCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  shareBtn: {
    borderWidth: 1.5,
    borderColor: colors.sand,
    borderRadius: borderRadius.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  shareBtnText: { fontSize: typography.sizes.md, fontWeight: '700', color: colors.sand },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl ?? 48 },
  emptyEmoji: { fontSize: 56, marginBottom: spacing.md },
  emptyText: { fontSize: typography.sizes.md, color: colors.slate },
});
