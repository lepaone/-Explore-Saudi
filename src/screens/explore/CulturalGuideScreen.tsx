import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import { colors, gradients, typography, spacing, borderRadius } from '../../constants/theme';
import { culturalTips } from '../../services/mockData/culturalGuide';

export default function CulturalGuideScreen() {
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Header title="Cultural Guide" showBack onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={[...gradients.sunsetGradient]} style={styles.hero}>
          <Text style={styles.heroIcon}>{'\uD83C\uDDF8\uD83C\uDDE6'}</Text>
          <Text style={styles.heroTitle}>Saudi Cultural Guide</Text>
          <Text style={styles.heroSub}>
            Essential tips for a respectful and enriching visit to the Kingdom
          </Text>
        </LinearGradient>

        {/* Tips */}
        <View style={styles.section}>
          {culturalTips.map((tip) => {
            const isExpanded = expandedId === tip.id;
            return (
              <TouchableOpacity
                key={tip.id}
                activeOpacity={0.8}
                onPress={() => setExpandedId(isExpanded ? null : tip.id)}
              >
                <Card variant="outlined" style={styles.tipCard}>
                  <View style={styles.tipHeader}>
                    <Text style={styles.tipIcon}>{tip.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.tipTitle}>{tip.title}</Text>
                      <Text style={styles.tipTitleAr}>{tip.titleAr}</Text>
                    </View>
                    <Text style={styles.chevron}>{isExpanded ? '\u25B2' : '\u25BC'}</Text>
                  </View>

                  {isExpanded && (
                    <View style={styles.tipBody}>
                      <Text style={styles.tipDesc}>{tip.description}</Text>

                      <View style={styles.dosSection}>
                        <Text style={styles.dosTitle}>{'\u2705'} Do's</Text>
                        {tip.dos.map((d, i) => (
                          <Text key={i} style={styles.dosItem}>
                            {'\u2022'} {d}
                          </Text>
                        ))}
                      </View>

                      <View style={styles.dontsSection}>
                        <Text style={styles.dontsTitle}>{'\u274C'} Don'ts</Text>
                        {tip.donts.map((d, i) => (
                          <Text key={i} style={styles.dontsItem}>
                            {'\u2022'} {d}
                          </Text>
                        ))}
                      </View>
                    </View>
                  )}
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  hero: {
    margin: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  heroIcon: { fontSize: 48, marginBottom: spacing.sm },
  heroTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: typography.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  section: { paddingHorizontal: spacing.md },
  tipCard: { marginBottom: spacing.sm, padding: spacing.md },
  tipHeader: { flexDirection: 'row', alignItems: 'center' },
  tipIcon: { fontSize: 28, marginRight: spacing.sm },
  tipTitle: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  tipTitleAr: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 2 },
  chevron: { fontSize: 12, color: colors.slate },
  tipBody: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.pearl,
  },
  tipDesc: {
    fontSize: typography.sizes.sm,
    color: colors.slate,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  dosSection: { marginBottom: spacing.md },
  dosTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.success,
    marginBottom: spacing.xs,
  },
  dosItem: {
    fontSize: typography.sizes.sm,
    color: colors.charcoal,
    lineHeight: 22,
    paddingLeft: spacing.sm,
  },
  dontsSection: {},
  dontsTitle: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.error,
    marginBottom: spacing.xs,
  },
  dontsItem: {
    fontSize: typography.sizes.sm,
    color: colors.charcoal,
    lineHeight: 22,
    paddingLeft: spacing.sm,
  },
});
