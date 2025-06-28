/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'app': 'var(--app-text-color)',
                'app-bg': 'var(--app-bg-color)',
                'app-secondary': 'var(--app-secondary-bg)',
                'app-card': 'var(--app-card-bg)',
                'app-border': 'var(--app-border-color)',
                'app-primary': 'var(--app-primary-color)',
                'app-hover': 'var(--app-hover-bg)',
            },
            backgroundColor: {
                'app': 'var(--app-bg-color)',
                'app-secondary': 'var(--app-secondary-bg)',
                'app-card': 'var(--app-card-bg)',
                'app-hover': 'var(--app-hover-bg)',
            },
            textColor: {
                'app': 'var(--app-text-color)',
                'app-primary': 'var(--app-primary-color)',
            },
            borderColor: {
                'app': 'var(--app-border-color)',
            },
            typography: {
                DEFAULT: {
                    css: {
                        ul: {
                            'list-style-type': 'disc',
                            'list-style-position': 'outside',
                            'display': 'block',
                            'margin-top': '1em',
                            'margin-bottom': '1em',
                            'padding-left': '1.5em',
                        },
                        ol: {
                            'list-style-type': 'decimal',
                            'list-style-position': 'outside',
                            'display': 'block',
                            'margin-top': '1em',
                            'margin-bottom': '1em',
                            'padding-left': '1.5em',
                        },
                        li: {
                            'display': 'list-item',
                            'margin-top': '0.5em',
                            'margin-bottom': '0.5em',
                        },
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}