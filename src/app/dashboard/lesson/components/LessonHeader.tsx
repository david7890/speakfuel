'use client';

import { useRouter, usePathname } from 'next/navigation';

interface LessonHeaderProps {
  title: string;
  currentSection: number;
  totalSections: number;
  sectionName: string;
  isVocabularyPage?: boolean;
}

export default function LessonHeader({ 
  title, 
  currentSection, 
  totalSections, 
  sectionName,
  isVocabularyPage: propIsVocabularyPage = false
}: LessonHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Detectar si estamos en la página de vocabulario (usar prop o detectar de URL)
  const isVocabularyPage = propIsVocabularyPage || pathname.includes('/vocabulary');

  return (
    <header className="hidden lg:block fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Back Button */}
          <div className="flex-shrink-0">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Volver</span>
            </button>
          </div>

          {/* Lesson Info - Centered */}
          <div className="flex-1 flex justify-center">
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900">
                {title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {isVocabularyPage ? sectionName : `${sectionName} • ${currentSection + 1} de ${totalSections}`}
              </p>
            </div>
          </div>
          
          {/* Right Spacer to balance the back button */}
          <div className="flex-shrink-0 w-20"></div>
        </div>
      </div>
    </header>
  );
} 