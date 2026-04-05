"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { 
  ArrowLeft, MapPin, CheckCircle2, 
  Loader2, Calendar, Users, ExternalLink 
} from "lucide-react";
import { getPositionById, VolunteerPosition } from "@/lib/firestoreService";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const jobId = resolvedParams.id;

  const [job, setJob] = useState<VolunteerPosition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPositionById(jobId);
        if (data) setJob(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [jobId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600"/></div>;
  if (!job) return <div className="min-h-screen flex flex-col items-center justify-center">Position not found <Link href="/relawan" className="text-blue-500 mt-4">Kembali</Link></div>;

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        <Link href="/relawan" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 font-medium transition-colors">
          <ArrowLeft size={20} /> Kembali ke Lowongan
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* --- KIRI: DESKRIPSI LOWONGAN --- */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex gap-3 mb-4">
                 <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">{job.division}</span>
                 <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1"><MapPin size={12}/> {job.type}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{job.title}</h1>
              <div className="flex gap-6 text-sm text-slate-500 border-t border-slate-100 pt-4 mt-4">
                 <div className="flex items-center gap-2"><Users size={16}/> Divisi {job.division}</div>
                 <div className="flex items-center gap-2"><Calendar size={16}/> Diposting Baru Saja</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Deskripsi Pekerjaan</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line mb-8">
                  {job.description}
                </p>

                <h3 className="text-lg font-bold text-slate-900 mb-4">Kualifikasi</h3>
                <ul className="space-y-3">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-600">
                      <CheckCircle2 size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
            </div>
          </div>

          {/* --- KANAN: TOMBOL CALL TO ACTION (CTA) --- */}
          <div className="lg:col-span-1 lg:sticky lg:top-28">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg shadow-blue-500/5 text-center">
                
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                    <ExternalLink size={32} strokeWidth={1.5} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3">Tertarik Bergabung?</h3>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                  Pastikan Anda sudah membaca deskripsi dan kualifikasi dengan teliti. Klik tombol di bawah untuk mengisi form pendaftaran.
                </p>

                {/* Logika Tombol Daftar */}
                {!job.isOpen ? (
                    <button disabled className="w-full py-3.5 bg-slate-200 text-slate-500 font-bold rounded-xl cursor-not-allowed">
                        Pendaftaran Ditutup
                    </button>
                ) : job.applicationUrl ? (
                    <a 
                      href={job.applicationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        Daftar Sekarang
                    </a>
                ) : (
                    <button disabled className="w-full py-3.5 bg-slate-200 text-slate-500 font-bold rounded-xl cursor-not-allowed">
                        Link Belum Tersedia
                    </button>
                )}
                
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}