import Link from "next/link";
import { Rocket } from "lucide-react";
import { getAcaraData } from "@/lib/firestoreService";
import AcaraList from "@/components/AcaraList"; // Import komponen Client baru

export default async function AcaraPage() {
  
  // 1. Ambil SEMUA Data dari Firebase (Server Side)
  const allAcara = await getAcaraData();

  return (
    <main className="relative min-h-screen flex flex-col text-slate-900 overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-40 pb-8 px-6 text-center max-w-4xl mx-auto">
        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">
          Agenda & Kegiatan
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-datasea-blue mb-6 leading-tight">
          Jelajahi Event Seru
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Temukan berbagai workshop, seminar, dan gathering komunitas untuk meningkatkan skill data science kamu.
        </p>
      </section>

      {/* --- LIST ACARA (Client Component) --- */}
      {/* Kita oper data dari server ke komponen client */}
      <AcaraList initialData={allAcara} />

      {/* --- CTA --- */}
      <section className="relative z-10 py-24 px-6 text-center border-t border-slate-100">
        <div className="max-w-3xl mx-auto bg-datasea-blue rounded-3xl p-10 md:p-16 text-white shadow-2xl shadow-blue-900/40 overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Jangan Lewatkan Info!</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Follow Instagram kami agar tidak ketinggalan informasi pendaftaran event terbaru.
            </p>
            <a href="https://instagram.com/datasea.uty" target="_blank" className="px-8 py-3.5 bg-white text-datasea-blue font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg inline-flex items-center gap-2">
              <Rocket size={20}/>
              Follow Instagram
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}