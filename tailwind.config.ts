import type { Config } from "tailwindcss";

const config: Config = {
  // BAGIAN INI KITA PERBAIKI
  content: [
    // Kita tambahkan jalur tanpa "src" agar aman
    "./app/**/*.{js,ts,jsx,tsx,mdx}", 
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    
    // Kita biarkan yang pakai "src" untuk jaga-jaga
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        datasea: {
          blue: "#222F4D",
          grey: "#a0a5b2",
        }
      },
    },
  },
  plugins: [],
};
export default config;