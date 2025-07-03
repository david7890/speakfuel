'use client';

import { useEffect, useState } from 'react';
import { FireIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface StreakToastProps {
  newStreak: number | null;
  onClose: () => void;
}

export default function StreakToast({ newStreak, onClose }: StreakToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (newStreak && newStreak > 0) {
      setIsVisible(true);
      
      // Auto-cerrar después de 4 segundos
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Dar tiempo para la animación de salida
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [newStreak, onClose]);

  if (!newStreak || newStreak <= 0) return null;

  return (
    <div className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 sm:top-20 sm:right-4 sm:left-auto sm:w-auto ${
      isVisible ? 'translate-y-0 opacity-100 sm:translate-y-0 sm:translate-x-0' : '-translate-y-full opacity-0 sm:translate-y-0 sm:translate-x-full'
    }`}>
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-2xl p-3 w-full border border-orange-400 sm:rounded-xl sm:p-4 sm:max-w-sm sm:w-auto">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse sm:w-10 sm:h-10">
                <FireIcon className="w-4 h-4 text-white sm:w-5 sm:h-5" />
              </div>
            </div>
            
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-sm sm:text-sm">
                {newStreak === 1 ? '¡Racha Iniciada!' : '¡Racha Actualizada!'}
              </h4>
              <p className="text-xs text-orange-100 mt-0.5 sm:mt-1">
                {newStreak === 1 ? (
                  <span className="block sm:inline">Comenzaste tu racha 🚀</span>
                ) : (
                  <>
                    <span className="font-medium">{newStreak} días consecutivos</span>
                    <span className="block sm:inline sm:ml-1">¡Sigue así! 💪</span>
                  </>
                )}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-white/80 hover:text-white transition-colors p-0.5 sm:p-1 ml-2 flex-shrink-0"
          >
            <XMarkIcon className="w-4 h-4 sm:w-4 sm:h-4" />
          </button>
        </div>
        
        {/* Progress bar animation */}
        <div className="mt-2 w-full bg-white/20 rounded-full h-1 sm:mt-3">
          <div 
            className="bg-white rounded-full h-1 transition-all duration-4000 ease-linear"
            style={{
              width: isVisible ? '0%' : '100%',
              transition: isVisible ? 'width 4s linear' : 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
} 