/** @type {import('tailwindcss').Config} */
export default module= {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensures Tailwind processes your React files
  ],
  theme: {
    extend: {}, // Extend the default theme if needed
  },
  plugins: [], // Add Tailwind plugins if required
};
