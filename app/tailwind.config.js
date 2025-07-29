/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        // Mobile-first breakpoints (default mobile, then up)
        'sm': '640px',    // Small devices (landscape phones, 640px and up)
        'md': '768px',    // Medium devices (tablets, 768px and up)
        'lg': '1024px',   // Large devices (desktops, 1024px and up)
        'xl': '1280px',   // Extra large devices (large desktops, 1280px and up)
        '2xl': '1536px',  // 2X Extra large devices (larger desktops, 1536px and up)
      },
      colors: {
        // Deadhang Timer App Theme Colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Primary blue
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',  // Dark theme bg
          900: '#0f172a',  // Darker theme bg
        },
        success: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
        error: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Timer-specific font sizes
        'timer-xs': ['2rem', { lineHeight: '2.5rem' }],     // 32px
        'timer-sm': ['3rem', { lineHeight: '3.5rem' }],     // 48px
        'timer-md': ['4rem', { lineHeight: '4.5rem' }],     // 64px
        'timer-lg': ['6rem', { lineHeight: '6.5rem' }],     // 96px
        'timer-xl': ['8rem', { lineHeight: '8.5rem' }],     // 128px
      },
      spacing: {
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
        '128': '32rem',   // 512px
      },
      minHeight: {
        'screen-safe': 'calc(100vh - 2rem)',  // Safe area for mobile
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-soft': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
  darkMode: 'class', // Enable class-based dark mode
} 