import Link from "next/link";
import Image from "next/image";
import { Target, Award, UserCircle, ArrowRight, Quote } from "lucide-react";
import { getTimData, getVisiMisiData } from "@/lib/firestoreService";

// Agar data selalu fresh saat dibuka
export const dynamic = 'force-dynamic';

export default async function TentangKami() {
  
  // 1. Ambil Data Tim & Visi Misi
  const [allTim, visiMisiData] = await Promise.all([
    getTimData(),
    getVisiMisiData()
  ]);

  // LOGIKA KETUA UMUM (Dinasmis)
  // Mencari jabatan yang mengandung kata "ketua umum" atau "president"
  const ketua = allTim.find(m => 
    m.divisi === "BPH" && 
    (m.jabatan.toLowerCase().includes("ketua umum") || m.jabatan.toLowerCase() === "president")
  ) || null;

  const quoteKetua = visiMisiData?.quote_ketua || "Data is the new oil, but knowledge is the engine.";

  // Data fallback
  const visi = visiMisiData?.visi || "Visi belum ditambahkan.";
  const misiList = visiMisiData?.misi || ["Misi belum ditambahkan."];

  // --- DATA DIVISI ---
  const DIVISIONS = [
    {
      id: "bph",
      name: "BPH",
      fullName: "Badan Pengurus Harian",
      desc: "Otak dari komunitas. Bertanggung jawab atas arah strategis dan koordinasi utama.",
      imageUrl: "https://res.cloudinary.com/ditweccqj/image/upload/v1763179717/1_v4ozs0.webp", 
      color: "bg-slate-100", 
    },
    {
      id: "psdm",
      name: "PSDM",
      fullName: "Pengembangan SDM",
      desc: "Jantung komunitas. Fokus pada kaderisasi, bonding, dan pengembangan skill anggota.",
      imageUrl: "https://res.cloudinary.com/ditweccqj/image/upload/v1763179716/2_bjbdck.webp",
      color: "bg-blue-50",
    },
    {
      id: "humas",
      name: "HUMAS",
      fullName: "Hubungan Masyarakat",
      desc: "Wajah komunitas. Mengelola branding, sosial media, dan relasi eksternal.",
      imageUrl: "https://res.cloudinary.com/ditweccqj/image/upload/v1763179717/4_pxkyhd.webp",
      color: "bg-purple-50",
    },
    {
      id: "ekraf",
      name: "EKRAF",
      fullName: "Ekonomi Kreatif",
      desc: "Tulang punggung finansial. Mengelola usaha dana dan merchandise.",
      imageUrl: "https://res.cloudinary.com/ditweccqj/image/upload/v1763179717/3_hkkccd.webp",
      color: "bg-green-50",
    },
    {
      id: "it",
      name: "Divisi IT",
      fullName: "Teknologi & Informasi",
      desc: "Pondasi digital. Mengembangkan website dan eksplorasi teknologi baru.",
      imageUrl: "https://res.cloudinary.com/ditweccqj/image/upload/v1765037904/ERAF_Banner_Horizontal_scv3vj.webp",
      color: "bg-cyan-50",
    },
    {
      id: "satir",
      name: "SATIR",
      fullName: "Sarana & Artistik",
      desc: "Jiwa seni komunitas. Bertanggung jawab atas desain grafis dan dokumentasi.",
      imageUrl: "https://res.cloudinary.com/ditweccqj/image/upload/v1763179717/5_aesits.webp",
      color: "bg-pink-50",
    },
  ];

  return (
    <main className="relative min-h-screen flex flex-col text-slate-900 overflow-hidden">
      
      {/* 1. PENGENALAN (HEADER) */}
      <section className="relative z-10 pt-40 pb-20 px-6 text-center max-w-5xl mx-auto">
        <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto bg-white p-2 rounded-[25%] shadow-xl shadow-blue-900/10 mb-8 hover:scale-105 transition-transform duration-500">
          <div className="relative w-full h-full rounded-[20%] overflow-hidden">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <Image src="/logo-datasea.png" alt="Logo Datasea" fill className="object-cover"/>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-4 leading-tight">
          Kami Adalah <span className="text-blue-600">Datasea</span>
        </h1>

        {/* --- BAGIAN YANG DIKEMBALIKAN (Slogan & Deskripsi) --- */}
        <p className="text-xl md:text-2xl font-medium text-slate-500 mb-8 italic">
          &quot;With Data, Get Insight&quot;
        </p>

        <div className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed space-y-4">
          <p>
            Datasea adalah komunitas mahasiswa di Universitas Teknologi Yogyakarta yang mendedikasikan diri untuk eksplorasi dan inovasi di bidang <strong>Sains Data</strong>.
          </p>
          {/* Tambahan deskripsi agar tidak terlalu kosong */}
          <p className="hidden md:block">
            Kami hadir sebagai wadah kolaboratif untuk mengembangkan potensi anggota dalam menghadapi tantangan era digital melalui pembelajaran, riset, dan pengembangan teknologi.
          </p>
        </div>
      </section>

      {/* 2. VISI MISI KETUA (FIXED) */}
      <section className="relative z-10 py-20 px-6 bg-[#1e293b] text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          
          {/* Kolom Kiri: Foto Ketua */}
          <div className="w-full md:w-1/3 flex flex-col items-center text-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500 shadow-2xl mb-6 bg-slate-800">
               {ketua?.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ketua.foto_url} alt={ketua.nama} className="w-full h-full object-cover" />
               ) : (
                  <UserCircle size={192} className="text-slate-600" />
               )}
            </div>
            {/* Mengambil Nama & Jabatan dari Database */}
            <h3 className="text-xl font-bold text-white">{ketua?.nama || "Ketua Umum"}</h3>
            <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-4">
               {ketua?.jabatan || "Ketua Umum Datasea"}
            </p>
            
            <div className="bg-white/10 p-6 rounded-2xl relative mt-6">
              <Quote className="absolute top-4 left-4 text-blue-500/40" size={24} />
              <p className="italic text-slate-300 text-sm pt-4 leading-relaxed">
                &quot;{quoteKetua}&quot;
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Visi & Misi */}
          <div className="w-full md:w-2/3 grid grid-cols-1 gap-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-600 rounded-xl text-white"><Target size={24} /></div>
                <h3 className="text-2xl font-bold text-blue-100">Visi Kami</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                &quot;{visi}&quot;
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-600 rounded-xl text-white"><Award size={24} /></div>
                <h3 className="text-2xl font-bold text-orange-100">Misi Kami</h3>
              </div>
              <ul className="space-y-2 text-slate-300">
                {misiList.map((item, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-orange-500">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* 3. CARD DIVISI */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">
            Struktur Organisasi
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Kenali Divisi Kami</h2>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
            Klik pada kartu divisi untuk melihat daftar anggota dan pengurusnya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DIVISIONS.map((div) => (
            <Link 
              key={div.id} 
              href={`/tentang_kami/${div.id}`} 
              className="group block h-full"
            >
              <div className="h-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col">
                
                {/* BANNER DIVISI */}
                <div className={`w-full h-48 relative overflow-hidden ${div.color} rounded-xl mb-6 shadow-inner`}>
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={div.imageUrl} 
                    alt={`Banner ${div.name}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {div.name}
                </h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  {div.fullName}
                </p>
                <p className="text-slate-600 mb-8 text-sm leading-relaxed line-clamp-3 flex-grow">
                  {div.desc}
                </p>
                
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-blue-600 transition-colors mt-auto">
                  Selengkapnya <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}