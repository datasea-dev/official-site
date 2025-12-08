import { getAcaraData } from "@/lib/firestoreService";
import AcaraList from "@/components/AcaraList"; // Memanggil komponen Client di atas

// Force dynamic agar data selalu update saat halaman dibuka
export const dynamic = 'force-dynamic';

export default async function AcaraPage() {
  
  // 1. Ambil Data dari Firebase (Server Side)
  const allAcara = await getAcaraData();

  return (
    <main className="min-h-screen relative overflow-hidden pt-24 pb-16 px-6">
      
      {/* Header Halaman */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Agenda & Kegiatan
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Temukan berbagai workshop, seminar, dan kegiatan seru komunitas Datasea untuk meningkatkan skill digitalmu.
        </p>
      </div>

      {/* Memanggil Client Component (AcaraList).
          Di dalam komponen inilah fitur Search, Filter, Pagination, 
          dan Tampilan Kartu (Gambar) berada.
      */}
      <AcaraList initialData={allAcara} />

    </main>
  );
}