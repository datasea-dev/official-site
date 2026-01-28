import Link from "next/link";
import { 
  Globe, Code, Gamepad2, Server, Database, Zap, 
  ArrowRight, CheckCircle2, Cpu, Layout, Smartphone 
} from "lucide-react";

export default function DCenter() {
  return (
    <main className="relative min-h-screen flex flex-col text-slate-900 overflow-hidden">

      {/* --- SECTION 1: HERO --- */}
      <section className="relative z-10 pt-40 pb-20 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase mb-4 border border-blue-100">
          <Cpu size={14} /> Digital Ecosystem
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-datasea-blue mb-6 leading-tight">
          D-Center Ecosystem
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Pusat inovasi dan layanan digital dari komunitas Datasea. Kami menyediakan solusi teknologi mulai dari arsip pengetahuan, pengembangan website, hingga layanan hiburan.
        </p>
      </section>

      {/* --- SECTION 2: PRODUK UTAMA (SHOWCASE) --- */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto w-full space-y-24">
        
        {/* PRODUK 1: DATASEA ARCHIVE */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <div className="relative aspect-video bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl shadow-blue-900/20 flex items-center justify-center overflow-hidden border border-white/20 p-8 group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
              <div className="relative z-10 text-center text-white">
                <Database size={64} className="mx-auto mb-4 opacity-90 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-2xl font-bold">Knowledge Base</h3>
                <p className="text-blue-100 mt-2">Centralized Data Storage</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2">AKADEMIK & RESOURCE</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-datasea-blue mb-4">Datasea Archive</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Platform perpustakaan digital yang menyimpan ribuan aset belajar. Mulai dari modul praktikum, dataset latihan, hingga jurnal riset anggota. Terbuka dan gratis untuk seluruh anggota komunitas.
            </p>
            <ul className="space-y-3 mb-8">
              <FeatureItem text="Akses Modul Praktikum Lengkap" />
              <FeatureItem text="Bank Dataset untuk Machine Learning" />
              <FeatureItem text="Arsip Jurnal & Paper Riset" />
            </ul>
            <a 
              href="https://archive-datasea.vercel.app/" 
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 bg-datasea-blue text-white rounded-xl font-semibold hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20"
            >
              <Globe size={18} />
              Buka Archive
            </a>
          </div>
        </div>

        {/* PRODUK 2: WEB DEVELOPMENT */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="w-full md:w-1/2">
            <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-slate-900/20 flex items-center justify-center overflow-hidden border border-slate-700 p-8 group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
              <div className="relative z-10 text-center text-white">
                <Layout size={64} className="mx-auto mb-4 text-cyan-400 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-2xl font-bold">Modern Web</h3>
                <p className="text-slate-400 mt-2">Modern Tech Stack</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="text-cyan-600 font-bold tracking-wider uppercase text-sm mb-2">JASA PROFESIONAL</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-datasea-blue mb-4">Web Development Service</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Tim Divisi IT Datasea siap membantu UMKM, organisasi, atau personal branding Anda untuk *Go Digital*. Kami membangun website yang cepat, responsif, dan elegan menggunakan teknologi terbaru.
            </p>
            <ul className="space-y-3 mb-8">
              <FeatureItem text="Landing Page & Company Profile" />
              <FeatureItem text="Aplikasi Web Custom (Sistem Informasi)" />
              <FeatureItem text="SEO & Mobile Friendly Optimization" />
            </ul>
            <div className="flex gap-3">
              <Link href="/d_center" className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-600/20">
                <Code size={18} />
                Lihat Portofolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: TECH STACK (Final Update: All Colored Icons) --- */}
      <section className="relative z-10 py-20 px-6 bg-slate-50 border-t border-slate-200 text-center">
        <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-8">POWERED BY MODERN TECHNOLOGY</h3>
        {/* Hapus class grayscale agar ikon selalu berwarna */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-90 hover:opacity-100 transition-all duration-500">
          
          {/* Next.js */}
          <span className="text-xl md:text-2xl font-bold text-slate-700 flex items-center gap-2">
            <img 
              width="32" 
              height="32" 
              src="https://img.icons8.com/color/48/nextjs.png" 
              alt="Next.js Logo"
              className="hover:scale-110 transition-transform"
            />
            Next.js
          </span>

          {/* Tailwind CSS */}
          {/* Gunakan text-slate-700 agar seragam, biarkan ikon yang memberi warna */}
          <span className="text-xl md:text-2xl font-bold text-slate-700 flex items-center gap-2">
            <img 
              width="32" 
              height="32" 
              src="https://img.icons8.com/fluency/48/tailwind_css.png" 
              alt="Tailwind CSS Logo"
              className="hover:scale-110 transition-transform"
            />
            Tailwind
          </span>

          {/* Firebase */}
          <span className="text-xl md:text-2xl font-bold text-slate-700 flex items-center gap-2">
            <img 
              width="32" 
              height="32" 
              src="https://img.icons8.com/color/48/firebase.png" 
              alt="Firebase Logo"
              className="hover:scale-110 transition-transform"
            />
            Firebase
          </span>

          {/* Google Cloud */}
          <span className="text-xl md:text-2xl font-bold text-slate-700 flex items-center gap-2">
            <img 
              width="32" 
              height="32" 
              src="https://img.icons8.com/color/48/google-cloud.png" 
              alt="Google Cloud Logo"
              className="hover:scale-110 transition-transform"
            />
            Google Cloud
          </span>

        </div>
      </section>
    </main>
  );
}

// --- HELPER COMPONENT ---
function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
      <span className="text-slate-700 font-medium">{text}</span>
    </li>
  );
}