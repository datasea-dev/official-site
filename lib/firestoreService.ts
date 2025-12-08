import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";

// ==========================================
// 1. TIPE DATA (INTERFACES)
// ==========================================

export interface AcaraData {
  id: string;
  nama_acara: string;
  deskripsi_acara: string;
  tanggal_acara: string;
  waktu_acara: string;
  lokasi: string;
  penyelenggara: string;
  link_pendaftaran: string;
  poster_url: string;
  status_acara: "Segera" | "Berlangsung" | "Selesai" | "Akan Datang";
}

export interface ProgramKerjaData {
  id: string;
  nama_proker: string;
  deskripsi: string;
  divisi: string;
  status: "Terlaksana" | "Berjalan" | "Rencana";
  kategori: "Besar" | "Divisi"; // Kita butuh ini untuk logic di frontend admin
}

export interface TimData {
  id: string;
  nama: string;
  jabatan: string;
  divisi: string;
  foto_url: string;
  linkedin_url?: string;
  instagram_url?: string;
}

export interface VisiMisiData {
  id: string;
  visi: string;
  misi: string[];
  quote_ketua?: string;
}

export interface MessageData {
  id: string;
  name: string;
  instansi: string;
  email: string;
  message: string;
  createdAt: any;
  status: "Baru" | "Dibaca" | "Selesai";
}

// ==========================================
// 2. LAYANAN: ACARA
// ==========================================
export const getAcaraData = async (): Promise<AcaraData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "acara"));
    const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AcaraData[];
    return list.sort((a, b) => new Date(a.tanggal_acara).getTime() - new Date(b.tanggal_acara).getTime());
  } catch (error) { console.error(error); return []; }
};

export const addAcara = async (data: any) => addDoc(collection(db, "acara"), data).then(res => ({ success: true, id: res.id })).catch(err => ({ success: false, error: err }));
export const updateAcara = async (id: string, data: any) => updateDoc(doc(db, "acara", id), data).then(() => true).catch(() => false);
export const deleteAcara = async (id: string) => deleteDoc(doc(db, "acara", id)).then(() => true).catch(() => false);

// ==========================================
// 3. LAYANAN: PROGRAM KERJA (UPDATED: proker_besar & proker_divisi)
// ==========================================

// Helper: Tentukan nama koleksi berdasarkan kategori
const getProkerCollection = (kategori: "Besar" | "Divisi") => kategori === "Besar" ? "proker_besar" : "proker_divisi";

// KHUSUS PUBLIC (Mengambil dari DUA koleksi terpisah)
export const getProgramKerjaData = async () => {
  try {
    const besarSnap = await getDocs(collection(db, "proker_besar"));
    const divisiSnap = await getDocs(collection(db, "proker_divisi"));

    const prokerBesar = besarSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), kategori: "Besar" })) as ProgramKerjaData[];
    const prokerDivisi = divisiSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), kategori: "Divisi" })) as ProgramKerjaData[];

    return { prokerBesar, prokerDivisi };
  } catch (error) {
    console.error("Error fetching proker:", error);
    return { prokerBesar: [], prokerDivisi: [] };
  }
};

// KHUSUS ADMIN (Gabung semua untuk ditampilkan di tabel/grid)
export const getAllProkers = async (): Promise<ProgramKerjaData[]> => {
  try {
    const { prokerBesar, prokerDivisi } = await getProgramKerjaData();
    return [...prokerBesar, ...prokerDivisi];
  } catch (error) { return []; }
};

// CRUD PROKER (Harus cek kategori untuk tahu masuk koleksi mana)
export const addProker = async (data: Omit<ProgramKerjaData, 'id'>) => {
  try {
    const collName = getProkerCollection(data.kategori);
    const docRef = await addDoc(collection(db, collName), data);
    return { success: true, id: docRef.id };
  } catch (error) { return { success: false, error }; }
};

export const updateProker = async (id: string, data: Partial<ProgramKerjaData>, oldKategori: "Besar" | "Divisi") => {
  try {
    // Cek jika kategori berubah, kita harus pindahkan dokumen (Delete -> Add)
    // Tapi untuk simplifikasi, kita update di koleksi aslinya dulu.
    // NOTE: Agar aman, parameter 'oldKategori' wajib dikirim dari frontend.
    const collName = getProkerCollection(oldKategori); 
    
    // Jika kategori berubah, ini jadi rumit (Pindah Koleksi). 
    // Solusi cepat: Hapus lama, buat baru.
    if (data.kategori && data.kategori !== oldKategori) {
       await deleteDoc(doc(db, collName, id));
       await addDoc(collection(db, getProkerCollection(data.kategori)), data);
       return true;
    }

    await updateDoc(doc(db, collName, id), data);
    return true;
  } catch (error) { return false; }
};

export const deleteProker = async (id: string, kategori: "Besar" | "Divisi") => {
  try {
    const collName = getProkerCollection(kategori);
    await deleteDoc(doc(db, collName, id));
    return true;
  } catch (error) { return false; }
};

// ==========================================
// 4. LAYANAN: TIM (UPDATED: tim_datasea)
// ==========================================

export const getTimData = async (): Promise<TimData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "tim_datasea")); // NAMA KOLEKSI BARU
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TimData[];
  } catch (error) { return []; }
};

export const addTim = async (data: any) => addDoc(collection(db, "tim_datasea"), data).then(res => ({ success: true, id: res.id })).catch(err => ({ success: false, error: err }));
export const updateTim = async (id: string, data: any) => updateDoc(doc(db, "tim_datasea", id), data).then(() => true).catch(() => false);
export const deleteTim = async (id: string) => deleteDoc(doc(db, "tim_datasea", id)).then(() => true).catch(() => false);

// Visi Misi
export const getVisiMisiData = async (): Promise<VisiMisiData | null> => {
  try {
    const querySnapshot = await getDocs(collection(db, "visi_misi"));
    if (!querySnapshot.empty) return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as VisiMisiData;
    return null;
  } catch (error) { return null; }
};

// ==========================================
// 5. LAYANAN: PESAN (messages) - Tetap
// ==========================================
export const sendMessage = async (data: any) => addDoc(collection(db, "messages"), { ...data, status: "Baru", createdAt: serverTimestamp() }).then(res => ({ success: true, id: res.id }));
export const getMessages = async (): Promise<MessageData[]> => {
  try {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => {
        const d = doc.data();
        return { id: doc.id, ...d, createdAt: d.createdAt?.toDate().toISOString() || new Date().toISOString() } as MessageData;
    });
  } catch (e) { return []; }
};
export const updateMessageStatus = async (id: string, status: any) => updateDoc(doc(db, "messages", id), { status }).then(() => true).catch(() => false);
export const deleteMessage = async (id: string) => deleteDoc(doc(db, "messages", id)).then(() => true).catch(() => false);