/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./App.tsx"
    ],
    theme: {
        extend: {
            animation: {
                'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shine': 'shine 3s infinite',
            },
            keyframes: {
                shine: {
                    'from': { transform: 'translateX(-100%) skewX(-20deg)' },
                    'to': { transform: 'translateX(250%) skewX(-20deg)' },
                }
            }
        },
    },
    plugins: [],
    darkMode: 'class',
}
