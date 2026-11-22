/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '400px',
      },
      colors: {
        ocean: {
          950: '#040F18',
          900: '#071C2C', // Deep ocean navy
          800: '#0D273D',
          700: '#123B56', // Maritime blue
          600: '#1B4F72',
          500: '#2874A6',
          100: '#E8F1F5',
          50: '#F0F6F9',
        },
        teal: {
          brand: '#16A6A1', // Sea teal
          hover: '#138F8B',
          light: '#E6F7F6',
        },
        container: {
          orange: '#F28C45', // Container orange
          dark: '#D97129',
          light: '#FEF3EB',
        },
        maritime: {
          navy: '#071C2C',
          blue: '#123B56',
          teal: '#16A6A1',
          orange: '#F28C45',
          bg: '#F7F9FA',
          slate: '#526170',
          success: '#16865B',
          warning: '#D99127',
          error: '#C74747',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 2px 10px rgba(7, 28, 44, 0.05)',
        card: '0 4px 20px rgba(7, 28, 44, 0.08)',
        hover: '0 10px 30px rgba(7, 28, 44, 0.12)',
      },
    },
  },
  plugins: [],
}
