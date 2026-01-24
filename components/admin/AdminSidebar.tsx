"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Calendar, Briefcase, Users, MessageSquare, LogOut, X, 
  Target
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";
import Image from "next/image";

// Props untuk menerima state dari Layout
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Manajemen Acara", href: "/admin/manajemen_acara", icon: Calendar },
  { name: "Program Kerja", href: "/admin/manajemen_proker", icon: Briefcase },
  // --- MENU BARU (Lowongan) ---
  // Menggunakan icon Briefcase sesuai permintaan Anda
  { name: "Lowongan", href: "/admin/lowongan", icon: Briefcase }, 
  { name: "Anggota Tim", href: "/admin/manajemen_tim", icon: Users },
  { name: "Visi & Misi", href: "/admin/visi_misi", icon: Target }, 
  { name: "Pesan Masuk", href: "/admin/manajemen_pesan", icon: MessageSquare },
];

export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <>
      {/* --- OVERLAY GELAP (Hanya Mobile) --- */}
      <div 
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose} 
      />

      {/* --- SIDEBAR --- */}
      <aside 
        className={`
          fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white flex flex-col border-r border-slate-700/50 z-40 shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 
        `}
      >
        
        {/* Header Sidebar (Sticky Top) */}
        <div className="flex-shrink-0 p-6 border-b border-slate-700/50 flex items-center justify-between bg-[#0f172a]">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-inner flex-shrink-0">
               <Image src="/logo-datasea.png" alt="DS" width={32} height={32} className="object-cover" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight text-white leading-tight">Admin</h1>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-medium">Datasea</p>
            </div>
          </div>
          
          {/* Tombol Close (Hanya Mobile) */}
          <button 
            onClick={onClose}
            className="md:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items (Scrollable Area) */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={onClose} // Tutup sidebar saat menu diklik (UX Mobile)
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-1 ring-blue-500" 
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                }`}
              >
                {isActive && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-100 -z-10" />}
                <item.icon size={20} className={isActive ? "text-white" : "text-slate-400 group-hover:text-white transition-colors"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar (Sticky Bottom) */}
        <div className="flex-shrink-0 p-4 border-t border-slate-700/50 bg-[#0f172a]/50">
          <button 
            onClick={() => setShowLogoutModal(true)} 
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group border border-transparent hover:border-red-500/20"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            Keluar Sesi
          </button>
        </div>

      </aside>

      {/* Modal Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 ring-1 ring-slate-100">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-5 mx-auto border-4 border-red-100">
              <LogOut size={24} className="text-red-600 ml-1" />
            </div>
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Konfirmasi Keluar</h3>
              <p className="text-slate-500 text-sm leading-relaxed px-4">
                Apakah Anda yakin ingin mengakhiri sesi admin ini?
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                Batal
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}