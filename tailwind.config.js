const plugin = require('tailwindcss/plugin');

module.exports = {
    content: ['./src/**/*.{html,js,vue}'], // Adjust paths based on your project structure
    theme: {},
    plugins: [
        plugin(function ({ addComponents }) {
            addComponents({
                '@layer components': {
                    '.pixel-plugin': {
                        boxShadow: '4px 4px 0px var(--tw-shadow-color, rgba(0, 0, 0, 1))',
                        marginRight: '4px',
                        marginBottom: '4px',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            boxShadow: '-4px -4px 0px var(--tw-shadow-color, rgba(0, 0, 0, 0.4))',
                        },
                    },
                },
            });
        }),
    ],
};
