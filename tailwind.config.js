import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                theme: {
                    'azul-oscuro': '#292d66',
                    'azul': '#3154a2',
                    'morado': '#672577',
                    'gris': {
                        50: '#F9FAFB',
                        100: '#F3F4F6',
                        200: '#E5E7EB',
                        300: '#D1D5DB',
                    }
                }
            },
            boxShadow: {
                'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
            }
        },
    },

    plugins: [forms],
};
