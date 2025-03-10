import plugin from 'tailwindcss/plugin';

export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'pixel-border',
    'classic-border',
  ],
  theme: {
    extend: {
      boxShadow: {
        'pixel-shadow': '4px 4px 0px black',
        'classic-shadow': '0px 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.pixel-border': {
          border: '4px solid black',
        },
        '.classic-border': {
          border: '2px solid gray',
        },
      }, { variants: ['responsive', 'hover'] });
    }),
  ],
});
