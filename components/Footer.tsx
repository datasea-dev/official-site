import Link from "next/link";
import Image from "next/image";
// Menambahkan import 'Youtube'
import { Instagram, Linkedin, Github, Mail, MessageCircle, Wrench, ExternalLink, GraduationCap, Building2, HeartHandshake, Heart, Youtube } from "lucide-react";

// Komponen Custom TikTok
const TiktokIcon = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1e293b] text-white pt-12 pb-8 border-t border-slate-700/50 text-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* --- LAYOUT UTAMA --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12 items-start">
          
          {/* KOLOM 1: IDENTITAS */}
          <div className="space-y-4 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 bg-white rounded-xl overflow-hidden p-0.5 shadow-sm shadow-blue-500/20">
                <Image 
                  src="/logo-datasea.png" 
                  alt="Logo Datasea" 
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none tracking-tight text-white">DATASEA</span>
                <span className="text-[10px] text-blue-300 font-medium tracking-wide">OFFICIAL WEBSITE</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm pr-4 max-w-sm">
              Komunitas mahasiswa UTY sebagai wadah kolaborasi dan pengembangan talenta di bidang Sains Data.
            </p>
          </div>

          {/* KOLOM 2 & 3: NAVIGASI & D-CENTER */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2 lg:col-span-2">
            
            {/* SUB-KOLOM A: NAVIGASI & AKSES CEPAT */}
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4">NAVIGASI</h3>
                <ul className="space-y-3 text-slate-300">
                  <li><Link href="/" className="hover:text-white hover:translate-x-1 transition-all inline-block">Beranda</Link></li>
                  <li><Link href="/about" className="hover:text-white hover:translate-x-1 transition-all inline-block">Tentang Kami</Link></li>
                  <li><Link href="/program_kerja" className="hover:text-white hover:translate-x-1 transition-all inline-block">Program Kerja</Link></li>
                  <li><Link href="/acara" className="hover:text-white hover:translate-x-1 transition-all inline-block">Acara</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4">AKSES CEPAT</h3>
                <ul className="space-y-3 text-slate-300">
                  <li>
                    <a href="https://uty.ac.id" target="_blank" className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group">
                      <Building2 size={14} className="text-blue-500 group-hover:text-white transition-colors flex-shrink-0"/>
                      <span className="truncate">Univ. Teknologi Yogyakarta</span>
                    </a>
                  </li>
                  <li>
                    <a href="https://uty.ac.id/page/visi-misi-prodi-data-science" target="_blank" className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group">
                      <GraduationCap size={14} className="text-blue-500 group-hover:text-white transition-colors flex-shrink-0"/>
                      <span className="truncate">Prodi Sains Data</span>
                    </a>
                  </li>
                  <li>
                    <Link href="/relawan" className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group">
                      <HeartHandshake size={14} className="text-blue-500 group-hover:text-white transition-colors flex-shrink-0"/>
                      <span className="truncate">Relawan</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* SUB-KOLOM B: D-CENTER & SOSIAL MEDIA */}
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4">D-CENTER</h3>
                <ul className="space-y-3 text-slate-300">
                  <li>
                    <a href="https://archive.datasea.my.id/" target="_blank" className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group">
                      <ExternalLink size={14} className="text-blue-500 group-hover:text-white transition-colors flex-shrink-0"/>
                      Datasea Archive
                    </a>
                  </li>
                  <li>
                    <Link href="/d_center" className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group">
                      <ExternalLink size={14} className="text-blue-500 group-hover:text-white transition-colors flex-shrink-0"/>
                      Web Development
                    </Link>
                  </li>
                  <li>
                    <Link href="/d_center" className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group">
                      <ExternalLink size={14} className="text-blue-500 group-hover:text-white transition-colors flex-shrink-0"/>
                      Gaming Services
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="pt-7">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4">IKUTI KAMI</h3>
                <div className="flex flex-wrap gap-2">
                  <SocialLink href="https://instagram.com/datasea.uty" icon={<Instagram size={18} />} />
                  <SocialLink href="https://tiktok.com/@datasea" icon={<TiktokIcon size={18} />} />
                  {/* Penambahan YouTube */}
                  <SocialLink href="https://www.youtube.com/@KomunitasDataSEA" icon={<Youtube size={18} />} />
                  <SocialLink href="https://linkedin.com/company/datasea" icon={<Linkedin size={18} />} />
                  <SocialLink href="https://github.com/datasea-dev" icon={<Github size={18} />} />
                </div>
              </div>
            </div>

          </div>

          {/* KOLOM 4: PUSAT BANTUAN */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-4">HUBUNGI KAMI</h3>
            
            <div className="bg-[#0f172a]/50 border border-slate-700/50 rounded-xl p-4 backdrop-blur-sm flex flex-col gap-3">
              
              <a href="mailto:datasea.exp@gmail.com" className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-white/5 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors flex-shrink-0">
                  <Mail size={16} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide group-hover:text-slate-400">Email Resmi</span>
                  <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate">datasea.exp@gmail.com</span>
                </div>
              </a>

              <div className="h-px bg-slate-700/50 mx-1"></div>

              <a href="https://wa.me/6281234567890" target="_blank" className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-white/5 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors flex-shrink-0">
                  <MessageCircle size={16} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide group-hover:text-slate-400">Humas / Admin</span>
                  <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate">+62 812-3456-7890</span>
                </div>
              </a>

              <div className="h-px bg-slate-700/50 mx-1"></div>

              <a href="https://wa.me/6289876543210" target="_blank" className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-white/5 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors flex-shrink-0">
                  <Wrench size={16} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide group-hover:text-slate-400">IT Support (Bug)</span>
                  <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate">+62 898-7654-3210</span>
                </div>
              </a>

            </div>
          </div>

        </div>

        {/* --- COPYRIGHT --- */}
        <div className="border-t border-white/5 pt-8 flex flex-col items-center justify-center gap-2 text-xs text-center text-slate-500">
          <p>
            &copy; {currentYear} <span className="text-slate-300 font-medium">DATASEA Community</span>. All rights reserved.
          </p>
          <p className="flex items-center justify-center gap-1">
            Dibuat dengan <Heart size={12} className="text-red-500 fill-red-500" /> oleh <span className="text-slate-300 font-medium">DIVISI IT</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

// Helper untuk Icon Sosmed
function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 flex-shrink-0"
    >
      {icon}
    </a>
  );
}