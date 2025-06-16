'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LessonHeader from '../../components/LessonHeader';
import MiniStoryQuestions from '../../components/MiniStoryQuestions';
import LessonSectionNavigation from '../components/LessonSectionNavigation';
import { getQuestions, getLessonInfo, type Question, type QuestionsData } from '@/data/lessons';

interface MiniStoryQuestionsData {
  questions: Question[];
  featuredImage?: string;
  audioUrl?: string;
  duration?: number;
  title?: string;
}

interface LessonData {
  id: number;
  title: string;
  description: string;
  miniStoryQuestions: MiniStoryQuestionsData;
}

export default function QuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = parseInt(params.id as string);
  
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Cargar datos de las preguntas
  useEffect(() => {
    const loadQuestionsData = async () => {
      try {
        const lessonInfo = getLessonInfo(lessonId);
        const questionsData = await getQuestions(lessonId);

        if (lessonInfo && questionsData) {
          const data: LessonData = {
            id: lessonId,
            title: lessonInfo.title,
            description: lessonInfo.description,
            miniStoryQuestions: {
              questions: [
                {
                  id: 1,
                  question: "What was the main topic of this story?",
                  options: ["Daily routine", "Travel adventure", "Food preparation", "Work meeting"],
                  correctAnswer: 0,
                  explanation: "The story focused on describing a typical daily routine and common activities."
                },
                {
                  id: 2,
                  question: "Which vocabulary words were emphasized in the story?",
                  options: ["Time expressions", "Family members", "Weather terms", "Sports activities"],
                  correctAnswer: 0,
                  explanation: "The story highlighted various time expressions and daily schedule vocabulary."
                },
                {
                  id: 3,
                  question: "What was the setting of the story?",
                  options: ["A school", "A home", "A restaurant", "An office"],
                  correctAnswer: 1,
                  explanation: "Most of the activities described took place in a home environment."
                }
              ],
              // Include audio data from questionsData
              audioUrl: questionsData.audioUrl,
              duration: questionsData.duration,
              title: questionsData.title
            }
          };
          
          setLessonData(data);
        } else {
          console.error(`No questions data found for lesson ${lessonId}`);
        }
      } catch (error) {
        console.error('Error loading questions data:', error);
      }
    };

    loadQuestionsData();
    
    // Add entrance transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, 100);
  }, [lessonId]);

  const handleNext = () => {
    // Mostrar modal de finalización
    setShowCompletionModal(true);
  };

  const handlePrevious = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push(`/dashboard/lesson/${lessonId}/ministory`);
    }, 300);
  };

  const handleLessonComplete = () => {
    setShowCompletionModal(false);
    // Aquí podrías guardar el progreso en localStorage/API
    // localStorage.setItem(`lesson-${lessonId}-completed`, 'true');
    router.push('/dashboard');
  };

  if (!lessonData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-x-hidden">
      {/* Lesson Header - Only visible on desktop */}
      <LessonHeader 
        title={lessonData.title}
        currentSection={2}
        totalSections={4}
        sectionName="Preguntas"
      />
      
      {/* Main Content */}
      <main className="pt-4 lg:pt-24 pb-24 overflow-x-hidden">
        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
          <MiniStoryQuestions 
            data={lessonData.miniStoryQuestions} 
            isTransitioning={isTransitioning}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      </main>

      {/* Section Navigation */}
      <LessonSectionNavigation 
        currentSection="questions"
        isTransitioning={isTransitioning}
        onNext={handleNext}
        onPrevious={handlePrevious}
        showNavigation={!showCompletionModal}
      />

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center animate-slideUp">
            {/* Celebration Animation */}
            <div className="relative mb-6">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl animate-pulse">✨</div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Lección Completada!
            </h3>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              🏆 Has completado exitosamente <span className="font-semibold text-blue-600">&ldquo;{lessonData.title}&rdquo;</span>
              <br />
              <br />
              ¡Has dominado el vocabulario, la historia y las preguntas!
            </p>

            {/* Progress Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">4/4</div>
                  <div className="text-xs text-gray-600">Secciones completadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+100</div>
                  <div className="text-xs text-gray-600">Puntos obtenidos</div>
                </div>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="mb-6">
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                🏅 Lección Dominada
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleLessonComplete}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Continuar al Dashboard
              </button>
            </div>

            {/* Keyboard Hint */}
            <p className="text-xs text-gray-400 mt-4">
              Presiona <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600">Enter</kbd> para continuar
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
 