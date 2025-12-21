import { NextResponse } from "next/server";
import { sendMessage } from "@/lib/firestoreService";

// Secret Key Turnstile (Pastikan ada di .env.local)
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Ambil data termasuk 'phone'
    const { name, phone, instansi, email, message, token } = body;

    // 2. Validasi Data Wajib
    if (!name || !instansi || !email || !message || !token || !phone) {
      return NextResponse.json(
        { error: "Mohon lengkapi semua bidang yang wajib diisi." },
        { status: 400 }
      );
    }

    // 3. Verifikasi Turnstile ke Server Cloudflare
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: TURNSTILE_SECRET_KEY,
          response: token,
        }),
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return NextResponse.json(
        { error: "Verifikasi keamanan gagal. Silakan coba lagi." },
        { status: 400 }
      );
    }

    // 4. Simpan ke Firestore menggunakan Service
    const result = await sendMessage({ 
      name, 
      phone, 
      instansi, 
      email, 
      message 
    });

    // --- PERBAIKAN DI SINI (Menggunakan 'as any' untuk atasi error TypeScript) ---
    if (result.success) {
      // Kita paksa TypeScript percaya bahwa 'id' itu ada
      return NextResponse.json({ success: true, id: (result as any).id });
    } else {
      // Kita paksa TypeScript percaya bahwa 'error' itu ada
      console.error("Firestore Error:", (result as any).error);
      return NextResponse.json(
        { error: "Gagal menyimpan pesan ke database." },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}