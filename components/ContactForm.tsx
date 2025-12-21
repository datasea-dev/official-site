"use client";

import { useState, useRef } from "react";
// 1. Import useRouter untuk navigasi
import { useRouter } from "next/navigation";
import { Send, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

export default function ContactForm() {
  // 2. Inisialisasi Router
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // State: Menyimpan daftar field yang error (true = merah)
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  // State: Apakah form sudah disentuh/aktif?
  const [isFormActive, setIsFormActive] = useState(false);

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  // Fungsi untuk mengaktifkan widget saat user mulai mengetik/klik
  const handleFormInteraction = () => {
    if (!isFormActive) {
        setIsFormActive(true);
    }
  };

  // Fungsi untuk menghapus border merah saat user mengetik
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Simpan referensi form
    const form = e.currentTarget; 

    setLoading(true);
    setErrorMsg("");
    
    const formData = new FormData(form);
    const name = formData.get("name")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim(); // Ambil phone
    const instansi = formData.get("instansi")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const message = formData.get("message")?.toString().trim();

    // 2. Validasi Input
    const newErrors: { [key: string]: boolean } = {};
    let hasError = false;

    if (!name) { newErrors.name = true; hasError = true; }
    if (!phone) { newErrors.phone = true; hasError = true; } // Validasi phone
    if (!instansi) { newErrors.instansi = true; hasError = true; }
    if (!message) { newErrors.message = true; hasError = true; }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) { newErrors.email = true; hasError = true; }

    if (hasError) {
        setErrors(newErrors);
        setErrorMsg("Mohon lengkapi bidang yang bertanda merah.");
        if (!isFormActive) setIsFormActive(true);
        setLoading(false);
        return;
    }

    // 3. Cek Token Turnstile
    if (!turnstileToken) {
        if (!isFormActive) setIsFormActive(true);
        setErrorMsg("Sedang memverifikasi keamanan, silakan tunggu sebentar.");
        setLoading(false);
        return;
    }

    // Sertakan phone dalam objek data
    const data = { name, phone, instansi, email, message, token: turnstileToken };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Gagal mengirim pesan");

      // Reset form & state
      form.reset(); 
      setTurnstileToken(null);
      setIsFormActive(false); 
      setErrors({}); 
      turnstileRef.current?.reset();

      // --- 3. REDIRECT KE HALAMAN TERIMA KASIH ---
      router.push("/terimakasih"); 

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Terjadi kesalahan. Silakan coba lagi.");
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    } finally {
      setLoading(false);
    }
  };

  // Helper class input dinamis
  const getInputClass = (fieldName: string) => {
    const baseClass = "w-full px-5 py-3 rounded-xl border transition-all outline-none focus:ring-4 text-slate-700";
    if (errors[fieldName]) {
        return `${baseClass} border-red-500 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-500/10`;
    }
    return `${baseClass} bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-blue-500/10 placeholder:text-slate-400`;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10"></div>
      </div>
      
      <div className="relative z-10 p-8 md:p-10">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Ingin Berkolaborasi?</h3>
        
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={24} />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} onFocus={handleFormInteraction} noValidate className="space-y-5">
          {/* Baris 1: Nama & Nomor Telepon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2 text-left">
              <label htmlFor="name" className={`text-sm font-bold ml-1 ${errors.name ? "text-red-500" : "text-slate-700"}`}>
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" id="name" name="name" placeholder="Nama Anda"
                className={getInputClass("name")}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2 text-left">
              <label htmlFor="phone" className={`text-sm font-bold ml-1 ${errors.phone ? "text-red-500" : "text-slate-700"}`}>
                Nomor Telepon/WA <span className="text-red-500">*</span>
              </label>
              <input 
                type="tel" id="phone" name="phone" placeholder="08123456789"
                className={getInputClass("phone")}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Baris 2: Instansi & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2 text-left">
              <label htmlFor="instansi" className={`text-sm font-bold ml-1 ${errors.instansi ? "text-red-500" : "text-slate-700"}`}>
                Instansi <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" id="instansi" name="instansi" placeholder="Asal Kampus/Perusahaan"
                className={getInputClass("instansi")}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2 text-left">
              <label htmlFor="email" className={`text-sm font-bold ml-1 ${errors.email ? "text-red-500" : "text-slate-700"}`}>
                  Email <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" id="email" name="email" placeholder="contoh@email.com"
                className={getInputClass("email")}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Baris 3: Pesan */}
          <div className="space-y-2 text-left">
            <label htmlFor="message" className={`text-sm font-bold ml-1 ${errors.message ? "text-red-500" : "text-slate-700"}`}>
                Pesan <span className="text-red-500">*</span>
            </label>
            <textarea 
              id="message" name="message" rows={4} placeholder="Ceritakan rencana kolaborasi Anda..."
              className={`${getInputClass("message")} resize-none`}
              onChange={handleInputChange}
            ></textarea>
          </div>

          {/* --- WIDGET CLOUDFLARE TURNSTILE (LAZY LOAD) --- */}
          <div className={`w-full px-4 py-3 rounded-xl border flex justify-center items-center min-h-[72px] transition-all duration-500 ${isFormActive ? "bg-slate-50 border-slate-200" : "bg-white border-slate-100"}`}>
             {isFormActive ? (
                 <div className="w-full animate-in fade-in zoom-in duration-300">
                    <Turnstile 
                        ref={turnstileRef}
                        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                        onSuccess={(token) => setTurnstileToken(token)}
                        onError={() => setErrorMsg("Gagal memuat verifikasi keamanan.")}
                        options={{
                            theme: 'light',
                            size: 'flexible', 
                        }}
                        style={{ width: '100%' }} 
                    />
                 </div>
             ) : (
                 <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                    <ShieldCheck size={18} />
                    <span>Verifikasi keamanan akan muncul saat Anda mengetik...</span>
                 </div>
             )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed relative z-10"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            {loading ? "Sedang Mengirim..." : "Kirim Pesan"}
          </button>
        </form>
      </div>
    </div>
  );
}