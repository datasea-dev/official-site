"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ArrowLeft, MapPin, CheckCircle2, 
  Linkedin, Send, Loader2, Calendar, Users 
} from "lucide-react";
import { getPositionById, submitApplication, VolunteerPosition } from "@/lib/firestoreService";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params (Next.js 15/14)
  const resolvedParams = use(params);
  const jobId = resolvedParams.id;

  const [job, setJob] = useState<VolunteerPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    linkedinUrl: "",
    reason: ""
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPositionById(jobId);
        if (data) {
           setJob(data);
        } else {
           // Jika data tidak ditemukan, biarkan null (nanti di handle UI)
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    setIsSubmitting(true);
    try {
      await submitApplication({
        jobId: job.id!,
        jobTitle: job.title,
        ...formData
      });
      alert("Lamaran berhasil dikirim! Tim HR Datasea akan menghubungi Anda.");
      setFormData({ name: "", email: "", whatsapp: "", linkedinUrl: "", reason: "" });
    } catch (error) {
      console.error(error);
      alert("Gagal mengirim lamaran.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600"/></div>;
  if (!job) return <div className="min-h-screen flex flex-col items-center justify-center">Position not found <Link href="/relawan" className="text-blue-500 mt-4">Kembali</Link></div>;

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <Link href="/relawan" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 font-medium transition-colors">
          <ArrowLeft size={20} /> Kembali ke Lowongan
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* --- KOLOM KIRI: INFO LOWONGAN --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Card */}
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

            {/* Description & Requirements */}
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

          {/* --- KOLOM KANAN: FORMULIR LAMARAN (STICKY) --- */}
          <div className="lg:col-span-1 lg:sticky lg:top-28">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg shadow-blue-500/5">
                <div className="mb-6 pb-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Linkedin className="text-blue-600"/> Apply Now
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Lengkapi data di bawah ini untuk melamar.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                        <input required type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                        <input required type="email" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp</label>
                        <input required type="tel" placeholder="08..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Link LinkedIn Profile</label>
                        <input required type="url" placeholder="https://linkedin.com/in/..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Alasan Melamar</label>
                        <textarea required rows={3} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}
                        ></textarea>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 shadow-lg shadow-blue-600/20">
                        {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>}
                        Kirim Lamaran
                    </button>
                </form>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}