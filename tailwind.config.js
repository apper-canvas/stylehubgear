/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#f5f5f5',
        accent: '#ff3366',
        surface: '#ffffff',
        background: '#fafafa',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Bebas Neue', 'sans-serif']
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1' }],
        'display-md': ['2.8rem', { lineHeight: '1.1' }],
        'display-sm': ['2.25rem', { lineHeight: '1.2' }]
      },
animation: {
        'slide-in': 'slide-in 0.2s ease-out',
        'fade-in': 'fade-in 0.15s ease-out',
        'zoom-in': 'zoom-in 0.3s ease-out',
        'zoom-out': 'zoom-out 0.3s ease-out',
        'scale-up': 'scale-up 0.2s ease-out'
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'zoom-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'zoom-out': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.8)', opacity: '0' }
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' }
        }
      }
    },
  },
  plugins: [],
}