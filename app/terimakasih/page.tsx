import Link from "next/link";
import { CheckCircle, ArrowLeft, Mail } from "lucide-react";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
    
      <div className="max-w-lg w-full text-center bg-white/80 backdrop-blur-xl border border-white/60 p-8 md:p-12 rounded-3xl shadow-2xl shadow-blue-900/5 ring-1 ring-slate-100">
        
        {/* Icon Sukses Animasi */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
          <CheckCircle className="text-green-600" size={40} />
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Pesan Terkirim!
        </h1>
        
        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
          Terima kasih telah menghubungi <span className="font-semibold text-blue-600">Datasea</span>. Tim kami akan segera meninjau pesan Anda dan membalasnya melalui email.
        </p>

        {/* Info Tambahan (Opsional) */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 flex items-center gap-3 text-left">
           <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
             <Mail size={20} className="text-blue-500"/>
           </div>
           <div>
             <p className="text-xs text-slate-400 font-bold uppercase">Waktu Respon</p>
             <p className="text-sm font-medium text-slate-700">Biasanya dalam 1x24 jam kerja.</p>
           </div>
        </div>

        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/20 hover:-translate-y-1"
        >
          <ArrowLeft size={20} />
          Kembali ke Beranda
        </Link>

      </div>
    </main>
  );
}