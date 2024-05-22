/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        max500: { max: '500px' },
        max1000: { max: '1000px' },
        max1250: { max: '1250px' },
        min1000: { min: '1000px' }
      }
    }
  },
  plugins: []
}
