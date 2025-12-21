"use client";

import { useState, useEffect, Suspense } from "react"; 
import { 
  MessageSquare, Search, Trash2, CheckCircle, Clock, MailOpen, Filter, Loader2, Eye, X, User, Building, Mail, ChevronLeft, ChevronRight, ChevronDown, AlertTriangle, Phone 
} from "lucide-react"; 
import { auth } from "@/lib/firebase";
import { getMessages, deleteMessage, updateMessageStatus, MessageData } from "@/lib/firestoreService";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

// --- KOMPONEN KONTEN UTAMA ---
function PesanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<MessageData[]>([]);
  
  // Filter & Search
  const [filter, setFilter] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Modal States
  const [selectedMessage, setSelectedMessage] = useState<MessageData | null>(null);
  
  // Alert & Confirmation States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Success Alert State
  const [alert, setAlert] = useState<{show: boolean, type: 'success'|'error', message: string} | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) router.push("/admin/login");
      else { 
        const data = await getMessages(); 
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setMessages(data); 
        setLoading(false); 
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (messages.length > 0) {
      const openId = searchParams.get("open");
      if (openId) {
        const msg = messages.find((m) => m.id === openId);
        if (msg) { 
            setSelectedMessage(msg); 
            if (msg.status === 'Baru') handleStatus(msg.id, 'Dibaca'); 
        }
      }
    }
  }, [messages, searchParams]);

  useEffect(() => {
    if (alert?.show) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleStatus = async (id: string, st: "Selesai"|"Dibaca") => { 
      await updateMessageStatus(id, st); 
      setMessages(p => p.map(m => m.id === id ? { ...m, status: st } : m));
      
      if(selectedMessage && selectedMessage.id === id) {
          setSelectedMessage(prev => prev ? {...prev, status: st} : null);
      }

      if(st === 'Selesai') {
        setAlert({show: true, type: 'success', message: 'Pesan ditandai selesai!'});
      }
  };

  const confirmDelete = async () => {
      if(!deleteTargetId) return;
      setIsProcessing(true);
      try {
        await deleteMessage(deleteTargetId); 
        setMessages(p => p.filter(m => m.id !== deleteTargetId)); 
        setAlert({show: true, type: 'success', message: 'Pesan berhasil dihapus.'});
        setSelectedMessage(null);
      } catch (error) {
        setAlert({show: true, type: 'error', message: 'Gagal menghapus pesan.'});
      } finally {
        setIsProcessing(false);
        setShowDeleteModal(false);
        setDeleteTargetId(null);
      }
  };

  const openDeleteModal = (id: string) => {
      setDeleteTargetId(id);
      setShowDeleteModal(true);
  }

  const filtered = messages.filter(m => {
    const s = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.instansi.toLowerCase().includes(searchTerm.toLowerCase());
    const f = filter === "Semua" || m.status === filter;
    return s && f;
  });

  const idxLast = currentPage * itemsPerPage;
  const currentMsgs = filtered.slice(idxLast - itemsPerPage, idxLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  useEffect(() => setCurrentPage(1), [filter, searchTerm]);

  const StatusBadge = ({ status }: { status: string }) => {
    const color = status === 'Baru' ? 'bg-blue-100 text-blue-700' : status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600';
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${color}`}>{status}</span>
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-slate-400"><Loader2 className="animate-spin mr-2"/> Memuat Pesan...</div>;

  return (
    <main className="p-4 md:p-8 flex flex-col min-h-screen relative">
        
        {alert?.show && (
            <div className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-xl shadow-xl font-bold text-white animate-in slide-in-from-top-5 fade-in duration-300 ${alert.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                {alert.message}
            </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <MailOpen className="text-blue-600"/> Kotak Masuk
            </h1>
            <p className="text-slate-500 text-sm mt-1">Kelola pesan masuk.</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="sticky top-4 z-30 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/50 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 mb-8 ring-1 ring-slate-900/5">
            <div className="relative flex-1 group bg-white md:bg-transparent rounded-xl md:rounded-none border border-slate-100 md:border-none">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20}/>
              <input 
                type="text" 
                placeholder="Cari pengirim..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent outline-none text-slate-700 placeholder:text-slate-400 font-medium focus:bg-white transition-all"
              />
            </div>
            
            <div className="hidden md:block h-8 w-[1px] bg-slate-200 mx-1"></div>
            
            <div className="relative w-full md:w-auto min-w-[220px]">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white md:bg-transparent border border-slate-100 md:border-none outline-none text-slate-700 font-medium appearance-none cursor-pointer hover:bg-slate-50 focus:bg-white transition-all"
              >
                <option value="Semua">Semua Status</option>
                <option value="Baru">Baru</option>
                <option value="Dibaca">Dibaca</option>
                <option value="Selesai">Selesai</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16}/>
            </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
          
          {/* --- TAMPILAN MOBILE --- */}
          <div className="block md:hidden">
            {currentMsgs.map(m => (
              <div key={m.id} className={`p-5 border-b border-slate-100 flex flex-col gap-3 ${m.status==='Baru'?'bg-blue-50/20':''}`}>
                 <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{m.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{m.instansi}</p>
                      {/* BAGIAN TELEPON DIHAPUS DARI SINI */}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-lg">
                      {new Date(m.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                    </span>
                 </div>
                 <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                   {m.message}
                 </p>
                 <div className="flex justify-between items-center mt-1">
                    <StatusBadge status={m.status} />
                    <div className="flex gap-2">
                        <button 
                            onClick={()=>{setSelectedMessage(m); if(m.status==='Baru') handleStatus(m.id,'Dibaca')}} 
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            <Eye size={16}/>
                        </button>
                        <button 
                            onClick={()=>openDeleteModal(m.id)} 
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            <Trash2 size={16}/>
                        </button>
                    </div>
                 </div>
              </div>
            ))}
          </div>

          {/* --- TAMPILAN DESKTOP (TABLE) --- */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                    <tr>
                        <th className="px-6 py-4 w-[25%]">Pengirim</th>
                        <th className="px-6 py-4">Pesan</th>
                        <th className="px-6 py-4 w-[15%]">Status</th>
                        <th className="px-6 py-4 w-[1%] whitespace-nowrap">Waktu</th>
                        <th className="px-6 py-4 w-[1%] whitespace-nowrap text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {currentMsgs.map(m => (
                        <tr key={m.id} className={`hover:bg-blue-50/30 transition-colors ${m.status==='Baru'?'bg-blue-50/10':''}`}>
                            <td className="px-6 py-4 align-top">
                                <p className="font-bold text-slate-700">{m.name}</p>
                                <p className="text-xs text-slate-500">{m.instansi}</p>
                                {/* BAGIAN TELEPON DIHAPUS DARI SINI */}
                            </td>
                            <td className="px-6 py-4 align-top">
                                <p className="line-clamp-2 text-slate-600">{m.message}</p>
                            </td>
                            <td className="px-6 py-4 align-top">
                                <StatusBadge status={m.status} />
                            </td>
                            <td className="px-6 py-4 align-top text-slate-500 text-xs whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                    <Clock size={14}/> 
                                    {new Date(m.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                                </div>
                            </td>
                            <td className="px-6 py-4 align-top text-center whitespace-nowrap">
                                <div className="flex justify-center gap-2">
                                    <button 
                                        onClick={()=>{setSelectedMessage(m); if(m.status==='Baru') handleStatus(m.id,'Dibaca')}} 
                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                        title="Lihat Detail"
                                    >
                                        <Eye size={16}/>
                                    </button>
                                    <button 
                                        onClick={()=>openDeleteModal(m.id)} 
                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        title="Hapus Pesan"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>

          {/* Empty State */}
          {currentMsgs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                  <div className="p-4 bg-slate-50 rounded-full mb-4">
                     <MailOpen size={40} className="text-slate-300"/>
                  </div>
                  <p className="text-slate-500 mb-6">Tidak ada pesan ditemukan.</p>
                  {(searchTerm !== "" || filter !== "Semua") && (
                     <button 
                       onClick={() => { setSearchTerm(""); setFilter("Semua"); }}
                       className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                     >
                       <X size={14}/> Hapus Filter & Pencarian
                     </button>
                  )}
              </div>
          )}
          
          {/* Pagination */}
          <div className="p-4 border-t flex justify-between items-center bg-slate-50 mt-auto">
              <span className="text-xs text-slate-500">Hal {currentPage} dari {totalPages||1}</span>
              <div className="flex gap-2">
                 <button onClick={()=>setCurrentPage(p=>Math.max(p-1,1))} disabled={currentPage===1} className="p-2 border bg-white rounded hover:bg-slate-100 disabled:opacity-50"><ChevronLeft size={16}/></button>
                 <button onClick={()=>setCurrentPage(p=>Math.min(p+1,totalPages))} disabled={currentPage===totalPages||totalPages===0} className="p-2 border bg-white rounded hover:bg-slate-100 disabled:opacity-50"><ChevronRight size={16}/></button>
              </div>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedMessage && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative">
                    <button onClick={()=>{setSelectedMessage(null); router.replace('/admin/manajemen_pesan',{scroll:false})}} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={20}/></button>
                    <h3 className="text-xl font-bold mb-6">Detail Pesan</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 rounded-xl"><p className="text-xs text-slate-400 font-bold uppercase">Pengirim</p><p className="font-bold text-slate-800">{selectedMessage.name}</p></div>
                            <div className="p-3 bg-slate-50 rounded-xl"><p className="text-xs text-slate-400 font-bold uppercase">Instansi</p><p className="font-bold text-slate-800">{selectedMessage.instansi}</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 rounded-xl"><p className="text-xs text-slate-400 font-bold uppercase">Email</p><p className="font-bold text-blue-600">{selectedMessage.email}</p></div>
                            {/* Kotak Telepon TETAP ADA di Modal */}
                            <div className="p-3 bg-slate-50 rounded-xl"><p className="text-xs text-slate-400 font-bold uppercase">Telepon / WA</p><p className="font-bold text-slate-800 flex items-center gap-2"><Phone size={14}/> {selectedMessage.phone || "-"}</p></div>
                        </div>
                        <div className="p-4 border rounded-xl bg-slate-50/50"><p className="whitespace-pre-wrap text-slate-700">{selectedMessage.message}</p></div>
                    </div>
                    {selectedMessage.status !== 'Selesai' && (
                        <button 
                            onClick={() => handleStatus(selectedMessage.id, "Selesai")} 
                            className="mt-6 w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                        >
                            <CheckCircle size={18}/> Tandai Selesai
                        </button>
                    )}
                </div>
            </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto text-red-600">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Pesan?</h3>
                    <p className="text-slate-500 text-sm mb-6">Pesan ini akan dihapus secara permanen dan tidak dapat dikembalikan.</p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => {setShowDeleteModal(false); setDeleteTargetId(null);}} 
                            className="flex-1 py-2.5 border rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={confirmDelete} 
                            disabled={isProcessing}
                            className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" size={18}/> : "Ya, Hapus"}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </main>
  );
}

// --- WAJIB UNTUK MENGHINDARI ERROR BUILD "useSearchParams" ---
export default function PesanPage() {
  return (
    <Suspense fallback={
        <div className="h-screen flex items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mr-2"/> Memuat Halaman...
        </div>
    }>
      <PesanContent />
    </Suspense>
  );
}