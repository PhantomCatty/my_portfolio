/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 如果源代码中有自定义的 animation 或 keyframes，它们通常是直接写在 class 里的
      // 但为了更好的效果，你可以在这里扩展主题
    },
  },
  plugins: [],
}
