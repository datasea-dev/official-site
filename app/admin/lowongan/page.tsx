"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Trash2, Briefcase, MapPin, 
  CheckCircle2, XCircle, Loader2, Save, AlertTriangle 
} from "lucide-react";
import { 
  getAllPositions, 
  addPosition, 
  togglePositionStatus, 
  deletePosition, 
  VolunteerPosition 
} from "@/lib/firestoreService";

export default function AdminLowonganPage() {
  const [jobs, setJobs] = useState<VolunteerPosition[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal Form (Tambah)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // State Modal Sukses (Feedback)
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // State Modal Konfirmasi (Untuk Delete & Toggle)
  const [confirmAction, setConfirmAction] = useState<{
    isOpen: boolean;
    type: "delete" | "toggle" | null;
    id: string;
    title: string; // Nama lowongan untuk display
    currentStatus?: boolean; // Khusus toggle
  }>({ isOpen: false, type: null, id: "", title: "" });
  
  const [isProcessing, setIsProcessing] = useState(false);

  // State Form Input
  const [formData, setFormData] = useState({
    title: "",
    division: "BPH",
    type: "Remote",
    description: "",
    requirementsRaw: "" 
  });

  // Load Data
  const fetchJobs = async () => {
    setLoading(true);
    const data = await getAllPositions();
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // --- HANDLE TAMBAH DATA ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const requirementsArray = formData.requirementsRaw
        .split("\n")
        .filter(line => line.trim() !== "");

      await addPosition({
        title: formData.title,
        division: formData.division,
        type: formData.type as "Remote" | "On-Site" | "Hybrid",
        description: formData.description,
        requirements: requirementsArray,
        isOpen: true 
      });

      setIsModalOpen(false);
      setShowSuccessModal(true);
      
      setFormData({ title: "", division: "BPH", type: "Remote", description: "", requirementsRaw: "" });
      fetchJobs(); 
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- TRIGGER KONFIRMASI (Buka Modal) ---
  
  // 1. Trigger Toggle
  const triggerToggle = (id: string, currentStatus: boolean, title: string) => {
    setConfirmAction({
        isOpen: true,
        type: "toggle",
        id,
        currentStatus,
        title
    });
  };

  // 2. Trigger Delete
  const triggerDelete = (id: string, title: string) => {
    setConfirmAction({
        isOpen: true,
        type: "delete",
        id,
        title
    });
  };

  // --- EKSEKUSI AKSI SETELAH DIKONFIRMASI ---
  const handleConfirmExecution = async () => {
    if (!confirmAction.type) return;
    
    setIsProcessing(true);
    try {
        if (confirmAction.type === "toggle") {
            await togglePositionStatus(confirmAction.id, confirmAction.currentStatus!);
        } else if (confirmAction.type === "delete") {
            await deletePosition(confirmAction.id);
        }
        
        // Tutup modal & Refresh data
        setConfirmAction({ ...confirmAction, isOpen: false });
        fetchJobs();

    } catch (error) {
        console.error("Error executing action:", error);
        alert("Terjadi kesalahan sistem.");
    } finally {
        setIsProcessing(false);
    }
  };


  return (
    <div className="p-6 md:p-10 min-h-screen bg-slate-50/50">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Lowongan</h1>
          <p className="text-slate-500 text-sm">Kelola posisi volunteer yang tampil di website publik.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={18} /> Tambah Lowongan
        </button>
      </div>

      {/* List Jobs */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600"/></div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <Briefcase className="mx-auto text-slate-300 mb-2" size={48} />
          <p className="text-slate-500 font-medium">Belum ada lowongan dibuat.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              {/* Info Kiri */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${job.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {job.isOpen ? "DIBUKA" : "DITUTUP"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                    {job.division}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800">{job.title}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><MapPin size={12}/> {job.type}</span>
                  <span>• {job.requirements.length} Persyaratan</span>
                </div>
              </div>

              {/* Actions Kanan */}
              <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 mt-3 md:mt-0">
                <button 
                  onClick={() => triggerToggle(job.id!, job.isOpen, job.title)}
                  className={`flex-1 md:flex-none px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                    job.isOpen 
                    ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
                    : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                  }`}
                >
                  {job.isOpen ? <><XCircle size={14}/> Tutup</> : <><CheckCircle2 size={14}/> Buka</>}
                </button>
                
                <button 
                  onClick={() => triggerDelete(job.id!, job.title)}
                  className="px-3 py-2 bg-slate-100 text-slate-500 hover:bg-red-600 hover:text-white rounded-lg transition-colors border border-slate-200"
                  title="Hapus Permanen"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* --- MODAL FORM (TAMBAH) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 font-bold text-lg text-slate-800">
              Buat Lowongan Baru
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto custom-scrollbar space-y-4">
              {/* Form Fields sama seperti sebelumnya... */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Judul Posisi</label>
                <input required type="text" className="w-full p-2 border rounded-lg text-sm" placeholder="Contoh: Staff Event"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Divisi</label>
                  <select className="w-full p-2 border rounded-lg text-sm"
                    value={formData.division} onChange={e => setFormData({...formData, division: e.target.value})}
                  >
                    {["BPH", "PSDM", "HUMAS", "EKRAF", "IT", "MIDTECH"].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Tipe Kerja</label>
                  <select className="w-full p-2 border rounded-lg text-sm"
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Remote">Remote (Online)</option>
                    <option value="On-Site">On-Site (Offline)</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Deskripsi Singkat</label>
                <textarea required rows={3} className="w-full p-2 border rounded-lg text-sm" placeholder="Jelaskan tanggung jawab utama..."
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Persyaratan (Satu poin per baris)
                </label>
                <textarea required rows={5} className="w-full p-2 border rounded-lg text-sm bg-slate-50" 
                  placeholder="- Mahasiswa Aktif&#10;- Bisa desain Canva&#10;- Komunikatif"
                  value={formData.requirementsRaw} onChange={e => setFormData({...formData, requirementsRaw: e.target.value})}
                ></textarea>
                <p className="text-[10px] text-slate-400 mt-1">*Tekan Enter untuk membuat poin baru.</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">
                  Batal
                </button>
                <button type="submit" disabled={isSaving} className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2">
                  {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL SUKSES --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 border-4 border-green-50">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Berhasil!</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Lowongan baru telah berhasil ditambahkan.
            </p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
            >
              Oke
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL KONFIRMASI (DELETE & TOGGLE) --- */}
      {confirmAction.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 text-center">
            
            {/* Icon Dinamis berdasarkan tipe aksi */}
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border-4 ${
                confirmAction.type === "delete" 
                ? "bg-red-100 text-red-600 border-red-50" 
                : "bg-orange-100 text-orange-600 border-orange-50"
            }`}>
              {confirmAction.type === "delete" ? <Trash2 size={28}/> : <AlertTriangle size={28}/>}
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2">
                {confirmAction.type === "delete" ? "Hapus Lowongan?" : "Ubah Status?"}
            </h3>
            
            <p className="text-slate-500 text-sm mb-6 leading-relaxed px-2">
                {confirmAction.type === "delete" ? (
                    <>Anda yakin ingin menghapus <b>"{confirmAction.title}"</b>? Tindakan ini tidak dapat dibatalkan.</>
                ) : (
                    <>Ubah status lowongan <b>"{confirmAction.title}"</b> menjadi <b>{confirmAction.currentStatus ? "DITUTUP" : "DIBUKA"}</b>?</>
                )}
            </p>

            <div className="flex gap-3">
                <button 
                  onClick={() => setConfirmAction({ ...confirmAction, isOpen: false })}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={handleConfirmExecution}
                  disabled={isProcessing}
                  className={`flex-1 py-2.5 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
                      confirmAction.type === "delete"
                      ? "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                      : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                  }`}
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={18}/> : "Ya, Lanjutkan"}
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}