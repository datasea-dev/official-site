"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // 1. Cek posisi scroll
  useEffect(() => {
    const toggleVisibility = () => {
      // Jika scroll lebih dari 300px, tampilkan tombol
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    
    // Bersihkan event listener saat komponen dilepas
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // 2. Fungsi untuk scroll ke atas dengan mulus
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-3.5 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300/30 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Kembali ke atas"
    >
      <ArrowUp size={20} strokeWidth={3} />
    </button>
  );
}