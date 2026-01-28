"use client"; // Wajib ada karena pakai usePathname

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Deteksi apakah sedang di halaman admin
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
       {/* --- LOGIKA TAMPILAN (Hanya untuk Public / Non-Admin) --- */}
       {!isAdmin && (
          <>
            {/* 1. GLOBAL MAGIC GRID BACKGROUND (Versi Putih Bersih) */}
            <div className="fixed inset-0 -z-50 h-full w-full bg-white bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_3rem] md:bg-[size:6rem_4rem]">
            </div>

            {/* 2. Navbar Public */}
            <Navbar />
          </>
        )}

        {/* --- KONTEN UTAMA --- */}
        {isAdmin ? (
          // Jika Admin: Render langsung
          children
        ) : (
          // Jika Public: Bungkus dengan main relative z-10
          <main className="relative z-10">
            {children}
          </main>
        )}

        {/* --- FOOTER & SCROLL (Hanya untuk Public) --- */}
        {!isAdmin && (
          <>
            <ScrollToTop />
            <Footer />
          </>
        )}
    </>
  );
}