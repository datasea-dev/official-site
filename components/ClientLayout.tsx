"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Deteksi apakah sedang berada di halaman admin
  const isAdminPage = pathname?.startsWith("/admin");

  // --- JIKA HALAMAN ADMIN ---
  // Tampilkan konten polos saja (karena Admin punya layout sendiri)
  if (isAdminPage) {
    return <>{children}</>;
  }

  // --- JIKA HALAMAN PUBLIK (BERANDA, DLL) ---
  // Tampilkan lengkap dengan Background Grid, Navbar, dan Footer
  return (
    <>
      {/* GLOBAL MAGIC GRID BACKGROUND (Hanya di Halaman Publik) */}
      <div className="fixed inset-0 -z-50 h-full w-full bg-white bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_3rem] md:bg-[size:6rem_4rem]">
        {/* Tidak ada radial gradient agar putih bersih */}
      </div>

      <Navbar />
      
      <main className="relative z-10">
        {children}
      </main>

      <ScrollToTop />
      <Footer />
    </>
  );
}