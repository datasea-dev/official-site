"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react"; 
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Halaman Login: Render Polos (Tanpa Layout Admin)
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-900 relative selection:bg-blue-100 bg-slate-50 md:bg-transparent">
      
      {/* --- BACKGROUND BARU (Sesuai Website Utama) --- */}
      {/* White Magic Grid bersih: Garis #e5e7eb, Ukuran responsif */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_3rem] md:bg-[size:6rem_4rem]">
      </div>

      {/* --- HEADER KHUSUS MOBILE --- */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white sticky top-0 z-30 shadow-md">
         
         {/* POSISI KIRI: Logo & Tulisan */}
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
               <Image src="/logo-datasea.png" alt="DS" width={32} height={32} className="object-cover"/>
            </div>
            <div>
              <span className="font-bold text-lg block leading-none">Admin Panel</span>
              <span className="text-[10px] text-slate-300 uppercase tracking-wider">Datasea</span>
            </div>
         </div>

         {/* POSISI KANAN: Tombol Hamburger */}
         <button 
           onClick={() => setIsSidebarOpen(true)}
           className="p-2 rounded-lg hover:bg-white/10 transition-colors focus:ring-2 focus:ring-blue-500"
           aria-label="Buka Menu"
         >
           <Menu size={26} />
         </button>

      </div>

      {/* --- SIDEBAR (Responsive) --- */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* --- KONTEN UTAMA --- */}
      <div className="flex-1 md:ml-64 relative w-full">
        {children}
      </div>

    </div>
  );
}