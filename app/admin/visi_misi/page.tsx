"use client";

import { useState, useEffect } from "react";
import { 
  Save, Loader2, Plus, Trash2, Quote, Target, List, CheckCircle, AlertCircle 
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { getVisiMisiData, updateVisiMisi, VisiMisiData } from "@/lib/firestoreService";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

export default function VisiMisiPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State untuk menyimpan data form
  const [dataId, setDataId] = useState<string | null>(null);
  const [visi, setVisi] = useState("");
  const [misiList, setMisiList] = useState<string[]>([]);
  const [quote, setQuote] = useState("");

  // Alert State
  const [alert, setAlert] = useState<{show: boolean, type: 'success'|'error', message: string} | null>(null);

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

  const loadData = async () => {
    try {
      const result = await getVisiMisiData();
      if (result) {
        setDataId(result.id);
        setVisi(result.visi || "");
        setMisiList(result.misi || []);
        setQuote(result.quote_ketua || "");
      }
    } catch (error) {
      console.error("Gagal memuat data:", error);
    }
  };

  // --- HANDLERS UNTUK MISI (ARRAY) ---
  const handleMisiChange = (index: number, value: string) => {
    const updatedMisi = [...misiList];
    updatedMisi[index] = value;
    setMisiList(updatedMisi);
  };

  const handleAddMisi = () => {
    setMisiList([...misiList, ""]);
  };

  const handleRemoveMisi = (index: number) => {
    const updatedMisi = misiList.filter((_, i) => i !== index);
    setMisiList(updatedMisi);
  };

  // --- SAVE HANDLER ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataId) {
        setAlert({show: true, type: 'error', message: 'Data Visi Misi tidak ditemukan di Database.'});
        return;
    }

    setSaving(true);
    
    // Filter misi yang kosong agar tidak tersimpan
    const cleanMisi = misiList.filter(m => m.trim() !== "");

    const payload = {
        visi,
        misi: cleanMisi,
        quote_ketua: quote
    };

    const res = await updateVisiMisi(dataId, payload);

    if (res.success) {
        setAlert({show: true, type: 'success', message: 'Visi & Misi berhasil diperbarui!'});
        // Update state lokal list misi supaya bersih dari input kosong
        setMisiList(cleanMisi);
    } else {
        setAlert({show: true, type: 'error', message: 'Gagal menyimpan perubahan.'});
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-slate-400 bg-slate-50">
      <Loader2 className="animate-spin mr-2" /> Memuat Data...
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20 relative">
      
      {/* Toast Alert */}
      {alert?.show && (
        <div className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-xl shadow-xl font-bold text-white animate-in slide-in-from-top-5 fade-in duration-300 flex items-center gap-2 ${
            alert.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
            {alert.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
            {alert.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-6 px-4 md:px-8 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20 text-white">
                <Target size={24}/> 
              </div>
              Manajemen Visi & Misi
            </h1>
            <p className="text-slate-500 text-sm mt-2 ml-1">Atur tujuan utama dan arah gerak organisasi.</p>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={saving}
            className="group bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-slate-900/10 transition-all hover:translate-y-[-2px] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
            Simpan Perubahan
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-8 space-y-8">
        
        {/* --- FORM VISI --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-blue-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                    <Target size={18} />
                </div>
                <h3 className="font-bold text-slate-800">Visi Organisasi</h3>
            </div>
            <div className="p-6">
                <label className="block text-sm font-medium text-slate-500 mb-2">
                    Visi Utama
                </label>
                <textarea 
                    rows={3}
                    value={visi}
                    onChange={(e) => setVisi(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-slate-800 placeholder:text-slate-400 transition-all resize-none text-lg font-medium"
                    placeholder="Masukkan visi organisasi..."
                ></textarea>
                <p className="text-xs text-slate-400 mt-2 text-right">
                    Karakter: {visi.length}
                </p>
            </div>
        </div>

        {/* --- FORM MISI --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-orange-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                        <List size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800">Daftar Misi</h3>
                </div>
                <button 
                    onClick={handleAddMisi}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                    <Plus size={14}/> Tambah Poin
                </button>
            </div>
            <div className="p-6 space-y-4">
                {misiList.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start group animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="mt-3 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold flex-shrink-0 border border-slate-200">
                            {index + 1}
                        </div>
                        <div className="flex-1">
                            <input 
                                type="text"
                                value={item}
                                onChange={(e) => handleMisiChange(index, e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none text-slate-700 placeholder:text-slate-300 transition-all"
                                placeholder={`Poin misi ke-${index + 1}`}
                            />
                        </div>
                        <button 
                            onClick={() => handleRemoveMisi(index)}
                            className="mt-1.5 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus Misi Ini"
                        >
                            <Trash2 size={18}/>
                        </button>
                    </div>
                ))}

                {misiList.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
                        <p className="text-slate-400 text-sm">Belum ada poin misi yang ditambahkan.</p>
                        <button onClick={handleAddMisi} className="mt-2 text-blue-600 font-bold text-sm hover:underline">
                            Tambah Sekarang
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* --- QUOTE KETUA (Opsional) --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-purple-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                    <Quote size={18} />
                </div>
                <h3 className="font-bold text-slate-800">Kutipan Ketua (Opsional)</h3>
            </div>
            <div className="p-6">
                <textarea 
                    rows={2}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none text-slate-700 italic placeholder:text-slate-400 transition-all resize-none"
                    placeholder="Masukkan pesan atau kutipan penyemangat dari Ketua..."
                ></textarea>
            </div>
        </div>

      </div>
    </main>
  );
}