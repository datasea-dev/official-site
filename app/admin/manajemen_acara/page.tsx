"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, Plus, Search, Edit, Trash2, MapPin, X, Loader2, ImageIcon, 
  UploadCloud, AlertTriangle, Filter, ChevronDown, ChevronLeft, ChevronRight 
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { getAcaraData, addAcara, updateAcara, deleteAcara, AcaraData } from "@/lib/firestoreService";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

export default function ManajemenAcaraPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<AcaraData[]>([]);
  
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals & States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const initialFormState: Omit<AcaraData, 'id'> = {
    nama_acara: "", deskripsi_acara: "", tanggal_acara: "", waktu_acara: "", lokasi: "", penyelenggara: "DATASEA", link_pendaftaran: "", poster_url: "", status_acara: "Segera"
  };
  const [formData, setFormData] = useState(initialFormState);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) router.push("/admin/login");
      else { await fetchEvents(); setLoading(false); }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchEvents = async () => { const data = await getAcaraData(); setEvents(data); };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!);
    formData.append("folder", "Asset Acara");
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalPosterUrl = formData.poster_url;
      if (imageFile) {
        setIsUploading(true);
        finalPosterUrl = await uploadToCloudinary(imageFile);
        setIsUploading(false);
      }
      const finalData = { ...formData, poster_url: finalPosterUrl };
      if (isEditing && editId) await updateAcara(editId, finalData);
      else await addAcara(finalData);
      await fetchEvents(); handleCloseModal();
    } catch (error) { alert("Error saving."); } finally { setIsSaving(false); setIsUploading(false); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true); await deleteAcara(deleteId); await fetchEvents(); setIsDeleting(false); setShowDeleteModal(false);
  };

  const handleCloseModal = () => { setIsModalOpen(false); setFormData(initialFormState); setImageFile(null); setImagePreview(null); };
  const handleOpenEdit = (event: AcaraData) => { setIsEditing(true); setEditId(event.id); setImagePreview(event.poster_url || null); setIsModalOpen(true); setFormData({ ...event }); };
  const handleOpenAdd = () => { setIsEditing(false); setFormData(initialFormState); setImageFile(null); setImagePreview(null); setIsModalOpen(true); };

  const filteredEvents = events.filter(e => {
    const search = e.nama_acara.toLowerCase().includes(searchTerm.toLowerCase());
    const status = filterStatus === "Semua" || e.status_acara === filterStatus;
    return search && status;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterStatus]);

  if (loading) return <div className="h-screen flex items-center justify-center text-slate-400"><Loader2 className="animate-spin mr-2"/> Memuat...</div>;

  return (
    <main className="p-4 md:p-8 flex flex-col min-h-screen">
        {/* Header Responsive */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="text-blue-600"/> Manajemen Acara
            </h1>
            <p className="text-slate-500 text-sm mt-1">Kelola agenda kegiatan.</p>
          </div>
          <button 
            onClick={handleOpenAdd} 
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Plus size={18}/> Tambah Acara
          </button>
        </div>

        {/* Toolbar Responsive (Search & Filter) - STYLE DISAMAKAN */}
        <div className="sticky top-4 z-30 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/50 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 mb-8 ring-1 ring-slate-900/5">
            
            {/* Search Input */}
            <div className="relative flex-1 group bg-white md:bg-transparent rounded-xl md:rounded-none border border-slate-100 md:border-none">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20}/>
              <input 
                type="text" 
                placeholder="Cari acara..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent outline-none text-slate-700 placeholder:text-slate-400 font-medium focus:bg-white transition-all"
              />
            </div>
            
            {/* Divider */}
            <div className="hidden md:block h-8 w-[1px] bg-slate-200 mx-1"></div>
            
            {/* Filter Dropdown */}
            <div className="relative w-full md:w-auto min-w-[200px]">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white md:bg-transparent border border-slate-100 md:border-none outline-none text-slate-700 font-medium appearance-none cursor-pointer hover:bg-slate-50 focus:bg-white transition-all"
              >
                <option value="Semua">Semua Status</option>
                <option value="Segera">Segera</option>
                <option value="Berlangsung">Berlangsung</option>
                <option value="Selesai">Selesai</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16}/>
            </div>
        </div>

        {/* Grid Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 content-start">
          {currentEvents.map((event) => (
            <div key={event.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full">
              <div className="h-40 bg-slate-100 relative group-hover:opacity-90 transition-opacity flex-shrink-0">
                 {event.poster_url ? <img src={event.poster_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={32}/></div>}
                 <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase border shadow-sm ${
                    event.status_acara === 'Segera' ? 'bg-blue-100 text-blue-600 border-blue-200' :
                    event.status_acara === 'Berlangsung' ? 'bg-green-100 text-green-600 border-green-200' :
                    'bg-slate-100 text-slate-500 border-slate-200'
                 }`}>
                    {event.status_acara}
                 </span>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-2"><h3 className="font-bold text-slate-800 text-lg line-clamp-1">{event.nama_acara}</h3></div>
                <div className="space-y-2 text-sm text-slate-500 mb-6 flex-1">
                  <div className="flex items-center gap-2"><Calendar size={14} className="text-blue-500"/> {event.tanggal_acara}</div>
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-red-500"/> {event.lokasi}</div>
                </div>
                <div className="flex gap-2 border-t border-slate-100 pt-4 mt-auto">
                  <button onClick={() => handleOpenEdit(event)} className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2"><Edit size={16}/> Edit</button>
                  <button onClick={() => { setDeleteId(event.id); setShowDeleteModal(true); }} className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg"><Trash2 size={18}/></button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State & Reset Button */}
          {currentEvents.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">
              <Calendar size={48} className="mb-4 opacity-20"/>
              <p className="mb-6">Tidak ada acara ditemukan.</p>
              {(searchTerm !== "" || filterStatus !== "Semua") && (
                <button 
                  onClick={() => { setSearchTerm(""); setFilterStatus("Semua"); }}
                  className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                >
                  <X size={16}/> Hapus Filter & Pencarian
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-xs text-slate-500 font-medium">Hal {currentPage} dari {totalPages || 1}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(p-1, 1))} disabled={currentPage===1} className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50"><ChevronLeft size={16}/></button>
                <button onClick={() => setCurrentPage(p => Math.min(p+1, totalPages))} disabled={currentPage===totalPages || totalPages===0} className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50"><ChevronRight size={16}/></button>
              </div>
        </div>

        {/* Modal Form */}
        {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
               <h3 className="font-bold text-lg text-slate-800">{isEditing ? "Edit Acara" : "Tambah Acara Baru"}</h3>
               <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                   <label className="block text-sm font-bold text-slate-700 mb-2">Poster Acara</label>
                   <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors group cursor-pointer">
                      <input type="file" accept="image/*" onChange={(e)=>{const f=e.target.files?.[0]; if(f){setImageFile(f); setImagePreview(URL.createObjectURL(f));}}} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                      {imagePreview ? (
                        <img src={imagePreview} className="mx-auto h-48 object-contain rounded-lg shadow-sm" />
                      ) : (
                        <div className="py-8 flex flex-col items-center text-slate-400">
                           <UploadCloud size={32} className="mb-2"/>
                           <span className="text-sm font-medium">Klik untuk upload poster</span>
                        </div>
                      )}
                   </div>
                </div>
                
                <div className="md:col-span-2 space-y-1">
                   <label className="text-sm font-bold text-slate-700">Nama Acara</label>
                   <input required className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.nama_acara} onChange={e=>setFormData({...formData, nama_acara:e.target.value})} placeholder="Contoh: Webinar Data Science"/>
                </div>

                <div className="space-y-1">
                   <label className="text-sm font-bold text-slate-700">Tanggal</label>
                   <input type="date" required className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.tanggal_acara} onChange={e=>setFormData({...formData, tanggal_acara:e.target.value})}/>
                </div>

                <div className="space-y-1">
                   <label className="text-sm font-bold text-slate-700">Waktu</label>
                   <input required className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.waktu_acara} onChange={e=>setFormData({...formData, waktu_acara:e.target.value})} placeholder="09:00 - 12:00 WIB"/>
                </div>

                <div className="space-y-1">
                   <label className="text-sm font-bold text-slate-700">Lokasi</label>
                   <input required className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.lokasi} onChange={e=>setFormData({...formData, lokasi:e.target.value})} placeholder="Zoom Meeting / Aula Kampus"/>
                </div>

                <div className="space-y-1">
                   <label className="text-sm font-bold text-slate-700">Penyelenggara</label>
                   <input required className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.penyelenggara} onChange={e=>setFormData({...formData, penyelenggara:e.target.value})}/>
                </div>

                <div className="md:col-span-2 space-y-1">
                   <label className="text-sm font-bold text-slate-700">Deskripsi</label>
                   <textarea required rows={3} className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none" value={formData.deskripsi_acara} onChange={e=>setFormData({...formData, deskripsi_acara:e.target.value})} placeholder="Jelaskan detail acara..."/>
                </div>

                <div className="md:col-span-2 space-y-1">
                   <label className="text-sm font-bold text-slate-700">Status Acara</label>
                   <select className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={formData.status_acara} onChange={e=>setFormData({...formData, status_acara:e.target.value as any})}>
                      <option value="Segera">Segera</option>
                      <option value="Berlangsung">Berlangsung</option>
                      <option value="Selesai">Selesai</option>
                   </select>
                </div>

                <div className="md:col-span-2 flex gap-3 pt-4 border-t border-slate-100 mt-2">
                   <button type="button" onClick={handleCloseModal} className="flex-1 py-2.5 border rounded-xl font-bold text-slate-600 hover:bg-slate-50">Batal</button>
                   <button type="submit" disabled={isSaving} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex justify-center items-center gap-2">
                      {isSaving ? <Loader2 className="animate-spin"/> : "Simpan Acara"}
                   </button>
                </div>
            </form>
          </div>
        </div>
        )}

        {/* Modal Delete */}
        {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center w-full max-w-sm">
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto text-red-600"><AlertTriangle size={24} /></div>
             <h3 className="font-bold text-lg text-slate-800 mb-2">Hapus Acara?</h3>
             <p className="text-slate-500 text-sm mb-6">Data yang dihapus tidak dapat dikembalikan.</p>
             <div className="flex gap-3 justify-center">
                <button onClick={()=>setShowDeleteModal(false)} className="flex-1 py-2.5 border rounded-xl font-bold text-slate-600 hover:bg-slate-50">Batal</button>
                <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 flex justify-center items-center gap-2">
                   {isDeleting ? <Loader2 className="animate-spin"/> : "Hapus"}
                </button>
             </div>
          </div>
        </div>
        )}
    </main>
  );
}