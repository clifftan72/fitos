/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        green: '#1DB954',
        'green-dark': '#158A3E',
        'green-light': '#E8F5EE',
        dark: '#111111',
        body: '#444444',
        muted: '#888888',
        surface: '#F7F8F7',
        border: '#E2E2E2',
        attention: '#EF4444',
        monitor: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter_400Regular', 'system-ui'],
        medium: ['Inter_500Medium'],
        semibold: ['Inter_600SemiBold'],
        bold: ['Inter_700Bold'],
      },
    },
  },
  plugins: [],
};
