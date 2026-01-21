import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-500 md:hidden ${
          isOpen ? 'opacity-40 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        style={{ zIndex: 40 }}
      />

      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50 mb-12">
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="#" className="text-2xl font-light tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 hover:from-amber-100 hover:via-yellow-200 hover:to-amber-100 transition-all duration-500">
              <Image src="/RMT LOGO WHITE.svg" alt="RMT Soluciones" width={200} height={200} />
              </a>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="relative text-slate-200 hover:text-amber-200 px-5 py-2 text-sm font-light tracking-wide transition-all duration-300 group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 w-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent group-hover:w-full group-hover:left-0 transition-all duration-500 ease-out"></span>
                </a>
              ))}
              <button className="ml-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-900 px-7 py-2.5 rounded text-sm font-medium tracking-wide hover:from-amber-500 hover:to-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/50 hover:scale-105 transform">
                Get Started
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative inline-flex items-center justify-center p-2.5 rounded text-slate-200 hover:text-amber-200 transition-all duration-300 hover:bg-slate-700/50"
                aria-expanded={isOpen}
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-6">
                  <Menu
                    className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
                      isOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                    }`}
                  />
                  <X
                    className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
                      isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
              isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-2 pt-4 pb-6 space-y-1 border-t border-slate-700/50">
              {menuItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`block px-5 py-3.5 rounded-lg text-base font-light tracking-wide text-slate-200 hover:text-amber-200 hover:bg-slate-700/30 transition-all duration-300 transform ${
                    isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  }`}
                  style={{
                    transitionDelay: isOpen ? `${index * 60 + 100}ms` : '0ms'
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <button 
                className={`w-full mt-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-900 px-6 py-3.5 rounded-lg text-base font-medium tracking-wide hover:from-amber-500 hover:to-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 transform ${
                  isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{
                  transitionDelay: isOpen ? `${menuItems.length * 60 + 100}ms` : '0ms'
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}