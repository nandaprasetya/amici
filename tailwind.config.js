/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/**/*.blade.php',
        './resources/**/*.tsx',
        './resources/**/*.ts',
        './resources/**/*.jsx',
        './resources/**/*.js',
    ],
    theme: {
        extend: {
            fontFamily: {
                montserrat: [
                    'Montserrat',
                    'sans-serif',
                    ...defaultTheme.fontFamily.sans,
                ],
            },
        },
    },
    plugins: [],
};
