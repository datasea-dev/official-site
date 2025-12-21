"use client";

import { useState, useEffect } from "react";
import { 
  MessageSquare, Calendar, Users, ArrowUpRight, Clock, Eye, Loader2 
} from "lucide-react"; // Phone dihapus dari import karena tidak dipakai di list luar
import { auth } from "@/lib/firebase";
import { 
  getMessages, getAcaraData, getTimData, MessageData 
} from "@/lib/firestoreService";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [stats, setStats] = useState({
    totalPesan: 0,
    pesanBaru: 0,
    acaraAktif: 0,
    totalAcara: 0,
    totalAnggota: 0
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/admin/login");
      } else {
        setUser(currentUser);
        await loadAllData();
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const loadAllData = async () => {
    try {
      const msgData = await getMessages();
      setMessages(msgData);
      const pesanBaruCount = msgData.filter((m) => m.status === "Baru").length;

      const acaraData = await getAcaraData();
      const acaraAktifCount = acaraData.filter((a) => 
        a.status_acara === "Segera" || a.status_acara === "Berlangsung"
      ).length;

      const timData = await getTimData();

      setStats({
        totalPesan: msgData.length,
        pesanBaru: pesanBaruCount,
        acaraAktif: acaraAktifCount,
        totalAcara: acaraData.length,
        totalAnggota: timData.length
      });

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const handleOpenDetail = (id: string) => {
    router.push(`/admin/manajemen_pesan?open=${id}`);
  };

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (e) { return "-"; }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-slate-400">
      <Loader2 className="animate-spin mr-2" /> Memuat Dashboard...
    </div>
  );

  return (
    <main className="p-4 md:p-8 w-full flex flex-col min-h-screen">
      
      {/* Header */}
      <header className="flex justify-between items-center mb-6 md:mb-10">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-xs md:text-sm">Selamat datang, Admin!</p>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
           <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-700">{user?.email}</p>
              <p className="text-xs text-slate-500">Administrator</p>
           </div>
           <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-sm md:text-base">
              {user?.email?.charAt(0).toUpperCase() || "A"}
           </div>
        </div>
      </header>

      {/* Statistik Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-10">
        <StatCard 
          icon={<MessageSquare className="text-blue-500" />} 
          label="Pesan Masuk" 
          value={stats.totalPesan.toString()} 
          subtext={`${stats.pesanBaru} Belum dibaca`} 
          color="blue"
        />
        <StatCard 
          icon={<Calendar className="text-purple-500" />} 
          label="Acara Aktif" 
          value={stats.acaraAktif.toString()} 
          subtext={`Dari Total ${stats.totalAcara} Acara`} 
          color="purple"
        />
        <StatCard 
          icon={<Users className="text-orange-500" />} 
          label="Total Anggota" 
          value={stats.totalAnggota.toString()} 
          subtext="Tim Datasea" 
          color="orange"
        />
      </div>

      {/* List Pesan Terbaru (CARD STYLE - NO SCROLL) */}
      <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-1">
        
        <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 text-sm md:text-base">
            <MessageSquare size={18} className="text-blue-500"/> 
            Pesan Terbaru
          </h2>
          <button 
            onClick={() => router.push('/admin/manajemen_pesan')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Lihat Semua <ArrowUpRight size={14} />
          </button>
        </div>
        
        <div className="flex flex-col">
          {messages.length > 0 ? (
            messages.slice(0, 5).map((msg) => (
              // CARD ITEM
              <div 
                key={msg.id} 
                className="p-4 border-b border-slate-100 last:border-0 hover:bg-blue-50/40 transition-colors flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center"
              >
                
                {/* 1. Avatar & Identitas */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${msg.status === 'Baru' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                      {(msg.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-sm text-slate-800 truncate ${msg.status === 'Baru' ? 'font-bold' : 'font-medium'}`}>
                        {msg.name || "Tanpa Nama"}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">{msg.instansi || "-"}</p>
                      {/* NOMOR TELEPON DIHAPUS DARI SINI */}
                    </div>
                </div>

                {/* 2. Cuplikan Pesan */}
                <div className="hidden sm:block flex-1 min-w-0">
                    <p className="text-sm text-slate-600 line-clamp-1">{msg.message}</p>
                </div>

                {/* 3. Meta Data & Aksi */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-1 sm:mt-0 pl-13 sm:pl-0">
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        msg.status === 'Baru' ? 'bg-blue-100 text-blue-600' : 
                        msg.status === 'Selesai' ? 'bg-green-100 text-green-600' : 
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {msg.status}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock size={10} /> {formatDate(msg.createdAt)}
                      </span>
                    </div>

                    <button 
                      onClick={() => handleOpenDetail(msg.id)}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                    >
                      <Eye size={16} />
                    </button>
                </div>

              </div>
            ))
          ) : (
            <div className="p-10 text-center text-slate-400 flex flex-col items-center">
               <MessageSquare size={32} className="opacity-20 mb-2"/>
               <span className="text-sm">Belum ada pesan masuk.</span>
            </div>
          )}
        </div>

      </div>

    </main>
  );
}

function StatCard({ icon, label, value, subtext, color }: any) {
  const bgColors: any = {
    blue: "bg-blue-50",
    purple: "bg-purple-50",
    orange: "bg-orange-50",
  };
  const subtextColors: any = {
    blue: "text-blue-600 bg-blue-50",
    purple: "text-purple-600 bg-purple-50",
    orange: "text-orange-600 bg-orange-50",
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-slate-500 text-xs md:text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl md:text-3xl font-bold text-slate-800">{value}</h3>
        <span className={`text-[10px] md:text-xs font-bold mt-2 inline-block px-2 py-0.5 rounded-md ${subtextColors[color] || "text-slate-500 bg-slate-50"}`}>
          {subtext}
        </span>
      </div>
      <div className={`p-3 rounded-xl ${bgColors[color] || "bg-slate-50"}`}>
        {icon}
      </div>
    </div>
  );
}