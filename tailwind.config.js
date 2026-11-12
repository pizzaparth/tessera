/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        amoled: {
          black: '#000000',
          dark: '#050505',
          surface: '#0a0a0a',
          card: '#101010',
          elevated: '#141414',
          hover: '#181818',
          border: '#1e1e1e',
          borderLight: '#282828',
          text: '#ffffff',
          textMuted: '#949494',
          textFaint: '#5a5a5a',
          purple: '#9d4edd',
          purpleHover: '#8b3bd6',
          cyan: '#00f5ff',
          mint: '#00ff88',
          rose: '#ff2a85',
          amber: '#ffb703',
          ai: '#d97757',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-purple': '0 0 20px -3px rgba(157, 78, 221, 0.45)',
        'glow-cyan': '0 0 20px -3px rgba(0, 245, 255, 0.45)',
        'glow-rose': '0 0 20px -3px rgba(255, 42, 133, 0.45)',
      },
    },
  },
  plugins: [],
};
