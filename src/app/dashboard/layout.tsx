'use client';

import { usePathname } from 'next/navigation';
import DashboardNav from './components/DashboardNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Hide DashboardNav on lesson pages
  const isLessonPage = pathname.includes('/lesson/');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {!isLessonPage && <DashboardNav />}
      <main className={isLessonPage ? '' : 'pt-16'}>
        {children}
      </main>
    </div>
  );
} 