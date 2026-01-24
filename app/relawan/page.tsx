"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Briefcase, Heart, Globe, Award, MapPin, 
  Loader2, ArrowRight
} from "lucide-react";
import { getActivePositions, VolunteerPosition } from "@/lib/firestoreService";

export default function VolunteerPage() {
  const [positions, setPositions] = useState<VolunteerPosition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getActivePositions();
        setPositions(data);
      } catch (error) {
        console.error("Gagal memuat lowongan:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900 pb-20">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 bg-[#0f172a] text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
            We Are Hiring
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Unlock Your Potential <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              with Datasea
            </span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Bergabunglah dengan ekosistem sains data terbesar di kampus. Kembangkan skill, perluas relasi, dan berkontribusi nyata.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#positions" className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
              <Briefcase size={20} /> Lihat Posisi Terbuka
            </a>
          </div>
        </div>
      </section>

      {/* --- BENEFITS SECTION --- */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Kenapa Bergabung?</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Bukan sekadar organisasi mahasiswa biasa. Kami menawarkan value nyata untuk karir masa depanmu.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BenefitCard icon={<Award size={32} />} title="Sertifikat & SKPI" desc="Dapatkan bukti kontribusi resmi yang valid untuk poin keaktifan kampus dan CV." />
            <BenefitCard icon={<Globe size={32} />} title="Professional Network" desc="Akses eksklusif ke jaringan alumni, praktisi industri, dan mentor sains data." />
            <BenefitCard icon={<Briefcase size={32} />} title="Real-World Project" desc="Terlibat dalam proyek riil. Bukan simulasi, tapi pengalaman kerja yang sesungguhnya." />
            <BenefitCard icon={<Heart size={32} />} title="Supportive Team" desc="Lingkungan yang inklusif, saling dukung, dan fokus pada pertumbuhan bersama." />
          </div>
        </div>
      </section>

      {/* --- JOB BOARD SECTION --- */}
      <section id="positions" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Posisi Terbuka</h2>
            <p className="text-slate-500 mt-2">Temukan peran yang sesuai dengan minatmu.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : positions.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {positions.map((job) => (
              <div key={job.id} className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                      {job.division}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                      <MapPin size={12} /> {job.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {job.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 max-w-2xl">
                    {job.description}
                  </p>
                </div>
                
                {/* --- UPDATE: Button diganti LINK ke halaman Detail --- */}
                <Link 
                  href={`/relawan/${job.id}`}
                  className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 flex-shrink-0 whitespace-nowrap"
                >
                  Detail & Apply <ArrowRight size={18}/>
                </Link>

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <Briefcase size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">Belum Ada Lowongan</h3>
            <p className="text-slate-500 text-sm mt-1">Saat ini belum ada posisi yang dibuka. Cek lagi nanti ya!</p>
          </div>
        )}
      </section>

    </main>
  );
}

function BenefitCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group">
      <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-slate-700 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}