"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; 
import { signOut } from "firebase/auth";
import { Timer, LogOut } from "lucide-react";

// ATUR DURASI DI SINI (10 Menit dalam milidetik)
const TIMEOUT_DURATION = 10 * 60 * 1000; 

export default function SessionGuard() {
  const router = useRouter();
  
  // State untuk mengontrol munculnya Alert Custom
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // Fungsi untuk update waktu terakhir aktif
    const updateActivity = () => {
      // Hanya update jika sesi belum habis agar tidak looping
      if (!isExpired) {
        localStorage.setItem("admin_last_activity", Date.now().toString());
      }
    };

    // Fungsi untuk cek apakah sesi sudah habis
    const checkSession = () => {
      const lastActivity = localStorage.getItem("admin_last_activity");
      
      // Jika belum pernah ada catatan waktu (login baru), set waktu sekarang
      if (!lastActivity) {
        updateActivity();
        return;
      }

      const now = Date.now();
      const timeDiff = now - parseInt(lastActivity);

      // Jika selisih waktu > 10 menit, Trigger Expired
      if (timeDiff > TIMEOUT_DURATION) {
        handleSessionExpiry();
      }
    };

    const handleSessionExpiry = async () => {
      try {
        // 1. Logout dari Firebase (Keamanan: Langsung putus koneksi)
        await signOut(auth);
        
        // 2. Hapus catatan waktu
        localStorage.removeItem("admin_last_activity"); 
        
        // 3. Munculkan Modal Custom (Gantikan alert biasa)
        setIsExpired(true);
        
      } catch (error) {
        console.error("Gagal logout:", error);
      }
    };

    // 1. Cek sesi saat komponen pertama kali dimuat
    checkSession();

    // 2. Pasang pendengar aktivitas
    const events = ["click", "keypress", "scroll", "mousemove"];
    events.forEach((event) => window.addEventListener(event, updateActivity));

    // 3. Cek sesi setiap 1 menit secara berkala
    const interval = setInterval(checkSession, 60 * 1000); 

    return () => {
      events.forEach((event) => window.removeEventListener(event, updateActivity));
      clearInterval(interval);
    };
  }, [router, isExpired]);

  // Fungsi untuk tombol "Login Kembali" pada Modal
  const handleRedirect = () => {
    router.push("/admin/login");
  };

  // --- RENDERING ---
  
  // Jika sesi belum habis, komponen tidak menampilkan apa-apa (invisible)
  if (!isExpired) return null;

  // Jika sesi habis, tampilkan Modal Custom
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300 ring-4 ring-white/20">
        
        {/* Icon Animasi */}
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 mx-auto border-4 border-red-100">
          <Timer size={32} className="text-red-500 animate-pulse" />
        </div>

        {/* Teks Peringatan */}
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Sesi Berakhir</h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Maaf, sesi Anda telah habis karena tidak ada aktivitas selama 10 menit. Demi keamanan, silakan login kembali.
        </p>

        {/* Tombol Aksi */}
        <button 
          onClick={handleRedirect}
          className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20"
        >
          <LogOut size={18} />
          Login Kembali
        </button>

      </div>
    </div>
  );
}