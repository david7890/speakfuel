'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import DashboardNav from './components/DashboardNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  
  // Hide DashboardNav on lesson pages
  const isLessonPage = pathname.includes('/lesson/');
  
  // Extraer solo la parte antes del @ si es un email
  const getDisplayName = (name: string) => {
    if (name?.includes('@')) {
      return name.split('@')[0];
    }
    return name || 'Usuario';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {!isLessonPage && (
        <DashboardNav 
          userName={profile?.name ? getDisplayName(profile.name) : 'Usuario'}
          currentStreak={profile?.current_streak || 0}
          onSignOut={signOut}
        />
      )}
      <main className={isLessonPage ? '' : 'pt-16'}>
        {children}
      </main>
    </div>
  );
} 