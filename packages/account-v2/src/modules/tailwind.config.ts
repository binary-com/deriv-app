import type { Config } from 'tailwindcss';

export default {
    presets: [require('../../tailwind.config.ts')],
    content: ['../**/*.{jsx,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config;
