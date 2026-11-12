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
        obsidian: {
          bg: '#1e1e1e',
          sidebar: '#161616',
          titlebar: '#141414',
          surface: '#202020',
          activeTab: '#262626',
          hover: '#2a2a2a',
          border: '#2e2e2e',
          borderLight: '#383838',
          text: '#dcddde',
          textMuted: '#8a8a8a',
          textFaint: '#5c5c5c',
          purple: '#7b68ee',
          purpleHover: '#6c5ce7',
          claude: '#d97757',
          claudeHover: '#c86848',
          claudeBg: 'rgba(217, 119, 87, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
