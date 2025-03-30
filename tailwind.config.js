/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#111111',     // Dark black for primary background
        secondary: '#ffffff',   // White for text
        accent: '#ff5757',      // Red accent similar to links on Sarah's site
        highlight: '#00aaff',   // Blue highlight for hover states
        bgDark: '#000000',      // Pure black background 
        bgLight: '#ffffff',     // White background for light mode
        textDark: '#ffffff',    // White text for dark mode
        textLight: '#111111',   // Dark text for light mode
        muted: '#888888',       // Muted gray for secondary text
      },
    },
  },
  plugins: [],
  darkMode: 'class',
} 