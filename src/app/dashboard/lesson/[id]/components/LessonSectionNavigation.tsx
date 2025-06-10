'use client';

import { useRouter, useParams } from 'next/navigation';

interface LessonSectionNavigationProps {
  currentSection: 'main' | 'ministory' | 'questions';
  isTransitioning?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
}

export default function LessonSectionNavigation({
  currentSection,
  isTransitioning = false,
  onNext,
  onPrevious,
  showNavigation = true
}: LessonSectionNavigationProps) {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.id as string;

  const sections = [
    {
      id: 'main',
      name: 'Main Article',
      icon: '📖',
      route: `/dashboard/lesson/${lessonId}/main`,
      description: 'Artículo principal'
    },
    {
      id: 'ministory',
      name: 'Mini Story',
      icon: '📚',
      route: `/dashboard/lesson/${lessonId}/ministory`,
      description: 'Historia corta'
    },
    {
      id: 'questions',
      name: 'Questions',
      icon: '❓',
      route: `/dashboard/lesson/${lessonId}/questions`,
      description: 'Preguntas de comprensión'
    }
  ];

  const currentIndex = sections.findIndex(section => section.id === currentSection);
  const progressPercentage = ((currentIndex + 1) / sections.length) * 100;

  const handleSectionClick = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section && !isTransitioning) {
      router.push(section.route);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      const nextIndex = currentIndex + 1;
      if (nextIndex < sections.length) {
        router.push(sections[nextIndex].route);
      }
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else {
      const prevIndex = currentIndex - 1;
      if (prevIndex >= 0) {
        router.push(sections[prevIndex].route);
      } else {
        router.push('/dashboard');
      }
    }
  };

  if (!showNavigation) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Progress Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Mobile View */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-3">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={isTransitioning}
              className={`flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                isTransitioning
                  ? 'opacity-50 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 active:scale-95'
              }`}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">Anterior</span>
            </button>

            {/* Section Indicator */}
            <div className="flex items-center space-x-2">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  disabled={isTransitioning}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                    section.id === currentSection
                      ? 'bg-blue-600 text-white shadow-lg'
                      : index < currentIndex
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                  } ${isTransitioning ? 'pointer-events-none' : ''}`}
                  title={section.name}
                >
                  {index < currentIndex ? '✓' : index + 1}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={isTransitioning}
              className={`flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                isTransitioning
                  ? 'opacity-50 cursor-not-allowed'
                  : currentIndex === sections.length - 1
                  ? 'bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-lg'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-lg'
              }`}
            >
              <span className="text-sm mr-1">{currentIndex === sections.length - 1 ? 'Finalizar' : 'Siguiente'}</span>
              {currentIndex !== sections.length - 1 && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>

          {/* Current Section Info */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {sections[currentIndex]?.icon} {sections[currentIndex]?.description}
            </p>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block">
          <div className="flex items-center justify-between">
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={isTransitioning}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isTransitioning
                  ? 'opacity-50 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 active:scale-95'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Anterior</span>
            </button>

            {/* Section Navigation */}
            <div className="flex items-center space-x-4">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  disabled={isTransitioning}
                  className={`group relative flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
                    section.id === currentSection
                      ? 'bg-blue-600 text-white shadow-lg'
                      : index < currentIndex
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } ${isTransitioning ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{section.icon}</span>
                    <span className="text-sm font-medium">{section.name}</span>
                  </div>
                  
                  {/* Completion Check */}
                  {index < currentIndex && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}



                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {section.description}
                  </div>
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={isTransitioning}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                isTransitioning
                  ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500'
                  : currentIndex === sections.length - 1
                  ? 'bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-lg'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-lg'
              }`}
            >
              <span>{currentIndex === sections.length - 1 ? 'Finalizar' : 'Siguiente'}</span>
              {currentIndex !== sections.length - 1 && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 