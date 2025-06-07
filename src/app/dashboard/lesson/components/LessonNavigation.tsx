interface LessonNavigationProps {
  currentSection: number;
  totalSections: number;
  sectionNames: string[];
  onNext: () => void;
  onPrevious: () => void;
  isLastSection: boolean;
}

export default function LessonNavigation({
  currentSection,
  totalSections,
  sectionNames,
  onNext,
  onPrevious,
  isLastSection
}: LessonNavigationProps) {
  const progressPercentage = ((currentSection + 1) / totalSections) * 100;

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="py-4">
          <div className="flex items-center justify-between">
            {/* Previous Button */}
            <button
              onClick={onPrevious}
              disabled={currentSection === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentSection === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Anterior</span>
            </button>

            {/* Section Indicators */}
            <div className="flex items-center space-x-2">
              {sectionNames.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index < currentSection
                      ? 'bg-green-500'
                      : index === currentSection
                      ? 'bg-blue-600 scale-125'
                      : 'bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>

            {/* Next/Finish Button */}
            <button
              onClick={onNext}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="font-medium">
                {isLastSection ? 'Finalizar Lección' : 'Siguiente'}
              </span>
              {!isLastSection && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              {isLastSection && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 