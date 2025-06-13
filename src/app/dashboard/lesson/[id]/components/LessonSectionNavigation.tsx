'use client';

import { useRouter, useParams } from 'next/navigation';
import { DocumentTextIcon, BookOpenIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface LessonSectionNavigationProps {
  currentSection: 'main' | 'vocabulary' | 'ministory' | 'questions';
  isTransitioning?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  showNavigation?: boolean;
  // Props específicos para vocabulario
  currentWordIndex?: number;
  totalWords?: number;
  words?: { word: string; }[];
  onWordSelect?: (index: number) => void;
  isLastWord?: boolean;
  onGoToPreviousSection?: () => void;
}

export default function LessonSectionNavigation({
  currentSection,
  isTransitioning = false,
  onNext,
  onPrevious,
  showNavigation = true,
  // Vocabulario props
  currentWordIndex,
  totalWords,
  words,
  onWordSelect,
  isLastWord,
  onGoToPreviousSection
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
      id: 'vocabulary',
      name: 'Vocabulary',
      icon: '📝',
      route: `/dashboard/lesson/${lessonId}/vocabulary`,
      description: 'Vocabulario'
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

  // Función para obtener el ícono de la sección actual
  const getSectionIcon = () => {
    switch (currentSection) {
      case 'main':
        return <DocumentTextIcon className="w-6 h-6 text-blue-600" />;
      case 'vocabulary':
        return null; // No mostrar ícono en vocabulario
      case 'ministory':
        return <BookOpenIcon className="w-6 h-6 text-purple-600" />;
      case 'questions':
        return <QuestionMarkCircleIcon className="w-6 h-6 text-green-600" />;
      default:
        return null;
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
    // En modo vocabulario, si estamos en la primera palabra, ir a la sección anterior
    if (currentSection === 'vocabulary' && currentWordIndex === 0 && onGoToPreviousSection) {
      onGoToPreviousSection();
    } else if (onPrevious) {
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

  // Si estamos en vocabulario y tenemos props de vocabulario, mostrar navegación de vocabulario
  const isVocabularyMode = currentSection === 'vocabulary' && currentWordIndex !== undefined && totalWords && words;
  


  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Progress Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out"
            style={{ 
              width: isVocabularyMode 
                ? `${((currentWordIndex + 1) / totalWords) * 100}%` 
                : `${progressPercentage}%` 
            }}
          />
        </div>

        {isVocabularyMode ? (
          // Navegación de vocabulario
          <>
            {/* Mobile Swipe Indicator */}
            <div className="sm:hidden text-center mb-2">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Desliza para navegar</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handlePrevious();
                }}
                disabled={currentWordIndex === 0 && !onGoToPreviousSection}
                className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 touch-manipulation ${
                  currentWordIndex === 0 && !onGoToPreviousSection
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : currentWordIndex === 0 && onGoToPreviousSection
                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 shadow-md hover:shadow-lg border border-blue-200 active:scale-95'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200 active:scale-95'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">
                  {currentWordIndex === 0 && onGoToPreviousSection ? 'Main Article' : 'Anterior'}
                </span>
              </button>

              {/* Word Navigation Dots - Responsive */}
              <div className="flex space-x-1 sm:space-x-2 max-w-xs sm:max-w-none overflow-x-auto scrollbar-hide">
                {words.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => onWordSelect?.(index)}
                    className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-300 touch-manipulation ${
                      index === currentWordIndex
                        ? 'bg-orange-500 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:scale-105 active:scale-95'
                    }`}
                    title={word.word}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Next/Continue Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNext();
                }}
                className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 touch-manipulation ${
                  isLastWord
                    ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl active:scale-95'
                    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl active:scale-95'
                }`}
              >
                <span className="hidden sm:inline">{isLastWord ? 'Continuar' : 'Siguiente'}</span>
                <span className="sm:hidden">{isLastWord ? '→' : '→'}</span>
                <svg className="w-5 h-5 ml-2 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Progress Bar - Mobile */}
            <div className="mt-3 sm:hidden">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentWordIndex + 1) / totalWords) * 100}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          // Navegación de secciones limpia (solo Previous y Next)
          <>
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

              {/* Current Section Icon */}
              {getSectionIcon() && (
                <div className="text-center">
                  {getSectionIcon()}
                </div>
              )}
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

                {/* Center Section Icon */}
                {getSectionIcon() && (
                  <div className="text-center">
                    {getSectionIcon()}
                  </div>
                )}

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={isTransitioning}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isTransitioning
                      ? 'opacity-50 cursor-not-allowed'
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
          </>
        )}
      </div>
    </div>
  );
} 