import Link from "next/link";
import { 
  Target, Award, Rocket, Gavel, UserCheck, Megaphone, ShoppingBag,
  Cpu, Palette, Star, Zap, Brain, Presentation, Laptop, Calendar 
} from "lucide-react";
import { getProgramKerjaData } from "@/lib/firestoreService"; 
import FlagshipCard from "@/components/FlagshipCard"; 

export const dynamic = 'force-dynamic';

export default async function ProgramKerja() {
  
  // 1. AMBIL DATA DARI FIREBASE
  const { prokerBesar, prokerDivisi } = await getProgramKerjaData();

  // Helper Filter Divisi
  const getProkerByDivisi = (namaDivisi: string) => {
    return (prokerDivisi || []).filter((item) => item.divisi === namaDivisi);
  };

  // --- LOGIKA AUTO-STYLE UNTUK PROKER BESAR ---
  // PERUBAHAN DI SINI: Semua tag diganti menjadi "Unggulan"
  const styles = [
    { color: "orange", icon: <Brain size={28} />, tag: "Unggulan" },
    { color: "purple", icon: <Presentation size={28} />, tag: "Unggulan" },
    { color: "blue", icon: <Laptop size={28} />, tag: "Unggulan" },
    { color: "pink", icon: <Calendar size={28} />, tag: "Unggulan" },
    { color: "green", icon: <Star size={28} />, tag: "Unggulan" },
    { color: "cyan", icon: <Zap size={28} />, tag: "Unggulan" },
  ];

  // --- LOGIKA LAYOUT DINAMIS ---
  const countBesar = prokerBesar.length;
  const containerBesarClass = countBesar < 4 
    ? "flex flex-wrap justify-center gap-6" 
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6";
  
  const cardBesarWrapperClass = countBesar < 4 
    ? "w-full max-w-[290px]" 
    : "w-full";

  return (
    <main className="relative min-h-screen flex flex-col text-slate-900 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative z-10 pt-40 pb-20 px-6 text-center max-w-4xl mx-auto">
        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">
          Roadmap & Aktivitas
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-datasea-blue mb-6 leading-tight">
          Program Kerja Kami
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Sinergi 6 divisi utama untuk menciptakan ekosistem belajar Sains Data yang progresif, inovatif, dan berkelanjutan.
        </p>
      </section>

      {/* --- PROKER BESAR --- */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase mb-4 border border-orange-100">
            <Award size={14} /> Flagship Programs
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-datasea-blue">Agenda Unggulan</h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Program kerja besar yang dijalankan melalui kolaborasi seluruh divisi.
          </p>
        </div>

        <div className={containerBesarClass}>
          {prokerBesar.length > 0 ? (
            prokerBesar.map((item, index) => {
              const style = styles[index % styles.length]; 
              return (
                <div key={item.id || index} className={cardBesarWrapperClass}>
                    {/* Menggunakan Komponen Client Baru */}
                    <FlagshipCard 
                      title={item.nama_proker}
                      desc={item.deskripsi}
                      icon={style.icon}
                      color={style.color}
                      tag={style.tag} // Tag akan selalu "Unggulan" sesuai array styles
                    />
                </div>
              );
            })
          ) : (
            <div className="col-span-full w-full py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-3">
                <Rocket size={24} />
              </div>
              <p className="text-slate-600 font-medium">Belum ada agenda unggulan saat ini.</p>
              <p className="text-sm text-slate-400 mt-1">Data sedang dimuat dari Firebase atau belum diisi.</p>
            </div>
          )}
        </div>
      </section>

      {/* --- DIVISI ORGANISASI --- */}
      <section className="relative z-10 py-20 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase mb-4 border border-blue-100">
              <Target size={14} /> Struktur & Divisi
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-datasea-blue">Fokus Divisi</h2>
            <p className="text-slate-600 mt-3">
              Peran spesifik setiap departemen dalam membangun komunitas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DivisionCard 
              name="BPH" role="Badan Pengurus Harian" desc="Bertanggung jawab atas arah strategis dan koordinasi."
              icon={<Gavel size={28} />} colorClass="bg-slate-100 text-slate-700"
              programs={getProkerByDivisi("BPH")}
            />
            <DivisionCard 
              name="PSDM" role="Human Resources" desc="Fokus pada kaderisasi dan peningkatan softskill anggota."
              icon={<UserCheck size={28} />} colorClass="bg-blue-100 text-blue-600"
              programs={getProkerByDivisi("PSDM")}
            />
            <DivisionCard 
              name="HUMAS" role="Public Relations" desc="Ujung tombak komunikasi eksternal dan branding."
              icon={<Megaphone size={28} />} colorClass="bg-purple-100 text-purple-600"
              programs={getProkerByDivisi("HUMAS")}
            />
            <DivisionCard 
              name="EKRAF" role="Creative Economy" desc="Membangun kemandirian finansial komunitas."
              icon={<ShoppingBag size={28} />} colorClass="bg-green-100 text-green-600"
              programs={getProkerByDivisi("EKRAF")}
            />
            <DivisionCard 
              name="IT" role="Technology & Dev" desc="Pengembangan website dan eksplorasi teknologi."
              icon={<Cpu size={28} />} colorClass="bg-cyan-100 text-cyan-600"
              programs={[...getProkerByDivisi("Divisi IT"), ...getProkerByDivisi("IT")]}
            />
            <DivisionCard 
              name="MIDTECH" role="Kominfo & Media" desc="Pusat informasi, desain grafis, dan jurnalistik."
              icon={<Palette size={28} />} colorClass="bg-pink-100 text-pink-600"
              programs={getProkerByDivisi("SATIR")}
            />
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="relative z-10 py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-blue-600 rounded-3xl p-10 md:p-16 text-white shadow-2xl shadow-blue-900/40 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -ml-16 -mb-16"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Ingin Berkolaborasi dengan Divisi Kami?</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Kami terbuka untuk kerjasama sponsorship, media partner, atau studi banding organisasi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contact-form" className="px-8 py-3.5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                <Rocket size={20}/>
                Hubungi Humas
              </Link>
              <Link href="/tentang_kami" className="px-8 py-3.5 border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                Lihat Profil Pengurus
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

// --- DivisionCard tetap di sini karena statis (tidak perlu interaksi klik) ---
function DivisionCard({ name, role, desc, icon, colorClass, programs }: { 
  name: string, role: string, desc: string, icon: React.ReactNode, colorClass: string, programs: any[] 
}) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col h-full">
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${colorClass}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{name}</h3>
          <p className="text-sm text-slate-500 font-medium">{role}</p>
        </div>
      </div>
      <p className="text-slate-600 mb-6 leading-relaxed text-sm flex-grow">
        {desc}
      </p>
      
      {/* List Program Kerja dari Firebase */}
      <div className="space-y-3 border-t border-slate-100 pt-4 mt-auto">
        {programs && programs.length > 0 ? (
          programs.map((prog: any, idx: number) => (
            <div key={idx} className="flex gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors items-start">
              <div className="mt-1.5 flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-0.5">{prog.nama_proker}</h4>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {prog.deskripsi || "Deskripsi belum tersedia."}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 italic py-2 text-center bg-slate-50 rounded-lg">
            Program akan segera diupdate.
          </p>
        )}
      </div>
    </div>
  );
}