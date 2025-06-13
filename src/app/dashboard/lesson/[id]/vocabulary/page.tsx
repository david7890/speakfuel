'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LessonHeader from '../../components/LessonHeader';
import VocabularyCard from '../components/VocabularyCard';
import LessonSectionNavigation from '../components/LessonSectionNavigation';

interface VocabWord {
  word: string;
  pronunciation: string;
  definition: string;
  example: string;
  translation: string;
}

interface VocabularyData {
  lessonTitle: string;
  words: VocabWord[];
}

export default function VocabularyPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = parseInt(params.id as string);
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [vocabularyData, setVocabularyData] = useState<VocabularyData | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Mock data para vocabulario
  useEffect(() => {
    const mockVocabularyData: VocabularyData = {
      lessonTitle: getLessonTitle(lessonId),
      words: [
        {
          word: "Chiming",
          pronunciation: "/ˈtʃaɪmɪŋ/",
          definition: "Making a musical ringing sound, typically that of a bell or clock",
          example: "The bell was chiming above her head as she entered the coffee shop.",
          translation: "Sonando (como una campana)"
        },
        {
          word: "Rush",
          pronunciation: "/rʌʃ/",
          definition: "A period of intense activity or high demand; a situation requiring urgency",
          example: "The morning rush is in full swing at the coffee shop.",
          translation: "Hora pico, prisa"
        },
        {
          word: "Barista",
          pronunciation: "/bəˈrɪstə/",
          definition: "A person who prepares and serves coffee drinks, especially espresso-based beverages",
          example: "Emma, the barista, has memorized Sarah's order perfectly.",
          translation: "Barista (persona que prepara café)"
        },
        {
          word: "Cappuccino",
          pronunciation: "/ˌkæpəˈtʃiːnoʊ/",
          definition: "An Italian coffee drink made with espresso and steamed milk foam",
          example: "She ordered a large cappuccino with an extra shot of espresso.",
          translation: "Capuchino"
        },
        {
          word: "Espresso machine",
          pronunciation: "/ɪˈspreso məˈʃiːn/",
          definition: "A machine that brews coffee by forcing pressurized hot water through finely ground coffee",
          example: "Emma works the espresso machine with expert skill every morning.",
          translation: "Máquina de espresso"
        },
        {
          word: "Settles in",
          pronunciation: "/ˈsetəlz ɪn/",
          definition: "To make oneself comfortable in a place; to get established in a routine or location",
          example: "She settles in for another productive morning at her favorite table.",
          translation: "Se acomoda, se instala"
        }
      ]
    };
    
    setVocabularyData(mockVocabularyData);
    
    // Activate entrance transition after data is set
    setTimeout(() => {
      setIsTransitioning(false);
    }, 100);
  }, [lessonId]);

  const totalWords = vocabularyData?.words.length || 0;

  const handleNextWord = useCallback(() => {
    // Prevenir múltiples clics
    if (isNavigating) {
      return;
    }
    
    if (currentWordIndex < totalWords - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentWordIndex(currentWordIndex + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
              // Vocabulario completado - ir a la siguiente sección (ministory)
        if (isNavigating) {
          return;
        }
      
      setIsNavigating(true);
      setIsTransitioning(true);
      
      // Navegación inmediata sin timeout
      router.push(`/dashboard/lesson/${lessonId}/ministory`);
    }
  }, [currentWordIndex, totalWords, router, lessonId, isNavigating]);

  const handleCompleteLession = useCallback(() => {
    setShowCompletionModal(false);
    // Aquí podrías guardar el progreso en localStorage/API
    // localStorage.setItem(`lesson-${lessonId}-completed`, 'true');
    router.push('/dashboard');
  }, [router]);

  const handlePreviousWord = useCallback(() => {
    if (currentWordIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentWordIndex(currentWordIndex - 1);
        setIsTransitioning(false);
      }, 300);
    }
  }, [currentWordIndex]);

  const handleGoToPreviousSection = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push(`/dashboard/lesson/${lessonId}/main`);
    }, 300);
  }, [router, lessonId]);

  const handleWordSelect = useCallback((index: number) => {
    if (index !== currentWordIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentWordIndex(index);
        setIsTransitioning(false);
      }, 300);
    }
  }, [currentWordIndex]);

  // Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Si el modal está abierto, solo permitir Enter y Escape
      if (showCompletionModal) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setShowCompletionModal(false);
          router.push('/dashboard');
        } else if (event.key === 'Escape') {
          event.preventDefault();
          setShowCompletionModal(false);
        }
        return;
      }

      switch (event.key) {
        case 'ArrowRight':
        case ' ': // Spacebar
          event.preventDefault();
          if (currentWordIndex < totalWords - 1) {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentWordIndex(currentWordIndex + 1);
              setIsTransitioning(false);
            }, 300);
          } else {
            setIsTransitioning(true);
            setTimeout(() => {
              router.push(`/dashboard/lesson/${lessonId}/ministory`);
            }, 300);
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (currentWordIndex > 0) {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentWordIndex(currentWordIndex - 1);
              setIsTransitioning(false);
            }, 300);
          } else {
            setIsTransitioning(true);
            setTimeout(() => {
              router.push(`/dashboard/lesson/${lessonId}/main`);
            }, 300);
          }
          break;
        case 'Escape':
          event.preventDefault();
          router.push('/dashboard');
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          event.preventDefault();
          const wordIndex = parseInt(event.key) - 1;
          if (wordIndex < totalWords && wordIndex !== currentWordIndex) {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentWordIndex(wordIndex);
              setIsTransitioning(false);
            }, 300);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentWordIndex, totalWords, showCompletionModal, router, lessonId]);

  if (!vocabularyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando vocabulario...</p>
        </div>
      </div>
    );
  }

  const currentWord = vocabularyData.words[currentWordIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-x-hidden">
      {/* Header */}
      <LessonHeader 
        title={vocabularyData.lessonTitle}
        currentSection={1}
        totalSections={4}
        sectionName={`Vocabulario - Palabra ${currentWordIndex + 1} de ${totalWords}`}
        isVocabularyPage={true}
      />

      {/* Main Content */}
      <main className="pt-20 pb-24 overflow-x-hidden">
        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
          <VocabularyCard 
            word={currentWord}
            wordIndex={currentWordIndex}
            totalWords={totalWords}
          />
        </div>
      </main>

      {/* Navigation */}
      <LessonSectionNavigation
        currentSection="vocabulary"
        isTransitioning={isTransitioning}
        onNext={handleNextWord}
        onPrevious={handlePreviousWord}
        currentWordIndex={currentWordIndex}
        totalWords={totalWords}
        words={vocabularyData.words}
        onWordSelect={handleWordSelect}
        isLastWord={currentWordIndex === totalWords - 1}
        onGoToPreviousSection={handleGoToPreviousSection}
      />

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Vocabulario Completado!</h2>
              <p className="text-gray-600 mb-6">
                Has aprendido todas las palabras del vocabulario. ¡Excelente trabajo!
              </p>
              <button
                onClick={handleCompleteLession}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function getLessonTitle(id: number): string {
  const titles = [
    "Saludos y Presentaciones",
    "En el Café", 
    "Pidiendo Direcciones",
    "En el Supermercado",
    "Haciendo Planes",
    "En el Restaurante",
    "Hablando del Clima",
    "En el Trabajo",
    "Vacaciones y Viajes",
    "Entrevista de Trabajo"
  ];
  return titles[id - 1] || "Lección de Inglés";
} 