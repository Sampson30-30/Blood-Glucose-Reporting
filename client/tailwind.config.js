/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        glucose: {
          low: '#ef4444',
          inrange: '#22c55e',
          high: '#f97316',
          veryhigh: '#dc2626',
        },
      },
    },
  },
  plugins: [],
};
