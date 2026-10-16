/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emergency: {
          red: '#DC2626',
          green: '#16A34A',
          yellow: '#CA8A04',
          blue: '#2563EB'
        }
      }
    },
  },
  plugins: [],
}
