import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DATASEA - Offical Site",
  description: "Official Website of Datasea Community",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} bg-white text-slate-900`}>
        
        {/* --- GLOBAL MAGIC GRID BACKGROUND (Versi Putih Bersih) --- */}
        {/* bg-white: Warna dasar putih */}
        {/* linear-gradient(...): Garis grid halus berwarna abu-abu muda (#e5e7eb) */}
        <div className="fixed inset-0 -z-50 h-full w-full bg-white bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_3rem] md:bg-[size:6rem_4rem]">
          {/* Efek cahaya biru dihapus agar kembali putih bersih */}
        </div>

        <Navbar />
        
        {/* Konten Halaman */}
        <main className="relative z-10">
          {children}
        </main>

        <ScrollToTop />
        <Footer />
      </body>
    </html>
  );
}