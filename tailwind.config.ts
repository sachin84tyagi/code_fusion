import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
                serif: ['var(--font-source-serif)', 'Source Serif 4', 'Georgia', 'serif'],
                mono: ['var(--font-jetbrains-mono)', 'monospace'],
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                card: "var(--card)",
                "card-foreground": "var(--card-foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)",
                },
                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },
                border: "var(--border)",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            typography: () => ({
                DEFAULT: {
                    css: {
                        maxWidth: '72ch',
                        fontSize: '1.0625rem',
                        lineHeight: '1.75',
                        letterSpacing: '-0.003em',
                        p: {
                            marginTop: '1em',
                            marginBottom: '1em',
                        },
                        h1: {
                            letterSpacing: '-0.025em',
                            fontWeight: '700',
                        },
                        h2: {
                            letterSpacing: '-0.02em',
                            fontWeight: '650',
                        },
                        h3: {
                            letterSpacing: '-0.015em',
                            fontWeight: '600',
                        },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
export default config;

