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
  const [currentRepetitions, setCurrentRepetitions] = useState(0);
  const [isFirstCompletion, setIsFirstCompletion] = useState(false);

  // Soporte para tecla Enter en el modal
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && showCompletionModal) {
        handleLessonComplete();
      }
    };

    if (showCompletionModal) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [showCompletionModal]);

  // Cargar datos de las preguntas y progreso actual
  useEffect(() => {
    const loadQuestionsData = async () => {
      try {
        // Cargar progreso actual desde Supabase
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: progressData } = await supabase
            .from('user_lesson_progress')
            .select('repetitions_completed')
            .eq('user_id', user.id)
            .eq('lesson_id', lessonId)
            .single();
          
          setCurrentRepetitions(progressData?.repetitions_completed || 0);
        }
        
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
              title: questionsData.title,
              featuredImage: questionsData.featuredImage
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

  const handleLessonComplete = async () => {
    setShowCompletionModal(false);
    
    try {
      // Actualizar progreso en Supabase
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log('🎯 Actualizando progreso de lección:', lessonId);
        
        // Obtener progreso actual con manejo de errores
        const { data: currentProgress, error: fetchError } = await supabase
          .from('user_lesson_progress')
          .select('repetitions_completed, status')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
          .maybeSingle(); // maybeSingle() no falla si no encuentra registros
        
        if (fetchError) {
          console.error('❌ Error obteniendo progreso actual:', fetchError);
        }
        
        const newRepetitions = (currentProgress?.repetitions_completed || 0) + 1;
        setIsFirstCompletion(currentProgress?.repetitions_completed === 0 || !currentProgress);
        
        console.log('📊 Estado actual:', {
          currentProgress,
          newRepetitions,
          isFirstCompletion: currentProgress?.repetitions_completed === 0 || !currentProgress,
          userId: user.id,
          lessonId
        });
        
        // Actualizar progreso con manejo mejorado de conflictos
        const { error: updateError } = await supabase
          .from('user_lesson_progress')
          .upsert({
            user_id: user.id,
            lesson_id: lessonId,
            status: 'completed',
            repetitions_completed: newRepetitions,
            questions_completed: true,
            last_completed_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,lesson_id',
            ignoreDuplicates: false
          });
        
        if (updateError) {
          console.error('❌ Error actualizando progreso:', updateError);
          console.error('❌ Detalles del error:', {
            code: updateError.code,
            message: updateError.message,
            details: updateError.details,
            hint: updateError.hint
          });
          
          // Intentar actualización más segura
          const { error: safeUpdateError } = await supabase
            .from('user_lesson_progress')
            .update({
              status: 'completed',
              repetitions_completed: newRepetitions,
              questions_completed: true,
              last_completed_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .eq('lesson_id', lessonId);
            
          if (safeUpdateError) {
            console.error('❌ Error en actualización segura:', safeUpdateError);
          } else {
            console.log('✅ Progreso actualizado con método seguro! Repeticiones:', newRepetitions);
          }
        } else {
          console.log('✅ Progreso actualizado! Repeticiones:', newRepetitions);
        }
        
        // Desbloquear siguiente lección si es la primera vez (con manejo mejorado)
        if (newRepetitions === 1 && lessonId < 8) {
          const { error: unlockError } = await supabase
            .from('user_lesson_progress')
            .upsert({
              user_id: user.id,
              lesson_id: lessonId + 1,
              status: 'available',
              repetitions_completed: 0,
              questions_completed: false,
              created_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,lesson_id',
              ignoreDuplicates: true
            });
            
          if (unlockError && unlockError.code !== '23505') { // Ignorar errores de duplicado
            console.error('❌ Error desbloqueando lección:', unlockError);
          } else {
            console.log('🔓 Lección', lessonId + 1, 'desbloqueada!');
          }
        }
      }
    } catch (error) {
      console.error('❌ Error completando lección:', error);
    }
    
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

            {/* Estrellas y Repeticiones */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-6 border border-yellow-200">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">
                  {currentRepetitions + 1 >= 5 ? '⭐⭐⭐' : 
                   currentRepetitions + 1 >= 3 ? '⭐⭐' : '⭐'}
                </div>
                <div className="text-lg font-bold text-yellow-700">
                  {currentRepetitions + 1 >= 5 ? '3 Estrellas Doradas!' : 
                   currentRepetitions + 1 >= 3 ? '2 Estrellas Doradas!' : '1 Estrella Dorada!'}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  🔁 {currentRepetitions + 1}/7 repeticiones
                </div>
                <div className="text-sm text-gray-600">
                  {currentRepetitions + 1 < 7 ? 'Continúa practicando para dominar la lección' : '¡Lección completamente dominada!'}
                </div>
              </div>
            </div>

            {/* Motivational Text */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">🎉</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {isFirstCompletion ? '¡Excelente trabajo!' : '¡Sigue mejorando!'}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {isFirstCompletion ? 
                      'Has completado tu primera vez esta lección' : 
                      `Ya has completado esta lección ${currentRepetitions} veces`}
                  </div>
                </div>
              </div>
            </div>

            {/* Unlock Next Lesson */}
            {isFirstCompletion && lessonId < 8 && (
              <div className="mb-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔓</div>
                    <div className="text-lg font-bold text-green-700">
                      ¡Lección {lessonId + 1} Desbloqueada!
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Ahora puedes acceder a la siguiente lección
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Achievement Badge */}
            <div className="mb-6">
              <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                🏅 {currentRepetitions + 1 >= 7 ? 'Lección Dominada' : 'Lección Completada'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleLessonComplete}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-blue-200"
              >
                🏠 Regresar al Dashboard
              </button>
              
              {/* Botón secundario para repetir */}
              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  router.push(`/dashboard/lesson/${lessonId}/main`);
                }}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                🔄 Repetir Lección
              </button>
            </div>

            {/* Keyboard Hint */}
            <p className="text-xs text-gray-400 mt-4">
              Presiona <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600">Enter</kbd> para regresar al dashboard
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
 