"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2, AlertCircle } from "lucide-react";
// PERBAIKAN: Import sendMessage (sesuai nama di firestoreService.ts Anda)
import { sendMessage } from "@/lib/firestoreService";

export default function ContactForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    instansi: "",
    email: "",
    message: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    
    if (errors[id]) {
      setErrors({ ...errors, [id]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = "Nama lengkap wajib diisi.";
    else if (formData.name.length < 3) newErrors.name = "Nama terlalu pendek.";

    if (!formData.instansi.trim()) newErrors.instansi = "Nama instansi wajib diisi.";

    if (!formData.email.trim()) newErrors.email = "Email wajib diisi.";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Format email tidak valid.";

    if (!formData.message.trim()) newErrors.message = "Pesan tidak boleh kosong.";
    else if (formData.message.length < 10) newErrors.message = "Pesan terlalu singkat.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // PERBAIKAN: Menggunakan sendMessage
      // Fungsi sendMessage Anda mengembalikan Promise<{ success: boolean, id: string }>
      const result = await sendMessage(formData);
      
      // Cek hasil (karena sendMessage Anda me-return object, bukan boolean langsung)
      if (result && result.success) {
        router.push("/terimakasih");
      } else {
        alert("Gagal mengirim pesan. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error submit:", error);
      alert("Terjadi kesalahan sistem saat mengirim pesan.");
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (fieldName: string) => `
    w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 
    ${errors[fieldName] 
      ? "bg-red-50 border-red-500 focus:ring-red-200 focus:border-red-500 text-red-900 placeholder:text-red-300" 
      : "bg-slate-50 border-slate-200 focus:ring-blue-500 focus:bg-white text-slate-900"
    }
  `;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
      
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={20} />
          <p>Mohon perbaiki kesalahan pada formulir di bawah ini.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-semibold text-slate-700">Nama Lengkap <span className="text-red-500">*</span></label>
          <input type="text" id="name" value={formData.name} onChange={handleChange} className={getInputClass("name")} placeholder="Nama Anda" />
          {errors.name && <p className="text-xs text-red-500 font-medium mt-1">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="instansi" className="text-sm font-semibold text-slate-700">Instansi <span className="text-red-500">*</span></label>
          <input type="text" id="instansi" value={formData.instansi} onChange={handleChange} className={getInputClass("instansi")} placeholder="Asal Kampus/Perusahaan" />
          {errors.instansi && <p className="text-xs text-red-500 font-medium mt-1">{errors.instansi}</p>}
        </div>
      </div>
      
      <div className="space-y-2 mb-6">
        <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email <span className="text-red-500">*</span></label>
        <input type="text" id="email" value={formData.email} onChange={handleChange} className={getInputClass("email")} placeholder="contoh@email.com" />
        {errors.email && <p className="text-xs text-red-500 font-medium mt-1">{errors.email}</p>}
      </div>

      <div className="space-y-2 mb-8">
        <label htmlFor="message" className="text-sm font-semibold text-slate-700">Pesan <span className="text-red-500">*</span></label>
        <textarea id="message" rows={4} value={formData.message} onChange={handleChange} className={`${getInputClass("message")} resize-none`} placeholder="Ceritakan rencana kolaborasi Anda..."></textarea>
        {errors.message && <p className="text-xs text-red-500 font-medium mt-1">{errors.message}</p>}
      </div>

      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
        {loading ? "Mengirim..." : "Kirim Pesan"}
      </button>
    </form>
  );
}