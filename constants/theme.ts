export const colors = {
  // Primary
  green: '#1DB954',
  greenDark: '#158A3E',
  greenLight: '#E8F5EE',
  // Neutrals
  black: '#0A0A0A',
  dark: '#111111',
  body: '#444444',
  muted: '#888888',
  border: '#E2E2E2',
  surface: '#F7F8F7',
  white: '#FFFFFF',
  // Severity
  attention: '#EF4444',
  monitor: '#F59E0B',
  good: '#1DB954',
  // Phase 2 accent
  purple: '#7C3AED',
} as const;

export const fontFamily = {
  sans: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;
