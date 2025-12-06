import Link from "next/link";
import { ArrowLeft, UserCircle, CheckCircle2, Info } from "lucide-react";
import { getTimData } from "@/lib/firestoreService";
import { notFound } from "next/navigation";

// --- DATA STATIS: INFO DETAIL DIVISI ---
const DIVISION_DETAILS: Record<string, { 
  name: string; 
  fullName: string; 
  description: string; 
  tasks: string[] 
}> = {
  "bph": {
    name: "BPH",
    fullName: "Badan Pengurus Harian",
    description: "Jantung dari organisasi Datasea. BPH bertanggung jawab penuh atas arah gerak, pengambilan keputusan strategis, dan koordinasi antar seluruh elemen komunitas untuk memastikan visi dan misi tercapai.",
    tasks: [
      "Merumuskan Grand Design dan arah kebijakan komunitas selama satu periode.",
      "Mengawasi dan mengevaluasi kinerja seluruh divisi.",
      "Mengelola administrasi kesekretariatan dan keuangan organisasi.",
      "Menjadi representasi utama komunitas ke pihak eksternal."
    ]
  },
  "psdm": {
    name: "PSDM",
    fullName: "Pengembangan Sumber Daya Manusia",
    description: "Divisi yang berfokus pada 'manusia' di dalam Datasea. PSDM memastikan setiap anggota merasa nyaman, berkembang, dan memiliki rasa kepemilikan yang tinggi terhadap komunitas.",
    tasks: [
      "Melakukan rekrutmen dan seleksi anggota baru (Open Recruitment).",
      "Merancang program upgrading skill organisasi dan kepemimpinan.",
      "Menjaga soliditas dan bonding antar anggota melalui gathering/makrab.",
      "Melakukan penilaian kinerja (raport) anggota secara berkala."
    ]
  },
  "humas": {
    name: "HUMAS",
    fullName: "Hubungan Masyarakat",
    description: "Gardu terdepan komunikasi Datasea. HUMAS bertugas membangun citra positif komunitas dan menjembatani komunikasi dengan pihak eksternal, baik kampus maupun industri.",
    tasks: [
      "Mengelola akun media sosial resmi (Instagram, LinkedIn, TikTok).",
      "Menjalin kerjasama dengan media partner dan sponsor.",
      "Melakukan kunjungan relasi (Company Visit) ke perusahaan teknologi.",
      "Menjadi pusat informasi bagi pihak luar yang ingin mengenal Datasea."
    ]
  },
  "ekraf": {
    name: "EKRAF",
    fullName: "Ekonomi Kreatif",
    description: "Motor penggerak finansial komunitas. EKRAF menumbuhkan jiwa wirausaha anggota dan mengelola sumber pendapatan mandiri untuk mendukung operasional kegiatan.",
    tasks: [
      "Memproduksi dan menjual merchandise resmi komunitas (PDH, Korsa, Sticker).",
      "Mengelola usaha dana (Danus) harian atau event-based.",
      "Menyelenggarakan workshop berbayar untuk umum.",
      "Mencari peluang pendanaan kreatif lainnya."
    ]
  },
  "it": {
    name: "Divisi IT",
    fullName: "Teknologi & Informasi",
    description: "Divisi teknis yang menjadi tulang punggung digital Datasea. Bertanggung jawab atas pengelolaan aset teknologi dan eksplorasi tools baru untuk efisiensi organisasi.",
    tasks: [
      "Mengembangkan dan memelihara Website Resmi Datasea & Archive.",
      "Melakukan riset teknologi baru yang bermanfaat bagi komunitas.",
      "Memberikan dukungan teknis (IT Support) untuk kegiatan operasional.",
      "Mengadakan pelatihan internal terkait web development atau tools produktivitas."
    ]
  },
  "satir": {
    name: "SATIR",
    fullName: "Sarana Artistik & Informasi",
    description: "Pusat kreativitas visual Datasea. SATIR mengubah informasi menjadi karya visual yang menarik dan mendokumentasikan setiap momen berharga komunitas.",
    tasks: [
      "Membuat desain grafis untuk feeds sosial media dan poster kegiatan.",
      "Melakukan dokumentasi (foto/video) setiap agenda komunitas.",
      "Menulis artikel berita (jurnalistik) seputar kegiatan Datasea.",
      "Menjaga konsistensi visual branding Datasea."
    ]
  }
};

