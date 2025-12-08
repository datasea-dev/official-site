"use client";

import { Inter } from "next/font/google";
import "./globals.css"; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop"; // Pastikan komponen ini ada
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Deteksi apakah sedang di halaman admin
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <title>DATASEA - Official Site</title>
        <meta name="description" content="Official Website of Datasea Community" />
      </head>

      <body className={`${inter.className} bg-white text-slate-900`}>
        
        {/* --- LOGIKA TAMPILAN (Hanya untuk Public / Non-Admin) --- */}
        {!isAdmin && (
          <>
            {/* 1. GLOBAL MAGIC GRID BACKGROUND (Versi Putih Bersih) */}
            <div className="fixed inset-0 -z-50 h-full w-full bg-white bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_3rem] md:bg-[size:6rem_4rem]">
              {/* Efek cahaya dihapus sesuai permintaan agar putih bersih */}
            </div>

            {/* 2. Navbar Public */}
            <Navbar />
          </>
        )}

        {/* --- KONTEN UTAMA --- */}
        {isAdmin ? (
          // Jika Admin: Render langsung (Admin Layout yang akan handle style-nya)
          children
        ) : (
          // Jika Public: Bungkus dengan main relative z-10 agar di atas background grid
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

      </body>
    </html>
  );
}