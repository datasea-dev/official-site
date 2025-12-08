"use client";

import { useState, useEffect } from "react";
import { 
  Users, Plus, Search, Edit, Trash2, X, Loader2, Save, 
  UploadCloud, AlertTriangle, Linkedin, Instagram, User, Filter, ChevronDown, ChevronLeft, ChevronRight,
  CheckCircle, AlertCircle 
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { 
  getTimData, addTim, updateTim, deleteTim, TimData 
} from "@/lib/firestoreService";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

const LIST_DIVISI = ["BPH", "HUMAS", "PSDM", "EKRAF", "SATIR"];

export default function ManajemenTimPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<TimData[]>([]);
  
  // State Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDivisi, setFilterDivisi] = useState("Semua");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals & Upload
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // State Alert Kustom
  const [alert, setAlert] = useState<{show: boolean, type: 'success'|'error', message: string} | null>(null);

  const initialFormState: Omit<TimData, 'id'> = {
    nama: "", jabatan: "", divisi: "BPH", foto_url: "", linkedin_url: "", instagram_url: ""
  };
  const [formData, setFormData] = useState(initialFormState);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) router.push("/admin/login");
      else { await fetchMembers(); setLoading(false); }
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

  const fetchMembers = async () => {
    const data = await getTimData();
    data.sort((a, b) => {
        if (a.divisi === "BPH" && b.divisi !== "BPH") return -1;
        if (a.divisi !== "BPH" && b.divisi === "BPH") return 1;
        return a.nama.localeCompare(b.nama);
    });
    setMembers(data);
  };

  const uploadToCloudinary = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset!);
    formData.append("folder", "Asset Tim"); 

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: formData });
    if (!res.ok) throw new Error("Gagal upload gambar");
    const data = await res.json();
    return data.secure_url; 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalPhotoUrl = formData.foto_url;
      if (imageFile) {
        setIsUploading(true);
        finalPhotoUrl = await uploadToCloudinary(imageFile);
        setIsUploading(false);
      }
      const finalData = { ...formData, foto_url: finalPhotoUrl };
      if (isEditing && editId) await updateTim(editId, finalData);
      else await addTim(finalData);
      
      await fetchMembers();
      handleCloseModal();
      
      // Alert Sukses Simpan
      setAlert({show: true, type: 'success', message: isEditing ? 'Profil berhasil diperbarui!' : 'Anggota baru ditambahkan!'});
    } catch (error) { 
        // Alert Gagal
        setAlert({show: true, type: 'error', message: 'Gagal menyimpan data.'});
    } 
    finally { setIsSaving(false); setIsUploading(false); }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
        await deleteTim(deleteId);
        await fetchMembers();
        // Alert Sukses Hapus
        setAlert({show: true, type: 'success', message: 'Anggota berhasil dihapus!'});
    } catch (error) {
        setAlert({show: true, type: 'error', message: 'Gagal menghapus data.'});
    } finally {
        setIsDeleting(false);
        setShowDeleteModal(false);
    }
  };

  // Helpers
  const handleCloseModal = () => { setIsModalOpen(false); setFormData(initialFormState); setImageFile(null); setImagePreview(null); };
  const handleOpenAdd = () => { setIsEditing(false); setFormData(initialFormState); setImageFile(null); setImagePreview(null); setIsModalOpen(true); };
  const handleOpenEdit = (item: TimData) => {
    setIsEditing(true); setEditId(item.id); setImagePreview(item.foto_url || null); setImageFile(null); setIsModalOpen(true);
    setFormData({ nama: item.nama, jabatan: item.jabatan, divisi: item.divisi, foto_url: item.foto_url, linkedin_url: item.linkedin_url || "", instagram_url: item.instagram_url || "" });
  };

  // Logic Filter & Pagination
  const filteredMembers = members.filter(m => {
    const search = m.nama.toLowerCase().includes(searchTerm.toLowerCase()) || m.jabatan.toLowerCase().includes(searchTerm.toLowerCase());
    const divisi = filterDivisi === "Semua" || m.divisi === filterDivisi;
    return search && divisi;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterDivisi]);

  if (loading) return <div className="h-screen flex items-center justify-center text-slate-400"><Loader2 className="animate-spin mr-2"/> Memuat Data...</div>;

  return (
    <main className="p-4 md:p-8 flex flex-col min-h-screen relative">
        
        {/* Toast Alert Component */}
        {alert?.show && (
            <div className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-xl shadow-xl font-bold text-white animate-in slide-in-from-top-5 fade-in duration-300 flex items-center gap-2 ${
                alert.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}>
                {alert.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
                {alert.message}
            </div>
        )}

        {/* Header Responsive */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="text-blue-600"/> Anggota Tim
            </h1>
            <p className="text-slate-500 text-sm mt-1">Kelola profil pengurus Datasea.</p>
          </div>
          <button 
            onClick={handleOpenAdd} 
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
          >
            <Plus size={18}/> Tambah Anggota
          </button>
        </div>

        {/* Toolbar Responsive (Search & Filter) */}
        <div className="sticky top-4 z-30 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/50 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 mb-8 ring-1 ring-slate-900/5">
          
          {/* Search Input */}
          <div className="relative flex-1 group bg-white md:bg-transparent rounded-xl md:rounded-none border border-slate-100 md:border-none">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20}/>
            <input 
              type="text" 
              placeholder="Cari anggota tim..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-transparent outline-none text-slate-700 placeholder:text-slate-400 font-medium focus:bg-white transition-all"
            />
          </div>
          
          {/* Divider */}
          <div className="hidden md:block h-8 w-[1px] bg-slate-200 mx-1"></div>
          
          {/* Filter Dropdown */}
          <div className="relative w-full md:w-auto min-w-[220px]">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
            <select 
              value={filterDivisi}
              onChange={(e) => setFilterDivisi(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white md:bg-transparent border border-slate-100 md:border-none outline-none text-slate-700 font-medium appearance-none cursor-pointer hover:bg-slate-50 focus:bg-white transition-all"
            >
              <option value="Semua">Semua Divisi</option>
              {LIST_DIVISI.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16}/>
          </div>
        </div>

        {/* Grid Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 flex-1 content-start">
          {currentMembers.map((member) => (
            <div key={member.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col items-center p-6 text-center relative h-full">
              <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-blue-600 border border-blue-100">{member.divisi}</span>
              <div className="w-24 h-24 rounded-full bg-slate-100 mb-4 overflow-hidden ring-4 ring-slate-50 shadow-sm object-cover flex-shrink-0">
                 {member.foto_url ? <img src={member.foto_url} alt={member.nama} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-slate-400"><User size={32}/></div>}
              </div>
              <h3 className="font-bold text-slate-800 text-lg w-full leading-snug mb-1">{member.nama}</h3>
              <p className="text-sm text-slate-500 mb-4 font-medium">{member.jabatan}</p>
              <div className="flex gap-3 mb-6 mt-auto">
                 {member.linkedin_url && <a href={member.linkedin_url} target="_blank" className="text-slate-400 hover:text-blue-600"><Linkedin size={18}/></a>}
                 {member.instagram_url && <a href={member.instagram_url} target="_blank" className="text-slate-400 hover:text-pink-600"><Instagram size={18}/></a>}
              </div>
              <div className="flex gap-2 w-full">
                <button onClick={() => handleOpenEdit(member)} className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2"><Edit size={14}/> Edit</button>
                <button onClick={() => { setDeleteId(member.id); setShowDeleteModal(true); }} className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg"><Trash2 size={16}/></button>
              </div>
            </div>
          ))}

          {/* Fitur Hapus Filter & Pencarian jika tidak ditemukan */}
          {currentMembers.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">
              <Users size={48} className="mb-4 opacity-20"/>
              <p className="mb-6">Tidak ada anggota ditemukan.</p>
              {(searchTerm !== "" || filterDivisi !== "Semua") && (
                <button 
                  onClick={() => { setSearchTerm(""); setFilterDivisi("Semua"); }}
                  className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                >
                  <X size={16}/> Hapus Filter & Pencarian
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination Responsive */}
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
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50"><h3 className="font-bold text-lg text-slate-800">{isEditing ? "Edit Profil" : "Tambah Anggota"}</h3><button onClick={handleCloseModal} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-5">
                <div className="flex flex-col items-center justify-center"><div className="relative w-32 h-32 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 group overflow-hidden cursor-pointer"><input type="file" accept="image/*" onChange={(e) => {const f=e.target.files?.[0]; if(f){setImageFile(f); setImagePreview(URL.createObjectURL(f));}}} className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer" />{imagePreview ? (<img src={imagePreview} className="w-full h-full object-cover" />) : (<div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400"><UploadCloud size={24} /><span className="text-[10px] mt-1">Upload</span></div>)}</div></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-1">Nama</label><input required value={formData.nama} onChange={e=>setFormData({...formData, nama:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nama Lengkap"/></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Jabatan</label><input required value={formData.jabatan} onChange={e=>setFormData({...formData, jabatan:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Posisi"/></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Divisi</label><select value={formData.divisi} onChange={e=>setFormData({...formData, divisi:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white">{LIST_DIVISI.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
                </div>
                <div><label className="block text-sm font-bold text-slate-700 mb-1">LinkedIn</label><input value={formData.linkedin_url} onChange={e=>setFormData({...formData, linkedin_url:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="URL Profil"/></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-1">Instagram</label><input value={formData.instagram_url} onChange={e=>setFormData({...formData, instagram_url:e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="URL Profil"/></div>
                <div className="flex gap-3 pt-4"><button type="button" onClick={handleCloseModal} className="flex-1 py-2.5 rounded-xl border font-bold text-slate-600">Batal</button><button type="submit" disabled={isSaving} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold flex justify-center items-center gap-2">{isSaving ? <Loader2 className="animate-spin"/> : "Simpan"}</button></div>
            </form>
          </div>
        </div>
        )}

        {/* Modal Hapus */}
        {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto text-red-600"><AlertTriangle size={24} /></div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Anggota?</h3>
            <p className="text-slate-500 text-sm mb-6">Data akan dihapus permanen.</p>
            <div className="flex gap-3"><button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 border rounded-xl font-bold text-slate-600">Batal</button><button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold flex justify-center items-center gap-2">{isDeleting ? <Loader2 className="animate-spin"/> : "Hapus"}</button></div>
          </div>
        </div>
        )}
    </main>
  );
}