export default async function DivisionPage({ params }: { params: Promise<{ slug: string }> }) {
  
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const divisionInfo = DIVISION_DETAILS[slug];

  if (!divisionInfo) return notFound();

  const allTim = await getTimData();
  const members = allTim.filter(m => m.divisi === divisionInfo.name);

  // Pisahkan Ketua/Koordinator
  const leaders = members.filter(m => m.jabatan.toLowerCase().includes("ketua") || m.jabatan.toLowerCase().includes("koordinator") || m.jabatan.toLowerCase().includes("kepala"));
  const staffs = members.filter(m => !m.jabatan.toLowerCase().includes("ketua") && !m.jabatan.toLowerCase().includes("koordinator") && !m.jabatan.toLowerCase().includes("kepala"));

  return (
    <main className="min-h-screen bg-white text-slate-900 pt-32 pb-20 px-6">
      
      {/* Background Pattern Halus */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="max-w-6xl mx-auto">
        
        {/* Tombol Kembali */}
        <Link href="/tentang_kami" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-10 font-medium transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Struktur
        </Link>

        {/* --- SECTION 1: HEADER & DESKRIPSI DIVISI --- */}
        <div className="flex flex-col md:flex-row gap-12 mb-20">
          
          {/* Kiri: Judul & Deskripsi */}
          <div className="w-full md:w-1/2">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">
              Detail Divisi
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-datasea-blue mb-2">
              {divisionInfo.name}
            </h1>
            <h2 className="text-xl text-slate-400 font-medium mb-6">
              {divisionInfo.fullName}
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              {divisionInfo.description}
            </p>
          </div>

          {/* Kanan: Tugas & Tanggung Jawab */}
          <div className="w-full md:w-1/2 bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Info size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Tugas & Tanggung Jawab</h3>
            </div>
            <ul className="space-y-4">
              {divisionInfo.tasks.map((task, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <CheckCircle2 size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600 text-sm leading-relaxed">{task}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* --- SECTION 2: ANGGOTA DIVISI --- */}
        <div className="border-t border-slate-200 pt-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-datasea-blue">Struktur Anggota</h3>
            <p className="text-slate-500">Kekuatan utama di balik {divisionInfo.name}</p>
          </div>

          {members.length > 0 ? (
            <div className="space-y-12">
              
              {/* Leader (Jika ada) - Ditengah */}
              {leaders.length > 0 && (
                <div className="flex justify-center flex-wrap gap-8">
                  {leaders.map((leader) => (
                    <div key={leader.id} className="w-full max-w-[280px]">
                        <TeamCard data={leader} />
                    </div>
                  ))}
                </div>
              )}

              {/* Staffs - UPDATE: Menggunakan Flex Wrap + Justify Center agar selalu ditengah */}
              {staffs.length > 0 && (
                <>
                  <div className="text-center mb-8">
                     <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">
                        Koordinator & Staff
                     </h3>
                  </div>

                  {/* PERBAIKAN DI SINI: Ubah dari Grid ke Flex Wrap Center */}
                  <div className="flex flex-wrap justify-center gap-6">
                    {staffs.map((staff) => (
                      // Kita set width fix agar rapi, misal w-[200px] atau pakai basis
                      <div key={staff.id} className="w-[calc(50%-12px)] md:w-[calc(25%-18px)] lg:w-[calc(20%-20px)] min-w-[160px]">
                        <TeamCard data={staff} />
                      </div>
                    ))}
                  </div>
                </>
              )}
              
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <UserCircle size={48} className="mx-auto text-slate-300 mb-2"/>
              <p className="text-slate-500">Data anggota {divisionInfo.name} belum tersedia di database.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

// --- KOMPONEN KECIL: Team Card (Updated for Better UI) ---
function TeamCard({ data }: { data: any }) {
  // Cek apakah jabatan mengandung kata-kata pemimpin
  const isLeader = 
    data.jabatan.toLowerCase().includes("ketua") || 
    data.jabatan.toLowerCase().includes("koordinator") || 
    data.jabatan.toLowerCase().includes("kepala");

  // Helper untuk warna badge divisi
  const getBadgeColor = (divisi: string) => {
    switch (divisi) {
      case "BPH": return "bg-slate-800 text-white border-slate-800";
      case "Divisi IT": return "bg-cyan-50 text-cyan-700 border-cyan-100";
      case "PSDM": return "bg-blue-50 text-blue-700 border-blue-100";
      case "HUMAS": return "bg-purple-50 text-purple-700 border-purple-100";
      case "EKRAF": return "bg-green-50 text-green-700 border-green-100";
      case "SATIR": return "bg-pink-50 text-pink-700 border-pink-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  return (
    <div className="group flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all h-full w-full">
      
      {/* Foto Profil */}
      <div className={`relative rounded-[25%] overflow-hidden mb-4 bg-slate-50 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${isLeader ? 'w-28 h-28 border-4 border-blue-50 shadow-sm' : 'w-24 h-24 border-2 border-slate-100'}`}>
        {data.foto_url ? (
           <img src={data.foto_url} alt={data.nama} className="w-full h-full object-cover" />
        ) : (
           <UserCircle size={isLeader ? 64 : 40} className={isLeader ? "text-blue-300" : "text-slate-300"} />
        )}
      </div>
      
      {/* Info Nama (Min-height agar sejajar jika nama panjang) */}
      <h3 className="font-bold text-slate-900 text-sm md:text-base group-hover:text-datasea-blue transition-colors line-clamp-2 min-h-[40px] flex items-center justify-center">
        {data.nama}
      </h3>
      
      {/* Jabatan (Uppercase & Kecil) */}
      <p className={`text-[10px] md:text-xs font-bold uppercase tracking-wider mt-1 mb-3 ${isLeader ? "text-blue-600" : "text-slate-500"}`}>
        {data.jabatan}
      </p>

      {/* Label Divisi (Konsisten Pill Shape) */}
      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border mt-auto ${getBadgeColor(data.divisi)}`}>
        {data.divisi}
      </span>

    </div>
  );
}