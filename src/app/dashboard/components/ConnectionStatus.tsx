'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function ConnectionStatus() {
  const { error, clearError, refreshUserData } = useAuth();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (error) {
      setShowNotification(true);
      // Auto-ocultar después de 10 segundos
      const timer = setTimeout(() => {
        setShowNotification(false);
        clearError();
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (!showNotification || !error) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse mt-2"></div>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-yellow-800">
              Problema de conexión
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Algunos datos pueden no estar actualizados
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex space-x-2">
            <button
              onClick={async () => {
                await refreshUserData();
                setShowNotification(false);
                clearError();
              }}
              className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded transition-colors"
            >
              Reintentar
            </button>
            <button
              onClick={() => {
                setShowNotification(false);
                clearError();
              }}
              className="text-yellow-400 hover:text-yellow-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
