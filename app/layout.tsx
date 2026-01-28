import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; 
import ClientLayout from "./ClientLayout"; // <--- Import file yang baru kita buat

const inter = Inter({ subsets: ["latin"] });

// --- BAGIAN SEO (METADATA) ---
export const metadata: Metadata = {
  metadataBase: new URL('https://datasea.my.id'), 
  title: {
    default: "Datasea - Komunitas Data Science & Teknologi",
    template: "%s | Datasea" 
  },
  description: "Bergabunglah dengan Datasea, ekosistem sains data dan teknologi terbesar di kampus. Temukan program kerja, event, dan lowongan volunteer terbaru.",
  keywords: ["Datasea", "Data Science", "Komunitas IT", "Mahasiswa", "Volunteer", "Organisasi Kampus"],
  authors: [{ name: "Tim IT Datasea" }],
  openGraph: {
    title: "Datasea - Komunitas Data Science",
    description: "Wadah pengembangan talenta digital dan sains data.",
    url: 'https://datasea.my.id',
    siteName: 'Datasea',
    locale: 'id_ID',
    type: 'website',
  },
  verification: {
    google:"PzG6o5WYeysuUOtYFv9bP3YlGwer0dvrk-vanOq7WKY", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      {/* Catatan: Tidak perlu tag <head> manual lagi, 
         Next.js otomatis membuatnya dari const metadata di atas 
      */}
      <body className={`${inter.className} bg-white text-slate-900`}>
        {/* Panggil ClientLayout untuk menangani Navbar/Footer */}
        <ClientLayout>
            {children}
        </ClientLayout>
      </body>
    </html>
  );
}