/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: '#465940',
        duskyLilac: '#88708E',
        irisMist: '#BAAAC8',
        milk: '#FDFBF0',
        cabernet: '#52171C',
        bgLight: '#FDFDFD',
        bgSidebar: '#F8F9FB',
        textDark: '#1A1A1A',
        textMuted: '#6B7280',
        brandBlue: '#2196F3',
        brandPurple: '#9C27B0',
        brandOrange: '#FF9800',
        brandGreen: '#4CAF50',
        brandRed: '#F44336',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', 'sans-serif'], 
        cursive: ['"Great Vibes"', 'cursive'],
      }
    },
  },
  plugins: [],
}
