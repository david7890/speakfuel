'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SessionInfo() {
  const [sessionInfo, setSessionInfo] = useState<{
    expiresAt: Date | null;
    timeUntilExpiry: string;
  }>({
    expiresAt: null,
    timeUntilExpiry: ''
  });

  const supabase = createClient();
  
  // Solo mostrar en desarrollo
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    const updateSessionInfo = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const expiresAt = new Date(session.expires_at! * 1000);
        const now = new Date();
        const diffMs = expiresAt.getTime() - now.getTime();
        
        let timeUntilExpiry = '';
        if (diffMs > 0) {
          const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          
          if (days > 0) {
            timeUntilExpiry = `${days}d ${hours}h`;
          } else if (hours > 0) {
            timeUntilExpiry = `${hours}h ${minutes}m`;
          } else {
            timeUntilExpiry = `${minutes}m`;
          }
        } else {
          timeUntilExpiry = 'Expirado';
        }
        
        setSessionInfo({
          expiresAt,
          timeUntilExpiry
        });
      }
    };

    updateSessionInfo();
    
    // Actualizar cada minuto
    const interval = setInterval(updateSessionInfo, 60 * 1000);
    
    return () => clearInterval(interval);
  }, [supabase]);

  if (!isDevelopment || !sessionInfo.expiresAt) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-blue-900">
            Sesión Activa
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            30 días
          </span>
        </div>
        <div className="text-sm text-blue-700">
          Expira en: <span className="font-medium">{sessionInfo.timeUntilExpiry}</span>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-blue-600">
        🔒 Tu sesión se mantendrá activa hasta 30 días sin necesidad de volver a autenticarte
      </div>
    </div>
  );
} 