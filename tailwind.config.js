export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        brand: {
          primary: '#1d4ed8', 
          secondary: '#a2e065', 
          tertiary: '#0f172a', 
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
        },
      },
    },
  },
}