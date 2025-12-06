import { db } from "./firebase";
// PERBAIKAN: Menambahkan 'doc' dan 'getDoc' ke dalam import
import { collection, getDocs, query, orderBy, DocumentData, Query, doc, getDoc } from "firebase/firestore";

// =========================================
// 1. DEFINISI TIPE DATA (INTERFACES)
// =========================================

export interface ProkerBesar {
  id: string;
  nama_proker: string;
  deskripsi: string;
  tag: string;
  color: string;
}

export interface ProkerDivisi {
  id: string;
  divisi: string;
  proker: string;
  deskripsi: string;
}

export interface Acara {
  id: string;
  nama_acara: string;
  deskripsi_acara: string;
  tanggal_acara: string;
  waktu_acara: string;
  penyelenggara: string;
  lokasi: string;
  // Tipe data disesuaikan dengan filter di frontend
  status_acara: "Segera" | "Berlangsung" | "Selesai"; 
  tautan_pendaftaran?: string;
}

export interface AnggotaTim {
  id: string;
  nama: string;
  jabatan: string;
  divisi: string;
  foto_url?: string;
  urutan?: number;
}

export interface VisiMisiData {
  visi: string;
  misi: string[];
  quote_ketua?: string;
}

// =========================================
// 2. HELPER FUNCTION (Fungsi Bantu)
// =========================================

async function fetchCollection<T>(collectionName: string, customQuery?: Query<DocumentData>): Promise<T[]> {
  try {
    const ref = collection(db, collectionName);
    const q = customQuery || ref; 
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error);
    return [];
  }
}

// =========================================
// 3. MAIN SERVICE FUNCTIONS
// =========================================

// --- A. Fetch Program Kerja ---
export async function getProgramKerjaData() {
  try {
    const [prokerBesar, prokerDivisi] = await Promise.all([
      fetchCollection<ProkerBesar>("proker_besar"),
      
      fetchCollection<ProkerDivisi>(
        "proker_divisi", 
        query(collection(db, "proker_divisi"), orderBy("divisi"))
      )
    ]);

    return { prokerBesar, prokerDivisi };

  } catch (error) {
    console.error("Error fetching Program Kerja data:", error);
    return { prokerBesar: [], prokerDivisi: [] };
  }
}

// --- B. Fetch Acara ---
export async function getAcaraData() {
  return await fetchCollection<Acara>("acara");
}

// --- C. Fetch Tim Datasea (Untuk Halaman About) ---
export async function getTimData() {
  return await fetchCollection<AnggotaTim>(
    "tim_datasea", 
    query(collection(db, "tim_datasea"), orderBy("urutan", "asc"))
  );
}

// --- D. Fetch Visi Misi ---
// --- D. Fetch Visi Misi (UPDATED: Ambil Dokumen Pertama) ---
export async function getVisiMisiData() {
  try {
    // Ambil koleksi visi_misi
    const colRef = collection(db, "visi_misi");
    const snapshot = await getDocs(colRef);

    if (!snapshot.empty) {
      // Ambil data dari dokumen pertama yang ditemukan
      return snapshot.docs[0].data() as VisiMisiData;
    } else {
      console.log("Belum ada data visi misi!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching Visi Misi:", error);
    return null;
  }
}