/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores primarios GoSteam (identidad de marca)
        'gosteam': {
          pink: '#C83E7F',      // rgb(200, 62, 127) - Color primario
          yellow: '#FBEB4E',    // rgb(251, 235, 78) - Resaltados y acentos
          green: '#8DB442',     // rgb(141, 180, 66)
          blue: '#49A0DE',      // rgb(73, 160, 222)
        },
        // Alias para compatibilidad
        'gosteam-purple': {
          DEFAULT: '#C83E7F',
          dark: '#A0325F',
          light: '#D86199',
        },
        // Colores de categorías usando la paleta de marca
        'category-steam': '#C83E7F',    // Rosa/Magenta
        'category-creativity': '#FBEB4E', // Amarillo
        'category-ia': '#49A0DE',        // Azul
        'category-citizenship': '#8DB442', // Verde
        'category-science': '#49A0DE',   // Azul
      },
      fontFamily: {
        sans: ['Titillium Web', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Titillium Web', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
