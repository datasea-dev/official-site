"use client";

import { useState, useEffect } from "react";
import { 
  Briefcase, Plus, Search, Edit, Trash2, X, Save, 
  Loader2, CheckCircle, AlertCircle, ChevronDown, Filter, LayoutGrid, Calendar, AlertTriangle,
  ChevronLeft, ChevronRight 
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { 
  getAllProkers, addProker, updateProker, deleteProker, ProgramKerjaData 
} from "@/lib/firestoreService";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

export default function ManajemenProkerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [prokers, setProkers] = useState<ProgramKerjaData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDivisi, setFilterDivisi] = useState("Semua");
  
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Menampilkan 8 kartu per halaman

  // State for Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // State for Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<"Besar" | "Divisi" | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State Alert Kustom (Toast)
  const [alert, setAlert] = useState<{show: boolean, type: 'success'|'error', message: string} | null>(null);

  // State Form
  const [formData, setFormData] = useState<Partial<ProgramKerjaData>>({
    nama_proker: "",
    deskripsi: "",
    divisi: "BPH",
    status: "Rencana",
    kategori: "Besar"
  });

  const [oldKategori, setOldKategori] = useState<"Besar" | "Divisi" | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/admin/login");
      } else {
        await loadData();
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Auto-dismiss alert
  useEffect(() => {
    if (alert?.show) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Reset pagination saat filter/search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDivisi]);

  const loadData = async () => {
    const data = await getAllProkers();
    setProkers(data);
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      nama_proker: "",
      deskripsi: "",
      divisi: "BPH",
      status: "Rencana",
      kategori: "Besar"
    });
    setOldKategori(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ProgramKerjaData) => {
    setIsEditing(true);
    setFormData({ ...item });
    setOldKategori(item.kategori); 
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string, kategori: "Besar" | "Divisi") => {
    setDeleteId(id);
    setDeleteCategory(kategori);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId || !deleteCategory) return;
    
    setIsDeleting(true);
    try {
      await deleteProker(deleteId, deleteCategory);
      await loadData();
      setAlert({show: true, type: 'success', message: 'Proker berhasil dihapus!'});
    } catch (error) {
      console.error(error);
      setAlert({show: true, type: 'error', message: 'Gagal menghapus proker.'});
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeleteId(null);
      setDeleteCategory(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!formData.nama_proker || !formData.deskripsi) {
        setAlert({show: true, type: 'error', message: 'Mohon lengkapi semua data.'});
        setSubmitting(false);
        return;
      }

      if (isEditing && formData.id) {
        await updateProker(formData.id, formData, oldKategori || formData.kategori as "Besar" | "Divisi");
      } else {
        await addProker(formData as Omit<ProgramKerjaData, 'id'>);
      }

      await loadData();
      setIsModalOpen(false);
      setAlert({show: true, type: 'success', message: isEditing ? 'Proker berhasil diperbarui!' : 'Proker berhasil ditambahkan!'});
    } catch (error) {
      console.error(error);
      setAlert({show: true, type: 'error', message: 'Gagal menyimpan data.'});
    } finally {
      setSubmitting(false);
    }
  };

  // --- LOGIC FILTER & PAGINATION ---
  const filteredProkers = prokers.filter((item) => {
    const matchSearch = item.nama_proker.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDivisi = filterDivisi === "Semua" || item.divisi === filterDivisi;
    return matchSearch && matchDivisi;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProkers = filteredProkers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProkers.length / itemsPerPage);

  // --- Helper Components ---
  const StatusBadge = ({ status }: { status?: string }) => {
    const safeStatus = status || "Rencana";
    const styles = {
      'Rencana': 'bg-slate-100 text-slate-600 border-slate-200',
      'Berjalan': 'bg-blue-50 text-blue-600 border-blue-200',
      'Terlaksana': 'bg-emerald-50 text-emerald-600 border-emerald-200',
    };
    const currentStyle = styles[safeStatus as keyof typeof styles] || styles['Rencana'];
    return (
      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${currentStyle}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${
          safeStatus === 'Rencana' ? 'bg-slate-400' : 
          safeStatus === 'Berjalan' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'
        }`}/>
        {safeStatus.toUpperCase()}
      </span>
    );
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-slate-400 bg-slate-50">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="animate-spin text-blue-600" size={32}/> 
        <span className="text-sm font-medium">Memuat Data...</span>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20 relative">
      
      {/* Toast Alert Component */}
      {alert?.show && (
        <div className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-xl shadow-xl font-bold text-white animate-in slide-in-from-top-5 fade-in duration-300 flex items-center gap-2 ${
            alert.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
            {alert.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
            {alert.message}
        </div>
      )}

      {/* --- HEADER SECTION --- */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20 text-white">
                <Briefcase size={24}/> 
              </div>
              Manajemen Proker
            </h1>
            <p className="text-slate-500 text-sm mt-2 ml-1">Pantau dan kelola seluruh program kerja himpunan.</p>
          </div>
          <button 
            onClick={handleOpenAdd}
            className="w-full md:w-auto group relative bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 transition-all hover:translate-y-[-2px] active:translate-y-0"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300"/> 
            Buat Proker Baru
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        
        {/* --- TOOLBAR --- */}
        <div className="sticky top-4 z-30 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/50 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 mb-8 ring-1 ring-slate-900/5">
          <div className="relative flex-1 group bg-white md:bg-transparent rounded-xl md:rounded-none border border-slate-100 md:border-none">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20}/>
            <input 
              type="text" 
              placeholder="Cari program kerja..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent outline-none text-slate-700 placeholder:text-slate-400 font-medium focus:bg-white transition-all"
            />
          </div>
          
          <div className="hidden md:block h-8 w-[1px] bg-slate-200 mx-1"></div>
          
          <div className="relative w-full md:w-auto min-w-[220px]">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
            <select 
              value={filterDivisi}
              onChange={(e) => setFilterDivisi(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white md:bg-transparent border border-slate-100 md:border-none outline-none text-slate-700 font-medium appearance-none cursor-pointer hover:bg-slate-50 focus:bg-white transition-all"
            >
              <option value="Semua">Semua Divisi</option>
              <option value="BPH">BPH</option>
              <option value="PSDM">PSDM</option>
              <option value="HUMAS">HUMAS</option>
              <option value="EKRAF">EKRAF</option>
              <option value="Divisi IT">IT</option>
              <option value="SATIR">SATIR</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16}/>
          </div>
        </div>

        {/* --- GRID CARD VIEW --- */}
        {currentProkers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProkers.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden"
              >
                {/* Decoration Line Top */}
                <div className={`h-1.5 w-full ${item.kategori === 'Besar' ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'}`} />

                <div className="p-5 flex flex-col h-full">
                  {/* Header: Badges */}
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold tracking-wider uppercase rounded-md border border-slate-200/80">
                      {item.divisi}
                    </span>
                    {item.kategori === 'Besar' && (
                      <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold uppercase rounded border border-orange-100 flex items-center gap-1">
                        <AlertCircle size={10} /> Unggulan
                      </span>
                    )}
                  </div>

                  {/* Body: Title & Desc */}
                  <div className="mb-4">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                      {item.nama_proker}
                    </h3>
                    
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 min-h-[60px]">
                      {item.deskripsi ? item.deskripsi : (
                        <span className="italic text-slate-400">Belum ada deskripsi singkat.</span>
                      )}
                    </p>
                  </div>

                  {/* Footer: Spacer & Actions */}
                  <div className="mt-auto pt-4 border-t border-dashed border-slate-100 flex items-center justify-between">
                    <StatusBadge status={item.status} />
                    
                    <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16}/>
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(item.id, item.kategori)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center px-4">
             <div className="p-4 bg-slate-50 rounded-full mb-4">
                <LayoutGrid size={40} className="text-slate-300"/>
             </div>
             <h3 className="text-slate-900 font-bold text-lg">Tidak ada program kerja</h3>
             <p className="text-slate-500 text-sm mt-1 mb-6">Coba ubah kata kunci pencarian atau filter divisi.</p>
             
             {/* Feature: Tombol Hapus Filter */}
             {(searchTerm !== "" || filterDivisi !== "Semua") && (
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    setFilterDivisi("Semua");
                  }}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2"
                >
                  <X size={16}/>
                  Hapus Filter & Pencarian
                </button>
             )}
          </div>
        )}

        {/* --- PAGINATION CONTROLS --- */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xs text-slate-500 font-medium">
              Hal {currentPage} dari {totalPages || 1}
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(p-1, 1))} 
                disabled={currentPage === 1} 
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              >
                <ChevronLeft size={16}/>
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))} 
                disabled={currentPage === totalPages || totalPages === 0} 
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50"
              >
                <ChevronRight size={16}/>
              </button>
            </div>
        </div>

      </div>

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-slate-900/5 flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-bold text-xl text-slate-800">
                  {isEditing ? "Edit Program Kerja" : "Buat Program Baru"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Isi detail informasi kegiatan di bawah ini.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20}/>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
              
              {/* Nama Proker */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Nama Program</label>
                <input 
                  type="text" 
                  required
                  value={formData.nama_proker || ""} 
                  onChange={(e) => setFormData({...formData, nama_proker: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-800 placeholder:text-slate-400 transition-all"
                  placeholder="Contoh: Datasea Hackathon 2024"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Divisi */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Divisi Penanggungjawab</label>
                  <div className="relative">
                    <select 
                      value={formData.divisi || "BPH"} 
                      onChange={(e) => setFormData({...formData, divisi: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-800 bg-white appearance-none cursor-pointer"
                    >
                      <option value="BPH">BPH</option>
                      <option value="PSDM">PSDM</option>
                      <option value="HUMAS">HUMAS</option>
                      <option value="EKRAF">EKRAF</option>
                      <option value="Divisi IT">Divisi IT</option>
                      <option value="SATIR">SATIR</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16}/>
                  </div>
                </div>

                {/* Kategori */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Jenis Kategori</label>
                  <div className="relative">
                    <select 
                      value={formData.kategori || "Besar"} 
                      onChange={(e) => setFormData({...formData, kategori: e.target.value as "Besar" | "Divisi"})}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-800 bg-white appearance-none cursor-pointer"
                    >
                      <option value="Besar">🔥 Proker Besar (Unggulan)</option>
                      <option value="Divisi">📁 Proker Divisi</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16}/>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Status Saat Ini</label>
                <div className="relative">
                  <select 
                    value={formData.status || "Rencana"} 
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-800 bg-white appearance-none cursor-pointer"
                  >
                    <option value="Rencana">⚪ Rencana (Belum Dimulai)</option>
                    <option value="Berjalan">🔵 Sedang Berjalan</option>
                    <option value="Terlaksana">🟢 Selesai / Terlaksana</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16}/>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Deskripsi Lengkap</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.deskripsi || ""} 
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-800 placeholder:text-slate-400 resize-none"
                  placeholder="Jelaskan tujuan, target, dan detail kegiatan secara singkat..."
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3 border-t border-slate-100 mt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 className="animate-spin"/> : <Save size={18}/>}
                  Simpan Proker
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto text-red-600">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Proker?</h3>
            <p className="text-slate-500 text-sm mb-6">Data yang dihapus tidak dapat dikembalikan lagi.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => { setShowDeleteModal(false); setDeleteId(null); }}
                className="flex-1 py-2.5 border rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
              >
                {isDeleting ? <Loader2 className="animate-spin" size={18}/> : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}