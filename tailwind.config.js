/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme colors
        'desert': {
          50: '#FAF7F2',
          100: '#F3EDE3',
          200: '#E6D9C7',
          300: '#D2B48C', // Sandy beige
          400: '#C47451', // Terracotta
          500: '#9CAF88', // Sage green
          600: '#8B4513', // Saddle brown
          700: '#654321', // Deep brown
          800: '#4A3219',
          900: '#2D1F10',
        },
        // Dark theme specific colors
        'night-desert': {
          50: '#1A1614',
          100: '#251E1B',
          200: '#312824',
          300: '#3D322D',
          400: '#4A3C36',
          500: '#574640',
          600: '#635049',
          700: '#705A53',
          800: '#7C645C',
          900: '#896E65',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'desert': '0 4px 6px -1px rgba(100, 67, 33, 0.1), 0 2px 4px -1px rgba(100, 67, 33, 0.06)',
      },
    },
  },
  plugins: [],
};