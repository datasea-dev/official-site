import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  where,
  getDoc
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
  kategori: "Besar" | "Divisi"; 
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
  phone: string; // <-- Tambah bidang nomor telepon
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
// 3. LAYANAN: PROGRAM KERJA
// ==========================================

const getProkerCollection = (kategori: "Besar" | "Divisi") => kategori === "Besar" ? "proker_besar" : "proker_divisi";

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

export const getAllProkers = async (): Promise<ProgramKerjaData[]> => {
  try {
    const { prokerBesar, prokerDivisi } = await getProgramKerjaData();
    return [...prokerBesar, ...prokerDivisi];
  } catch (error) { return []; }
};

export const addProker = async (data: Omit<ProgramKerjaData, 'id'>) => {
  try {
    const collName = getProkerCollection(data.kategori);
    const docRef = await addDoc(collection(db, collName), data);
    return { success: true, id: docRef.id };
  } catch (error) { return { success: false, error }; }
};

export const updateProker = async (id: string, data: Partial<ProgramKerjaData>, oldKategori: "Besar" | "Divisi") => {
  try {
    const collName = getProkerCollection(oldKategori); 
    
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
// 4. LAYANAN: TIM
// ==========================================

export const getTimData = async (): Promise<TimData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "tim_datasea")); 
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TimData[];
  } catch (error) { return []; }
};

export const addTim = async (data: any) => addDoc(collection(db, "tim_datasea"), data).then(res => ({ success: true, id: res.id })).catch(err => ({ success: false, error: err }));
export const updateTim = async (id: string, data: any) => updateDoc(doc(db, "tim_datasea", id), data).then(() => true).catch(() => false);
export const deleteTim = async (id: string) => deleteDoc(doc(db, "tim_datasea", id)).then(() => true).catch(() => false);

export const getVisiMisiData = async (): Promise<VisiMisiData | null> => {
  try {
    const querySnapshot = await getDocs(collection(db, "visi_misi"));
    if (!querySnapshot.empty) return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as VisiMisiData;
    return null;
  } catch (error) { return null; }
};

// ==========================================
// 5. LAYANAN: PESAN (Update: "pesan" collection with phone)
// ==========================================

export const sendMessage = async (data: any) => {
  return addDoc(collection(db, "pesan"), { 
    ...data, 
    status: "Baru", 
    createdAt: serverTimestamp() 
  })
  .then(res => ({ success: true, id: res.id }))
  .catch(err => ({ success: false, error: err }));
};

export const getMessages = async (): Promise<MessageData[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "pesan"));
    
    return querySnapshot.docs.map((doc) => {
        const d = doc.data();
        return {
            id: doc.id,
            // Fallback agar data lama tidak error
            name: d.name || "Tanpa Nama",
            phone: d.phone || "-", // <-- Map bidang phone
            instansi: d.instansi || "-",
            email: d.email || "-",
            message: d.message || "",
            status: d.status || "Baru",
            // Konversi Timestamp Firebase ke ISO String
            createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : d.createdAt || new Date().toISOString(),
        };
    }) as MessageData[];

  } catch (e) { 
    console.error("Gagal mengambil pesan:", e);
    return []; 
  }
};

export const updateMessageStatus = async (id: string, status: string) => {
  try {
      await updateDoc(doc(db, "pesan", id), { status });
      return true;
  } catch (e) {
      console.error("Gagal update status:", e);
      return false;
  }
};

export const deleteMessage = async (id: string) => {
  try {
      await deleteDoc(doc(db, "pesan", id));
      return true;
  } catch (e) {
      console.error("Gagal hapus pesan:", e);
      return false;
  }
};

// ==========================================
// 6. LAYANAN: VISI MISI (Update)
// ==========================================

// Fungsi update visi misi
export const updateVisiMisi = async (id: string, data: Partial<VisiMisiData>) => {
  try {
    // Kita gunakan updateDoc untuk mengubah data yang ada
    await updateDoc(doc(db, "visi_misi", id), data);
    return { success: true };
  } catch (error) {
    console.error("Gagal update visi misi:", error);
    return { success: false, error };
  }
};


// ... (kode sebelumnya biarkan saja)

// ==========================================
// 7. LAYANAN: RELAWAN (Volunteer & Applicants)
// ==========================================

export interface VolunteerPosition {
  id?: string;
  title: string;
  division: string; // BPH, IT, HUMAS, dll
  type: "Remote" | "On-Site" | "Hybrid";
  description: string;
  requirements: string[]; // Array of strings
  isOpen: boolean;
  createdAt?: any;
}

export interface ApplicantData {
  id?: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  whatsapp: string;
  linkedinUrl: string;
  reason: string; // Alasan singkat melamar
  submittedAt?: any;
}

// --- FUNGSI LOWONGAN KERJA ---

// Ambil semua lowongan (Untuk Admin)
export const getAllPositions = async () => {
  const q = query(collection(db, "volunteer_positions"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VolunteerPosition));
};

// Ambil lowongan yang AKTIF saja (Untuk Halaman Public)
export const getActivePositions = async () => {
  const q = query(
    collection(db, "volunteer_positions"), 
    where("isOpen", "==", true),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VolunteerPosition));
};

// Tambah Lowongan Baru
export const addPosition = async (data: VolunteerPosition) => {
  await addDoc(collection(db, "volunteer_positions"), {
    ...data,
    createdAt: serverTimestamp()
  });
};

// --- FUNGSI PELAMAR ---

// Kirim Lamaran (Submit Application)
export const submitApplication = async (data: ApplicantData) => {
  await addDoc(collection(db, "applicants"), {
    ...data,
    submittedAt: serverTimestamp()
  });
};

// Update Status Lowongan (Buka/Tutup)
export const togglePositionStatus = async (id: string, currentStatus: boolean) => {
  const docRef = doc(db, "volunteer_positions", id);
  await updateDoc(docRef, {
    isOpen: !currentStatus
  });
};

// Hapus Lowongan
export const deletePosition = async (id: string) => {
  const docRef = doc(db, "volunteer_positions", id);
  await deleteDoc(docRef);
};

export const getPositionById = async (id: string) => {
  const docRef = doc(db, "volunteer_positions", id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as VolunteerPosition;
  } else {
    return null;
  }
};