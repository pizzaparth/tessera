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
        background: {
          DEFAULT: '#faf9fc',
          subtle: '#f5f3ff',
          page: '#faf8ff',
        },
        surface: {
          DEFAULT: '#ffffff',
          elevated: '#ffffff',
          card: '#ffffff',
          muted: '#f8fafc',
          border: '#e2e8f0',
          borderLight: '#f1f5f9',
          hover: '#f8fafc',
        },
        ink: {
          DEFAULT: '#0f172a',
          secondary: '#334155',
          muted: '#64748b',
          faint: '#94a3b8',
        },
        tessera: {
          primary: '#6366f1',
          primaryHover: '#4f46e5',
          violet: '#7c3aed',
          sky: '#0ea5e9',
          mint: '#10b981',
          coral: '#f43f5e',
          amber: '#f59e0b',
          muted: '#64748b',
        },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'card': '0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.03)',
        'elevated': '0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.25)',
      },
      backgroundImage: {
        'dots-pattern': "radial-gradient(rgba(99, 102, 241, 0.12) 1px, transparent 1px)",
        'grid-pattern': "linear-gradient(to right, rgba(226, 232, 240, 0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(226, 232, 240, 0.6) 1px, transparent 1px)",
      },
      backgroundSize: {
        'dots-16': '16px 16px',
        'dots-24': '24px 24px',
        'grid-24': '24px 24px',
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
