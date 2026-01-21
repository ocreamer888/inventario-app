'use client';

import { useState } from 'react';
import { Menu, X, LogOut, LayoutDashboard, FolderKanban, Package, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';

export default function AuthenticatedMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();

  const menuItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Proyectos', href: '/projects', icon: FolderKanban },
    { label: 'Inventario', href: '/inventory', icon: Package },
    { label: 'Perfil', href: '/profile', icon: User },
  ];

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
  };

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

      <header className="bg-blue-900 backdrop-blur-lg border-b border-blue-800/50 sticky top-4 mx-4 z-50 rounded-3xl">
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/RMT LOGO WHITE.svg" 
                  alt="RMT Soluciones" 
                  width={150} 
                  height={60}
                  className="h-auto"
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="relative text-white hover:text-orange-200 px-5 py-2 text-sm font-medium tracking-wide transition-all duration-300 group flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    <span className="absolute bottom-0 left-1/2 w-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent group-hover:w-full group-hover:left-0 transition-all duration-500 ease-out"></span>
                  </Link>
                );
              })}
              <button
                onClick={handleSignOut}
                className="ml-4 bg-red-600 text-white px-7 py-2.5 rounded-full text-sm font-medium tracking-wide hover:bg-red-700 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50 hover:scale-105 transform flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative inline-flex items-center justify-center p-2.5 rounded text-white hover:text-orange-200 transition-all duration-300 hover:bg-blue-800/50"
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
            <div className="px-2 pt-4 pb-6 space-y-1 border-t border-blue-800/50">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-lg text-base font-medium tracking-wide text-white hover:text-orange-200 hover:bg-blue-800/30 transition-all duration-300 transform ${
                      isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                    }`}
                    style={{
                      transitionDelay: isOpen ? `${index * 60 + 100}ms` : '0ms'
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={handleSignOut}
                className={`w-full mt-4 flex items-center justify-center gap-3 bg-red-600 text-white px-6 py-3.5 rounded-lg text-base font-medium tracking-wide hover:bg-red-700 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 transform ${
                  isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{
                  transitionDelay: isOpen ? `${menuItems.length * 60 + 100}ms` : '0ms'
                }}
              >
                <LogOut className="w-5 h-5" />
                Salir
              </button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
