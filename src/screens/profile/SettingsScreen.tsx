import React from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Header from '../../components/common/Header';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';
import { useSettingsStore } from '../../store/useSettingsStore';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { language, theme, notifications, setLanguage, toggleTheme, toggleNotifications } =
    useSettingsStore();

  return (
    <View style={styles.container}>
      <Header title={t('settings.title')} showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Language */}
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        <View style={styles.langRow}>
          {(['en', 'ar'] as const).map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[styles.langBtn, language === lang && styles.langBtnActive]}
              onPress={() => setLanguage(lang)}
            >
              <Text style={[styles.langText, language === lang && styles.langTextActive]}>
                {lang === 'en' ? '🇬🇧 English' : '🇸🇦 العربية'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>{t('settings.preferences')}</Text>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>{t('settings.darkMode')}</Text>
            <Text style={styles.settingDesc}>{t('settings.darkModeDesc')}</Text>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.pearl, true: colors.sand }}
            thumbColor={colors.white}
          />
        </View>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>{t('settings.pushNotifications')}</Text>
            <Text style={styles.settingDesc}>{t('settings.pushNotificationsDesc')}</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: colors.pearl, true: colors.sand }}
            thumbColor={colors.white}
          />
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>{t('settings.version')}</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>{t('settings.build')}</Text>
          <Text style={styles.aboutValue}>2026.04.05</Text>
        </View>

        {/* Links */}
        <Text style={styles.sectionTitle}>{t('settings.support')}</Text>
        {(
          [
            t('settings.privacyPolicy'),
            t('settings.termsOfService'),
            t('settings.helpCenter'),
            t('settings.rateApp'),
          ] as const
        ).map((item) => (
          <TouchableOpacity key={item} style={styles.linkRow}>
            <Text style={styles.linkText}>{item}</Text>
            <Text style={styles.linkArrow}>{'\u203A'}</Text>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
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
  langRow: { flexDirection: 'row', gap: spacing.sm },
  langBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.pearl,
  },
  langBtnActive: { backgroundColor: colors.sand },
  langText: { fontSize: typography.sizes.md, fontWeight: '600', color: colors.charcoal },
  langTextActive: { color: colors.white },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.pearl,
  },
  settingLabel: { fontSize: typography.sizes.md, color: colors.charcoal },
  settingDesc: { fontSize: typography.sizes.xs, color: colors.slate, marginTop: 2 },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.pearl,
  },
  aboutLabel: { fontSize: typography.sizes.md, color: colors.charcoal },
  aboutValue: { fontSize: typography.sizes.md, color: colors.slate },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.pearl,
  },
  linkText: { fontSize: typography.sizes.md, color: colors.charcoal },
  linkArrow: { fontSize: 22, color: colors.slate },
});
