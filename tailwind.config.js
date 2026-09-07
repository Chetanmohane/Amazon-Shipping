/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amazon: {
          dark: '#131921',
          lightDark: '#232F3E',
          orange: '#FF9900',
          yellow: '#FEBD69',
          blue: '#007185',
          bg: '#EAEDED',
          card: '#FFFFFF',
          green: '#00853D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
