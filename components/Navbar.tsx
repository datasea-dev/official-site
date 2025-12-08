"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeMobileMenu = () => setIsOpen(false);

  // --- PERBAIKAN LOGIKA SCROLL ---
  // Fungsi ini mengecek: Jika di Home -> Scroll Halus. Jika BUKAN Home -> Pindah halaman biasa.
  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault(); // Cegah reload/jump kasar hanya jika di homepage
      const contactSection = document.getElementById('contact-form');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Jika user ada di halaman lain (misal /acara), biarkan Link bekerja normal 
    // mengarahkan ke "/#contact-form"
    closeMobileMenu();
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* --- LOGO SECTION --- */}
          <Link href="/" className="flex items-center gap-3 group" onClick={closeMobileMenu}>
            <div className="relative w-10 h-10 flex-shrink-0 rounded-xl overflow-hidden border border-slate-100 shadow-sm bg-white">
              <Image 
                src="/logo-datasea.png" 
                alt="Logo Datasea" 
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold text-datasea-blue tracking-tight group-hover:text-blue-700 transition-colors">
              DATASEA
            </span>
          </Link>

          {/* --- DESKTOP MENU --- */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/" active={pathname === "/"}>Beranda</NavLink>
            <NavLink href="/program_kerja" active={pathname === "/program_kerja"}>Program Kerja</NavLink>

            <div className="relative group">
              <Link 
                href="/d_center" 
                className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-datasea-blue transition-colors py-2"
              >
                D-Center
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </Link>
              
              <div className="absolute left-0 mt-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pt-2">
                <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden p-2">
                  <DropdownItem 
                    href="https://archive-datasea.vercel.app/" 
                    external 
                    title="Datasea Archive" 
                    desc="Bank materi & jurnal" 
                  />
                  <DropdownItem 
                    href="/d_center" 
                    title="Web Development" 
                    desc="Jasa pembuatan website" 
                  />
                  <DropdownItem 
                    href="/d_center" 
                    title="Gaming Services" 
                    desc="Joki & Top-up game" 
                  />
                </div>
              </div>
            </div>
            
            <NavLink href="/acara" active={pathname === "/acara"}>Acara</NavLink>
            <NavLink href="/tentang_kami" active={pathname === "/tentang_kami"}>Tentang Kami</NavLink>
          </div>

          {/* --- CTA BUTTON (PERBAIKAN DESKTOP) --- */}
          <div className="hidden md:flex">
            <Link
              href="/#contact-form" // Menggunakan /# agar bisa diakses dari halaman manapun
              onClick={handleContactClick}
              className="bg-datasea-blue hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Hubungi Kami
            </Link>
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-datasea-blue hover:text-blue-700 focus:outline-none"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 absolute w-full px-4 pt-2 pb-6 shadow-lg animate-in slide-in-from-top-5">
          <div className="flex flex-col space-y-3">
            <MobileNavLink href="/" onClick={closeMobileMenu}>Beranda</MobileNavLink>
            <MobileNavLink href="/program_kerja" onClick={closeMobileMenu}>Program Kerja</MobileNavLink>

            <div className="py-2 border-y border-slate-100 my-1">
              <p className="px-4 text-xs font-bold text-slate-400 uppercase mb-2">Layanan D-Center</p>
              <div className="pl-2">
                <MobileNavLink href="https://archive-datasea.vercel.app/" external onClick={closeMobileMenu}>Datasea Archive ↗</MobileNavLink>
                <MobileNavLink href="/d_center" onClick={closeMobileMenu}>Web Development</MobileNavLink>
                <MobileNavLink href="/d_center" onClick={closeMobileMenu}>Gaming Services</MobileNavLink>
              </div>
            </div>

            <MobileNavLink href="/acara" onClick={closeMobileMenu}>Acara</MobileNavLink>
            <MobileNavLink href="/tentang_kami" onClick={closeMobileMenu}>Tentang Kami</MobileNavLink>

            {/* --- CTA BUTTON (PERBAIKAN MOBILE) --- */}
            <Link
              href="/#contact-form"
              onClick={handleContactClick}
              className="mt-4 w-full block text-center bg-datasea-blue text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// SUB COMPONENTS
function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        active ? "text-datasea-blue font-bold" : "text-slate-600 hover:text-datasea-blue"
      }`}
    >
      {children}
    </Link>
  );
}

function DropdownItem({ href, title, desc, external }: { href: string; title: string; desc: string; external?: boolean }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : "_self"}
      className="block px-4 py-3 hover:bg-slate-50 transition-colors rounded-lg group/item"
    >
      <div className="text-sm font-semibold text-slate-800 group-hover/item:text-datasea-blue flex items-center gap-1">
        {title}
        {external && <span className="text-[10px] text-slate-400">↗</span>}
      </div>
      <div className="text-xs text-slate-500">{desc}</div>
    </Link>
  );
}

function MobileNavLink({ href, children, onClick, external }: { href: string; children: React.ReactNode; onClick: () => void; external?: boolean }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : "_self"}
      onClick={onClick}
      className="block px-4 py-2 text-base font-medium text-slate-600 hover:text-datasea-blue hover:bg-slate-50 rounded-md"
    >
      {children}
    </Link>
  );
}