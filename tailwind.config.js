/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.{js,ts,jsx,tsx,mdx}" // สแกนแม้กระทั่งไฟล์ที่อยู่นอกสุด
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};