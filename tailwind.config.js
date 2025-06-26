/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
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