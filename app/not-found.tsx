"use client";
import Link from "next/link";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      
      {/* Background Decoration (Optional) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Icon & 404 Text */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <FileQuestion size={64} className="text-blue-600" />
          </div>
        </div>

        <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-2">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
          Halaman Tidak Ditemukan
        </h2>
        
        <p className="text-slate-500 max-w-md mb-10 leading-relaxed">
          Maaf, halaman yang Anda cari mungkin telah dihapus, namanya diubah, atau tautannya rusak.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/" 
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Kembali ke Beranda
          </Link>
          
          <button 
            // Menggunakan window.history.back() via onClick wrapper atau cukup link ke halaman sebelumnya jika memungkinkan
            // Di sini kita arahkan ke contact saja sebagai alternatif, atau tombol back manual
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-white hover:border-slate-300 transition-all flex items-center justify-center gap-2 bg-transparent"
          >
            <ArrowLeft size={18} />
            Kembali Sebelumnya
          </button>
        </div>
      </div>
    </main>
  );
}