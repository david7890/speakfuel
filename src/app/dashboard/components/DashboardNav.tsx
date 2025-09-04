'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FireIcon } from '@heroicons/react/24/solid';

interface DashboardNavProps {
  userName?: string;
  currentStreak?: number;
  onSignOut?: () => void;
}

export default function DashboardNav({ 
  userName = 'Usuario', 
  currentStreak = 0,
  onSignOut 
}: DashboardNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);
  const previousStreak = useRef(currentStreak);

  // Detectar cambios en la racha para mostrar animación
  useEffect(() => {
    if (currentStreak > previousStreak.current && currentStreak > 0) {
      setShowStreakAnimation(true);
      const timer = setTimeout(() => {
        setShowStreakAnimation(false);
      }, 3000); // Mostrar animación por 3 segundos
      
      return () => clearTimeout(timer);
    }
    previousStreak.current = currentStreak;
  }, [currentStreak]);
  
  // Obtener la primera letra del nombre del usuario
  const getUserInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

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
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all duration-500 ${
              showStreakAnimation 
                ? 'bg-gradient-to-r from-orange-100 to-red-100 shadow-lg scale-110 border-2 border-orange-300' 
                : 'bg-orange-50'
            }`}>
              <FireIcon className={`h-4 w-4 text-orange-600 ${showStreakAnimation ? 'animate-pulse' : ''}`} />
              <span className={`text-sm font-medium text-orange-700 ${showStreakAnimation ? 'font-bold' : ''}`}>
                {showStreakAnimation ? '🔥 ' : ''}{currentStreak} día{currentStreak !== 1 ? 's' : ''}
              </span>
              {showStreakAnimation && (
                <span className="text-xs text-orange-600 animate-bounce">+1</span>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium hover:shadow-lg transition-all duration-300"
              >
                {getUserInitial(userName)}
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
                     onClick={() => {
                       setIsMenuOpen(false);
                       onSignOut?.();
                     }}
                   >
                     Cerrar Sesión
                   </button>
                 </div>
               )}
            </div>
          </div>

          {/* Mobile streak and menu */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Streak Counter */}
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-all duration-500 ${
              showStreakAnimation 
                ? 'bg-gradient-to-r from-orange-100 to-red-100 shadow-md scale-105 border border-orange-300' 
                : 'bg-orange-50'
            }`}>
              <FireIcon className={`h-3 w-3 text-orange-500 ${showStreakAnimation ? 'animate-pulse' : ''}`} />
              <span className={`text-xs font-medium text-orange-700 ${showStreakAnimation ? 'font-bold' : ''}`}>
                {showStreakAnimation ? '🔥' : ''}{currentStreak}
              </span>
              {showStreakAnimation && (
                <span className="text-xs text-orange-600 animate-bounce">+1</span>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none p-1"
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
               <div className={`flex items-center space-x-2 px-2 py-1 rounded-lg transition-all duration-500 ${
                 showStreakAnimation ? 'bg-orange-100 border border-orange-300' : ''
               }`}>
                 <FireIcon className={`h-4 w-4 text-orange-500 ${showStreakAnimation ? 'animate-pulse' : ''}`} />
                 <span className={`text-sm font-medium text-orange-700 ${showStreakAnimation ? 'font-bold' : ''}`}>
                   Racha: {showStreakAnimation ? '🔥 ' : ''}{currentStreak} día{currentStreak !== 1 ? 's' : ''}
                   {showStreakAnimation && <span className="text-orange-600 animate-bounce ml-1">+1</span>}
                 </span>
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
                 onClick={() => {
                   setIsMenuOpen(false);
                   onSignOut?.();
                 }}
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