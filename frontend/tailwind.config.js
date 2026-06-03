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
        dark: {
          bg: '#080c14',
          card: 'rgba(17, 24, 39, 0.7)',
          border: 'rgba(255, 255, 255, 0.08)',
          text: '#f3f4f6',
          textMuted: '#9ca3af'
        },
        light: {
          bg: '#f8fafc',
          card: 'rgba(255, 255, 255, 0.7)',
          border: 'rgba(0, 0, 0, 0.06)',
          text: '#0f172a',
          textMuted: '#64748b'
        },
        brand: {
          primary: '#06b6d4',     // Cyan
          secondary: '#8b5cf6',   // Purple
          accent: '#ec4899',      // Pink
          hover: '#0891b2'
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-cyan': '0 0 15px rgba(6, 182, 212, 0.25)',
        'glow-purple': '0 0 15px rgba(139, 92, 246, 0.25)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
