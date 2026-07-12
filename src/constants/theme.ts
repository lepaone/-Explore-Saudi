import { Platform } from 'react-native';

// Design system — Explore Saudi (Kingdom of Saudi Arabia)
// Primary: Saudi Green (#1b6b3a) — brand, CTAs, active states
// Gold:    Desert Gold (#c8a84b) — accents, wallet, highlights
// Dark:    Deep teal-black (#051f1f) — body text, headers

export const colors = {
  // Primary brand — Saudi green
  primary: '#1b6b3a',
  primaryLight: '#2d8f55',
  primaryDark: '#0f4522',

  // Gold / desert accent
  gold: '#c8a84b',
  goldLight: '#e8c96b',
  goldDark: '#a07830',

  // Secondary / lime badge
  secondary: '#d7f285',
  secondaryDark: '#b5cc5e',

  // Dark backgrounds
  teal: '#053333',
  tealLight: '#214242',
  tealDark: '#051f1f',

  // Mint / info accent
  mint: '#82d9bf',
  mintLight: '#b4e8d9',

  // Neutrals
  charcoal: '#051f1f',
  slate: '#547070',
  pearl: '#e6ebeb',
  cream: '#f8f9fa',
  white: '#FFFFFF',

  // Semantic
  success: '#2fba89',
  warning: '#ffb752',
  error: '#962640',
  info: '#82d9bf',

  // Legacy aliases — mapped to green
  sand: '#1b6b3a',
  sandLight: '#2d8f55',
  sandDark: '#0f4522',
} as const;

export const gradients = {
  goldGradient: ['#c8a84b', '#e8c96b', '#a07830'] as const,
  tealGradient: ['#051f1f', '#053333', '#214242'] as const,
  nightGradient: ['#051f1f', '#053333', '#547070'] as const,
  sunsetGradient: ['#1b6b3a', '#82d9bf', '#053333'] as const,
  heroGradient: ['#0f4522', '#1b6b3a', '#2d8f55'] as const,
  mtGovGradient: ['#003232', '#009696', '#007846', '#00a000'] as const,
  primaryGradient: ['#0f4522', '#1b6b3a', '#2d8f55'] as const,
  goldGreenGradient: ['#c8a84b', '#1b6b3a'] as const,
  successGradient: ['#2fba89', '#82d9bf'] as const,
} as const;

export const typography = {
  fontFamily: {
    regular: 'System',
    semibold: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    hero: 36,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const shadows = {
  // Short aliases
  sm: Platform.select({
    ios: {
      shadowColor: '#030f0f',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    android: { elevation: 3 },
    default: {
      shadowColor: '#030f0f',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#030f0f',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.14,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
    default: {
      shadowColor: '#030f0f',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.14,
      shadowRadius: 12,
    },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#030f0f',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 22,
    },
    android: { elevation: 12 },
    default: {
      shadowColor: '#030f0f',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 22,
    },
  }),
  // Legacy long aliases
  small: Platform.select({
    ios: {
      shadowColor: '#030f0f',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    android: { elevation: 3 },
    default: {
      shadowColor: '#030f0f',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
  }),
  medium: Platform.select({
    ios: {
      shadowColor: '#030f0f',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.14,
      shadowRadius: 12,
    },
    android: { elevation: 6 },
    default: {
      shadowColor: '#030f0f',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.14,
      shadowRadius: 12,
    },
  }),
  large: Platform.select({
    ios: {
      shadowColor: '#030f0f',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 22,
    },
    android: { elevation: 12 },
    default: {
      shadowColor: '#030f0f',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 22,
    },
  }),
} as const;
