// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            animation: {
                // For ShimmerButton
                "shimmer-slide": "shimmer-slide var(--speed) linear infinite",
                "spin-around": "spin-around var(--speed) linear infinite",

                // For RetroGrid
                "grid": "grid 15s linear infinite",
            },
            keyframes: {
                // For ShimmerButton
                "shimmer-slide": {
                    "0%": { transform: "translate(-100%, -100%)" },
                    "100%": { transform: "translate(100%, 100%)" },
                },
                "spin-around": {
                    "0%": {
                        transform: "translate(-50%, -50%) rotate(0deg)",
                    },
                    "100%": {
                        transform: "translate(-50%, -50%) rotate(360deg)",
                    },
                },

                // For RetroGrid
                "grid": {
                    "0%": { transform: "translateY(-50%)" },
                    "100%": { transform: "translateY(0)" },
                },
            },
            // ...other extensions
        },
    },
    // ...other config
};