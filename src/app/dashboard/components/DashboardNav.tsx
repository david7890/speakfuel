'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DashboardNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">SpeakFuel</span>
          </Link>

                     {/* Desktop Navigation - Simplified */}
           <div className="hidden md:flex items-center space-x-6">
             {/* Navigation simplified - no overwhelming links */}
           </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Streak Counter */}
            <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1 rounded-full">
              <span className="text-orange-500">🔥</span>
              <span className="text-sm font-medium text-orange-700">3 días</span>
            </div>

            {/* Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium hover:shadow-lg transition-all duration-300"
              >
                M
              </button>
              
                             {/* Dropdown Menu - Simplified */}
               {isMenuOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                   <Link
                     href="/"
                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                     onClick={() => setIsMenuOpen(false)}
                   >
                     Volver al Inicio
                   </Link>
                   <button
                     className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                     onClick={() => setIsMenuOpen(false)}
                   >
                     Cerrar Sesión
                   </button>
                 </div>
               )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

                 {/* Mobile Navigation - Simplified */}
         {isMenuOpen && (
           <div className="md:hidden py-4 border-t border-gray-100">
             <div className="flex flex-col space-y-4">
               <div className="flex items-center space-x-2">
                 <span className="text-orange-500">🔥</span>
                 <span className="text-sm font-medium text-orange-700">Racha: 3 días</span>
               </div>
               <Link
                 href="/"
                 className="text-gray-700 hover:text-blue-600 transition-colors"
                 onClick={() => setIsMenuOpen(false)}
               >
                 Volver al Inicio
               </Link>
               <button
                 className="text-left text-red-600 hover:text-red-700 transition-colors"
                 onClick={() => setIsMenuOpen(false)}
               >
                 Cerrar Sesión
               </button>
             </div>
           </div>
         )}
      </div>
    </nav>
  );
} 