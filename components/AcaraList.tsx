"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, Clock, MapPin, Video, ArrowRight, Search, Filter, 
  ChevronDown, Check, ChevronLeft, ChevronRight 
} from "lucide-react";

interface Acara {
  id: string;
  nama_acara: string;
  deskripsi_acara: string;
  tanggal_acara: string;
  waktu_acara: string;
  penyelenggara: string;
  lokasi: string;
  status_acara: string; 
  tautan_pendaftaran?: string;
}

const ITEMS_PER_PAGE = 5; 

export default function AcaraList({ initialData }: { initialData: Acara[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // UPDATE 1: Ganti "Akan Datang" jadi "Segera"
  const statusOptions = ["Semua", "Segera", "Berlangsung", "Selesai"];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const filteredEvents = initialData.filter((item) => {
    const matchSearch = 
      item.nama_acara.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deskripsi_acara.toLowerCase().includes(searchTerm.toLowerCase());

    // UPDATE 2: Penyesuaian logika filter
    // Jika filter "Segera", kita cari yang statusnya "Segera" ATAU "Akan Datang" (untuk kompatibilitas data lama)
    let matchStatus = true;
    if (filterStatus !== "Semua") {
        if (filterStatus === "Segera") {
            matchStatus = item.status_acara === "Segera" || item.status_acara === "Akan Datang";
        } else {
            matchStatus = item.status_acara === filterStatus;
        }
    }

    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      const listElement = document.getElementById('event-list-top');
      if(listElement) listElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectStatus = (status: string) => {
    setFilterStatus(status);
    setIsDropdownOpen(false);
  };

  return (
    <section id="event-list-top" className="relative z-10 py-12 px-6 max-w-7xl mx-auto w-full scroll-mt-24">
      
      {/* --- FILTER & SEARCH BAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari acara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 placeholder:text-slate-400"
          />
        </div>

        {/* --- FILTER UI WRAPPER --- */}
        <div className="w-full md:w-auto relative">
            
            {/* MOBILE VIEW: CUSTOM DROPDOWN */}
            <div className="md:hidden w-full relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-slate-400"/>
                  <span>Status: <span className="text-blue-600 font-bold">{filterStatus}</span></span>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-1">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleSelectStatus(status)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-colors ${
                          filterStatus === status 
                            ? "bg-blue-50 text-blue-700 font-semibold" 
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {status}
                        {filterStatus === status && <Check size={16} className="text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* DESKTOP VIEW: BUTTONS */}
            <div className="hidden md:flex gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    filterStatus === status 
                      ? "bg-blue-600 text-white shadow-md" 
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

        </div>
      </div>

      {/* --- EVENT GRID --- */}
      {paginatedEvents.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedEvents.map((item) => (
              <EventCard key={item.id} data={item} />
            ))}
          </div>

          {/* --- PAGINATION CONTROLS --- */}
          <div className="flex justify-center items-center gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium text-slate-600">
              Halaman <span className="text-blue-600 font-bold">{currentPage}</span> dari {totalPages || 1}
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full text-slate-300 mb-4 shadow-sm">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-600">Tidak ada acara ditemukan</h3>
          <p className="text-sm text-slate-400 mt-1">Coba ubah kata kunci atau filter status.</p>
          <button 
            onClick={() => { setSearchTerm(""); setFilterStatus("Semua"); }}
            className="mt-4 text-blue-600 text-sm font-semibold hover:underline"
          >
            Reset Pencarian
          </button>
        </div>
      )}

    </section>
  );
}

// --- COMPONENT KARTU ACARA ---
function EventCard({ data }: { data: Acara }) {
    const getStatusColor = (status: string) => {
        switch(status) {
            case "Segera": return "bg-orange-500"; // UPDATE: Case Segera
            case "Akan Datang": return "bg-orange-500"; // Kompatibilitas data lama
            case "Berlangsung": return "bg-green-500 animate-pulse";
            case "Selesai": return "bg-slate-500";
            default: return "bg-blue-500";
        }
    };

    // Helper untuk menampilkan label status di badge agar konsisten
    const displayStatus = (status: string) => {
        if (status === "Akan Datang") return "Segera";
        return status;
    }

    return (
      <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
        
        {/* Banner */}
        <div className="h-48 w-full relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-[10px] font-bold text-white shadow-sm ${getStatusColor(data.status_acara)}`}>
            {displayStatus(data.status_acara)}
          </div>
  
          <Calendar size={64} className="text-white/10 transform group-hover:scale-110 transition-transform duration-500" />
        </div>
  
        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-4 text-xs text-slate-500 mb-3 font-medium">
            <div className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-600"/> {data.tanggal_acara}</div>
            <div className="flex items-center gap-1.5"><Clock size={14} className="text-blue-600"/> {data.waktu_acara}</div>
          </div>
  
          <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
            {data.nama_acara}
          </h3>
  
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <MapPin size={16} className="text-slate-400"/> {data.lokasi}
          </div>
  
          <p className="text-sm text-slate-600 line-clamp-2 mb-6 flex-grow leading-relaxed">
            {data.deskripsi_acara}
          </p>
  
          {data.status_acara !== "Selesai" && data.tautan_pendaftaran ? (
            <a href={data.tautan_pendaftaran} target="_blank" className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all text-center flex items-center justify-center gap-2 shadow-md">
              Daftar Sekarang <ArrowRight size={16}/>
            </a>
          ) : (
            <button disabled className="w-full py-3 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm cursor-not-allowed border border-slate-200">
              {/* UPDATE: Ganti "Info Menyusul" jadi "Segera" jika statusnya bukan Selesai */}
              {data.status_acara === "Selesai" ? "Event Selesai" : "Segera"}
            </button>
          )}
        </div>
      </div>
    );
  }