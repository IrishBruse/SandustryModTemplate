/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}", "./modkit/ui/**/*.{ts,tsx,html}"],
  corePlugins: {
    preflight: false,
  },
};
