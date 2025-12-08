"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, Clock, MapPin, ArrowRight, Search, Filter, 
  ChevronDown, Check, ChevronLeft, ChevronRight, Inbox 
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
  poster_url?: string;
  link_pendaftaran?: string;
}

const ITEMS_PER_PAGE = 6; 

export default function AcaraList({ initialData }: { initialData: Acara[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const statusOptions = ["Semua", "Segera", "Berlangsung", "Selesai"];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const filteredEvents = initialData.filter((item) => {
    const matchSearch = 
      item.nama_acara.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deskripsi_acara.toLowerCase().includes(searchTerm.toLowerCase());

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

  const sortedEvents = filteredEvents.sort((a, b) => {
     const statusOrder: any = { "Berlangsung": 1, "Segera": 2, "Akan Datang": 3, "Selesai": 4 };
     return (statusOrder[a.status_acara] || 99) - (statusOrder[b.status_acara] || 99);
  });

  const totalPages = Math.ceil(sortedEvents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = sortedEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  // --- LOGIKA LAYOUT DINAMIS ---
  // Jika item kurang dari 3, gunakan Flex Center agar kartu di tengah dan tidak "melar".
  // Jika item banyak, gunakan Grid agar rapi berbaris.
  const isFewItems = paginatedEvents.length < 3;
  const containerClass = isFewItems 
    ? "flex flex-wrap justify-center gap-8 mb-12" 
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 justify-items-center";

  return (
    <section id="event-list-top" className="relative z-10 max-w-7xl mx-auto w-full scroll-mt-24">
      
      {/* --- FILTER & SEARCH BAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        
        {/* Search Input */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari topik acara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-700 placeholder:text-slate-400 bg-transparent"
          />
        </div>

        <div className="w-[1px] h-8 bg-slate-100 hidden md:block"></div>

        {/* --- FILTER UI --- */}
        <div className="w-full md:w-auto relative">
            
            {/* MOBILE DROPDOWN */}
            <div className="md:hidden w-full relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700"
              >
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-slate-400"/>
                  <span>Status: <span className="text-blue-600 font-bold">{filterStatus}</span></span>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                  <div className="p-1">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleSelectStatus(status)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg ${filterStatus === status ? "bg-blue-50 text-blue-700 font-bold" : "text-slate-600 hover:bg-slate-50"}`}
                      >
                        {status}
                        {filterStatus === status && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* DESKTOP BUTTONS */}
            <div className="hidden md:flex gap-1 p-1">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    filterStatus === status 
                      ? "bg-slate-900 text-white shadow-md" 
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

        </div>
      </div>

      {/* --- EVENT LIST --- */}
      {paginatedEvents.length > 0 ? (
        <>
          {/* Container Class Dinamis (Flex/Grid) */}
          <div className={containerClass}>
            {paginatedEvents.map((item) => (
              <EventCard key={item.id} data={item} />
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-8 border-t border-slate-100">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"><ChevronLeft size={20} /></button>
                <span className="text-sm font-medium text-slate-600">Halaman <span className="text-blue-600 font-bold">{currentPage}</span> dari {totalPages}</span>
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages} className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"><ChevronRight size={20} /></button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-slate-300">
            <Inbox size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-600">Tidak ada acara ditemukan</h3>
          <p className="text-sm text-slate-400 mt-1">Coba ubah kata kunci atau filter status.</p>
          <button onClick={() => { setSearchTerm(""); setFilterStatus("Semua"); }} className="mt-4 text-blue-600 text-sm font-bold hover:underline">Reset Filter</button>
        </div>
      )}

    </section>
  );
}

// --- COMPONENT KARTU ACARA ---
function EventCard({ data }: { data: Acara }) {
    const displayStatus = data.status_acara === "Akan Datang" ? "Segera" : data.status_acara;
    
    const badgeColor = 
        data.status_acara === "Selesai" ? "bg-slate-800 text-white" :
        data.status_acara === "Berlangsung" ? "bg-green-600 text-white animate-pulse" :
        "bg-blue-600 text-white";

    const link = data.tautan_pendaftaran || data.link_pendaftaran;

    return (
      // PERBAIKAN: max-w-[350px] agar lebih ramping (sesuai page Home)
      <div className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full w-full max-w-[350px] mx-auto">
        
        <div className="h-48 w-full relative overflow-hidden bg-slate-100">
          <div className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/20 backdrop-blur-md ${badgeColor}`}>
            {displayStatus}
          </div>

          {data.poster_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
                src={data.poster_url} 
                alt={data.nama_acara} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-500">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <Calendar size={48} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500"/>
                <span className="text-xs mt-2 font-medium">Poster Belum Tersedia</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
  
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 mb-4 font-medium">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100"><Calendar size={14} className="text-blue-500"/> {data.tanggal_acara}</div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100"><Clock size={14} className="text-orange-500"/> {data.waktu_acara}</div>
          </div>
  
          <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
            {data.nama_acara}
          </h3>
  
          <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-grow leading-relaxed">
            {data.deskripsi_acara}
          </p>
  
          <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
             <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate max-w-[50%]">
                <MapPin size={14} className="text-red-500 flex-shrink-0"/> 
                <span className="truncate">{data.lokasi}</span>
             </div>

             {data.status_acara !== "Selesai" && link ? (
                <a href={link} target="_blank" className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors group/btn">
                  Daftar <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform"/>
                </a>
             ) : (
                <span className="text-xs text-slate-400 font-medium italic">
                    {data.status_acara === "Selesai" ? "Event Selesai" : "Info Menyusul"}
                </span>
             )}
          </div>
        </div>
      </div>
    );
  }