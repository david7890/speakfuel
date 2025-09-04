'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SessionInfo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClient();
  
  // Solo mostrar en desarrollo
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();
  }, [supabase]);

  // No mostrar nada en producción o si no hay sesión
  if (!isDevelopment || !isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-green-900">
          Sesión Activa
        </span>
      </div>
      <div className="mt-1 text-xs text-green-700">
        🔒 Tu sesión permanecerá activa durante tu uso de la aplicación
      </div>
    </div>
  );
} 