/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}", "./framework/ui/**/*.{ts,tsx,html}"],
  corePlugins: {
    preflight: false,
  },
};
