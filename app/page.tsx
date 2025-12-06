import Link from "next/link";
import { ArrowRight, Calendar, Code, Gamepad2, BookOpen, Send, Clock, MapPin } from "lucide-react";
import { getAcaraData } from "@/lib/firestoreService";

export default async function Home() {
  
  // 1. Ambil Data Acara dari Firebase
  const allAcara = await getAcaraData();

  // 2. Filter: Hanya status "Segera"
  const latestEvents = allAcara
    .filter((a) => a.status_acara === "Segera")
    .slice(0, 3);

  // --- LOGIKA LAYOUT TENGAH ---
  const countAcara = latestEvents.length;
  const acaraContainerClass = countAcara < 3 
    ? "flex flex-wrap justify-center gap-8" 
    : "grid grid-cols-1 md:grid-cols-3 gap-8";
  const acaraCardClass = countAcara < 3 ? "w-full max-w-[380px]" : "w-full";

  return (
    <main className="relative flex flex-col text-slate-900 overflow-hidden">
      
      {/* --- SECTION 1: HERO --- */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center max-w-5xl mx-auto pt-20 relative">
        <h1 className="text-5xl md:text-7xl font-extrabold text-datasea-blue tracking-tight mb-6 leading-tight">
          Komunitas <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Datasea</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl leading-relaxed mb-10">
          "With Data, Get Insight"
          <br/>
          Energi kolaborasi Sains Data yang berfokus pada pengembangan dan inovasi berbasis data.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/about" className="px-8 py-3.5 rounded-xl bg-datasea-blue text-white font-semibold hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2">
            Tentang Kami <ArrowRight size={18} />
          </Link>
          <Link href="/program_kerja" className="px-8 py-3.5 rounded-xl bg-white text-datasea-blue border border-slate-200 font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm">
            <Calendar size={18} />
            Lihat Program
          </Link>
        </div>
        <div className="absolute bottom-10 animate-bounce text-slate-400 flex flex-col items-center gap-2">
          <span className="text-xs font-medium">Scroll ke bawah</span>
          <ArrowRight size={16} className="rotate-90" />
        </div>
      </section>

      {/* --- SECTION 2: STATISTIK --- */}
      <section className="relative z-10 py-24 px-6 border-y border-slate-200 bg-white/80 backdrop-blur-sm text-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-2">SIAPA KAMI?</h3>
            <h2 className="text-3xl md:text-4xl font-bold text-datasea-blue mb-6">Membangun Talenta Digital Masa Depan</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Datasea bukan sekadar organisasi, melainkan ekosistem belajar. Kami menghubungkan mahasiswa yang memiliki ketertarikan pada pengolahan data, kecerdasan buatan, dan teknologi kesehatan.
            </p>
            <Link href="/about" className="text-datasea-blue font-semibold hover:text-blue-600 inline-flex items-center gap-2 group">
              Selengkapnya tentang sejarah kami <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <span className="text-4xl font-bold text-blue-600 block mb-1">50+</span>
              <span className="text-slate-500 text-sm">Anggota Aktif</span>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <span className="text-4xl font-bold text-cyan-600 block mb-1">12+</span>
              <span className="text-slate-500 text-sm">Proyek Selesai</span>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <span className="text-4xl font-bold text-purple-600 block mb-1">20+</span>
              <span className="text-slate-500 text-sm">Workshop & Event</span>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <span className="text-4xl font-bold text-orange-600 block mb-1">3</span>
              <span className="text-slate-500 text-sm">Divisi Fokus</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: KEGIATAN TERBARU --- */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto w-full text-slate-900">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-datasea-blue">Kegiatan Terbaru</h2>
            <p className="text-slate-500 mt-2 text-lg">Agenda seru dan aktivitas komunitas.</p>
          </div>
          
          {/* TOMBOL ATAS (Hanya Desktop) */}
          <Link href="/acara" className="hidden md:inline-flex px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
            Lihat Semua Acara
          </Link>
        </div>

        {latestEvents.length > 0 ? (
          <div className={acaraContainerClass}>
            {latestEvents.map((item, idx) => (
              <div key={item.id || idx} className={`group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full ${acaraCardClass}`}>
                <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-slate-400 group-hover:from-blue-900 group-hover:to-slate-900 transition-colors relative overflow-hidden">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                   <span className="absolute top-4 left-4 px-2 py-1 rounded bg-white/10 backdrop-blur-sm text-[10px] text-white uppercase font-bold tracking-wider border border-white/20">
                     {item.penyelenggara || "Event"}
                   </span>
                   <Calendar size={48} className="text-white/20"/>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3 font-medium">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {item.tanggal_acara}</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> {item.waktu_acara}</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.nama_acara}
                  </h4>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
                    {item.deskripsi_acara}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin size={12}/> {item.lokasi}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full py-16 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 text-slate-400 mb-4">
              <Calendar size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Belum ada acara yang akan datang</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
              Saat ini belum ada jadwal kegiatan baru yang dipublikasikan. Cek halaman arsip atau follow sosial media kami.
            </p>
          </div>
        )}

        {/* TOMBOL BAWAH (Hanya Mobile) */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/acara" className="px-5 py-3 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all w-full block">
            Lihat Semua Acara
          </Link>
        </div>
      </section>

      {/* --- SECTION 4: D-CENTER --- */}
      <section className="relative z-10 py-24 px-6 bg-[#172033] text-white"> 
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-blue-400 font-bold tracking-wider uppercase text-sm">Produk & Layanan</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Ekosistem D-Center</h2>
            <p className="text-slate-400 text-lg">
              Layanan dan produk digital yang dikembangkan oleh anggota Datasea untuk mendukung belajar dan bisnis.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <Link href="/d_center" className="w-full sm:w-[350px] group">
                <div className="p-8 h-full rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500 hover:bg-white/10 transition-all flex flex-col items-start text-left">
                  <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <BookOpen size={28} />
                  </div>
                  <h4 className="text-xl font-bold mb-3">Datasea Archive</h4>
                  <p className="text-slate-400 mb-6 text-sm leading-relaxed flex-grow">
                    Platform terpusat untuk menyimpan materi praktikum, modul, dan jurnal riset yang dapat diakses gratis.
                  </p>
                  <span className="text-blue-400 font-semibold text-sm group-hover:text-white inline-flex items-center gap-2">
                    Buka Archive <ArrowRight size={14}/>
                  </span>
                </div>
            </Link>
            <Link href="/d_center" className="w-full sm:w-[350px] group">
                <div className="p-8 h-full rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500 hover:bg-white/10 transition-all flex flex-col items-start text-left">
                  <div className="w-14 h-14 bg-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Code size={28} />
                  </div>
                  <h4 className="text-xl font-bold mb-3">Web Development</h4>
                  <p className="text-slate-400 mb-6 text-sm leading-relaxed flex-grow">
                    Jasa pembuatan website statis maupun dinamis dengan teknologi modern (Next.js/React) untuk kebutuhanmu.
                  </p>
                  <span className="text-cyan-400 font-semibold text-sm group-hover:text-white inline-flex items-center gap-2">
                    Lihat Portofolio <ArrowRight size={14}/>
                  </span>
                </div>
            </Link>
            <Link href="/d_center" className="w-full sm:w-[350px] group">
                <div className="p-8 h-full rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500 hover:bg-white/10 transition-all flex flex-col items-start text-left">
                  <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Gamepad2 size={28} />
                  </div>
                  <h4 className="text-xl font-bold mb-3">Gaming Services</h4>
                  <p className="text-slate-400 mb-6 text-sm leading-relaxed flex-grow">
                    Layanan joki rank dan top-up game terpercaya yang dikelola langsung oleh member komunitas.
                  </p>
                  <span className="text-purple-400 font-semibold text-sm group-hover:text-white inline-flex items-center gap-2">
                    Hubungi Admin <ArrowRight size={14}/>
                  </span>
                </div>
            </Link>
          </div>

          <div className="text-center">
            <Link href="/d_center" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/20 text-white font-semibold hover:bg-white hover:text-slate-900 transition-all group">
              Lihat Semua Layanan D-Center 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>

        </div>
      </section>

      {/* --- SECTION 5: FORMULIR KERJASAMA --- */}
      <section id="contact-form" className="relative z-10 py-24 px-6 max-w-4xl mx-auto w-full scroll-mt-24 text-slate-900">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-datasea-blue mb-4">Ingin Berkolaborasi?</h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Kami terbuka untuk kerjasama media partner, studi banding, atau proyek teknologi. 
            Silakan kirim pesan kepada kami.
          </p>
        </div>

        <form className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
              <input 
                type="text" 
                id="name"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                placeholder="Nama Anda"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="instansi" className="text-sm font-semibold text-slate-700">Instansi / Organisasi</label>
              <input 
                type="text" 
                id="instansi"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                placeholder="Asal Kampus/Perusahaan"
              />
            </div>
          </div>
          
          <div className="space-y-2 mb-6">
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email</label>
            <input 
              type="email" 
              id="email"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="contoh@email.com"
            />
          </div>

          <div className="space-y-2 mb-8">
            <label htmlFor="message" className="text-sm font-semibold text-slate-700">Pesan / Keperluan</label>
            <textarea 
              id="message"
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
              placeholder="Ceritakan rencana kolaborasi Anda..."
            ></textarea>
          </div>

          <button 
            type="button" 
            className="w-full bg-datasea-blue text-white font-bold py-4 rounded-xl hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <Send size={20} />
            Kirim Pesan
          </button>
        </form>
      </section>

    </main>
  );
}