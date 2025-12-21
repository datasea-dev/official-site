"use client";

import { useState } from "react";

interface FlagshipCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag: string;
  color: string;
}

export default function FlagshipCard({ icon, title, desc, tag, color }: FlagshipCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Kita tetap butuh batas karakter HANYA untuk menentukan tombol muncul/tidak
  // Tapi pemotongan visualnya nanti pakai CSS line-clamp
  const CHARACTER_TRIGGER = 100; 
  const isLongText = desc.length > CHARACTER_TRIGGER;

  const colorStyles: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
    pink: "bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white",
    green: "bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white",
    cyan: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white",
  };

  return (
    <div className="group bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 text-left h-full flex flex-col relative">
      <div className="flex justify-between items-start mb-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 ${colorStyles[color] || colorStyles.blue}`}>
          {icon}
        </div>
        <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
          {tag}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      
      {/* WRAPPER DESKRIPSI:
         flex-grow: Mendorong tombol ke bawah agar sejajar
      */}
      <div className="flex-grow">
        <p className={`text-sm text-slate-500 leading-relaxed transition-all duration-300 ${
            // KUNCI PERUBAHAN DI SINI:
            // Jika tidak di-expand, gunakan 'line-clamp-3' (maksimal 3 baris)
            // Jika di-expand, hapus class line-clamp agar memanjang
            !isExpanded ? "line-clamp-3" : ""
        }`}>
            {desc || "Deskripsi program kerja belum ditambahkan."}
        </p>
      </div>
        
      {/* AREA TOMBOL (Fixed Height agar tidak lompat-lompat) */}
      <div className="mt-4 min-h-[24px]">
        {isLongText && (
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline focus:outline-none transition-colors flex items-center gap-1"
            >
                {isExpanded ? "Sembunyikan" : "Selengkapnya"} 
                <span className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>→</span>
            </button>
        )}
      </div>
    </div>
  );
}