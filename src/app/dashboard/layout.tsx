'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import DashboardNav from './components/DashboardNav';
import StreakToast from './components/StreakToast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const [toastStreak, setToastStreak] = useState<number | null>(null);
  
  // Escuchar por actualizaciones de racha desde localStorage
  useEffect(() => {
    const checkForStreakUpdate = () => {
      const streakUpdate = localStorage.getItem('streak_updated');
      if (streakUpdate) {
        const newStreak = parseInt(streakUpdate);
        setToastStreak(newStreak);
        localStorage.removeItem('streak_updated'); // Limpiar el flag
      }
    };

    // Revisar inmediatamente
    checkForStreakUpdate();
    
    // Revisar periódicamente por si nos perdimos el evento
    const interval = setInterval(checkForStreakUpdate, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Hide DashboardNav on lesson pages and frequent words page
  const isLessonPage = pathname.includes('/lesson/');
  const isPalabrasFrecuentesPage = pathname.includes('/palabras-frecuentes');
  
  // Extraer solo la parte antes del @ si es un email
  const getDisplayName = (name: string) => {
    if (name?.includes('@')) {
      return name.split('@')[0];
    }
    return name || 'Usuario';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {!isLessonPage && !isPalabrasFrecuentesPage && (
        <DashboardNav 
          userName={profile?.name ? getDisplayName(profile.name) : 'Usuario'}
          currentStreak={profile?.current_streak || 0}
          onSignOut={signOut}
        />
      )}
      <main className={isLessonPage || isPalabrasFrecuentesPage ? '' : 'pt-16'}>
        {children}
      </main>
      
      {/* Toast de racha */}
      <StreakToast 
        newStreak={toastStreak} 
        onClose={() => setToastStreak(null)} 
      />
    </div>
  );
} 