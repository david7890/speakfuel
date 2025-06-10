import React, { useState } from 'react';

interface VocabWord {
  word: string;
  pronunciation: string;
  definition: string;
  example: string;
  translation: string;
}

interface VocabularyNavigationProps {
  currentWordIndex: number;
  totalWords: number;
  words: VocabWord[];
  onNext: () => void;
  onPrevious: () => void;
  onWordSelect: (index: number) => void;
  isLastWord: boolean;
  onGoToPreviousSection?: () => void;
}

export default function VocabularyNavigation({
  currentWordIndex,
  totalWords,
  words,
  onNext,
  onPrevious,
  onWordSelect,
  isLastWord,
  onGoToPreviousSection
}: VocabularyNavigationProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Distancia mínima para considerar un swipe
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentWordIndex < totalWords - 1) {
      onNext();
    }
    if (isRightSwipe) {
      if (currentWordIndex > 0) {
        onPrevious();
      } else if (onGoToPreviousSection) {
        onGoToPreviousSection();
      }
    }
  };

  const handlePreviousClick = () => {
    if (currentWordIndex > 0) {
      onPrevious();
    } else if (onGoToPreviousSection) {
      onGoToPreviousSection();
    }
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
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
            onClick={handlePreviousClick}
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
                onClick={() => onWordSelect(index)}
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
            onClick={onNext}
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
      </div>
    </div>
  );
} 