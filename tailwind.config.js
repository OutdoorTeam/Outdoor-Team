export default {
  darkMode: ['class'],
  content: ['./client/index.html', './client/src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: '#000000',
        foreground: '#ffffff',
        card: {
          DEFAULT: '#1a1a1a',
          foreground: '#ffffff',
        },
        popover: {
          DEFAULT: '#1a1a1a',
          foreground: '#ffffff',
        },
        primary: {
          DEFAULT: '#FFD700',
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: '#333333',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#333333',
          foreground: '#cccccc',
        },
        accent: {
          DEFAULT: '#FFD700',
          foreground: '#000000',
        },
        destructive: {
          DEFAULT: '#dc2626',
          foreground: '#ffffff',
        },
        border: '#444444',
        input: '#333333',
        ring: '#FFD700',
        chart: {
          1: '#FFD700',
          2: '#FFA500',
          3: '#FF8C00',
          4: '#FF7F50',
          5: '#FF6347',
        },
      },
      fontSize: {
        'base': ['16px', '1.5'],
        'lg': ['18px', '1.6'],
        'xl': ['20px', '1.7'],
        '2xl': ['24px', '1.8'],
        '3xl': ['30px', '1.9'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
