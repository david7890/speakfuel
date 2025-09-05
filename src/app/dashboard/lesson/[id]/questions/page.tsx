'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
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
  const { refreshUserData } = useAuth();
  const lessonId = parseInt(params.id as string);
  
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [currentRepetitions, setCurrentRepetitions] = useState(0);
  const [isFirstCompletion, setIsFirstCompletion] = useState(false);
  const [newStreak, setNewStreak] = useState<number | null>(null);

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
        
        const currentReps = currentProgress?.repetitions_completed || 0;
        const newRepetitions = Math.min(currentReps + 1, 3); // Máximo 3 repeticiones
        setIsFirstCompletion(currentReps === 0 || !currentProgress);
        
        console.log('📊 Estado actual:', {
          currentProgress,
          newRepetitions,
          isFirstCompletion: currentProgress?.repetitions_completed === 0 || !currentProgress,
          userId: user.id,
          lessonId
        });
        
        // ✅ Usar función RPC que actualiza progreso Y racha automáticamente
        const { data: result, error: rpcError } = await supabase
          .rpc('complete_lesson_section', {
            user_uuid: user.id,
            lesson_number: lessonId,
            section_name: 'questions'
          });
        
        if (rpcError) {
          console.error('❌ Error usando RPC complete_lesson_section:', rpcError);
          
          // Fallback: actualización directa sin racha
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
            console.error('❌ Error en fallback update:', updateError);
          } else {
            console.log('✅ Progreso actualizado con fallback (sin racha)');
          }
        } else if (result?.success) {
          console.log('✅ Lección completada exitosamente!');
          console.log('🔥 Nueva racha:', result.new_streak);
          
          // Guardar nueva racha para mostrar en el modal y toast
          if (result.new_streak) {
            setNewStreak(result.new_streak);
            // Guardar en localStorage para activar el toast en el layout
            localStorage.setItem('streak_updated', result.new_streak.toString());
          }
          
          // Actualizar repeticiones para el modal
          setCurrentRepetitions(newRepetitions - 1); // -1 porque el modal suma +1
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
        
        // ✨ CRÍTICO: Sincronizar datos del usuario antes de redirigir
        console.log('🔄 Sincronizando datos del usuario...');
        try {
          const refreshSuccess = await refreshUserData();
          if (refreshSuccess) {
            console.log('✅ Datos sincronizados correctamente');
          } else {
            console.warn('⚠️ No se pudieron sincronizar los datos, pero continuando...');
          }
        } catch (error) {
          console.error('❌ Error sincronizando datos:', error);
          // Continuar de todas formas para evitar trapping
        }
      }
    } catch (error) {
      console.error('❌ Error completando lección:', error);
      alert('Hubo un problema guardando tu progreso. Por favor, recarga la página si el dashboard no se actualiza correctamente.');
    }
    
    // Breve delay para permitir que la sincronización se complete
    setTimeout(() => {
    router.push('/dashboard');
    }, 200);
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
        currentSection={3}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center animate-slideUp">
            {/* Celebration */}
            <div className="text-5xl mb-3 animate-bounce">🎉</div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              ¡Lección Completada!
            </h3>
            
            <p className="text-gray-600 mb-4">
              <span className="font-semibold text-blue-600">&ldquo;{lessonData.title}&rdquo;</span>
            </p>

            {/* Progress Info */}
            <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
              <div className="text-2xl mb-2">
                {currentRepetitions + 1 >= 3 ? '⭐⭐⭐' : 
                 currentRepetitions + 1 >= 2 ? '⭐⭐' : '⭐'}
              </div>
              <div className="text-sm font-bold text-yellow-700 mb-1">
                {currentRepetitions + 1 >= 3 ? 'Dominada' : 
                 currentRepetitions + 1 >= 2 ? 'Avanzada' : 'Completada'}
              </div>
              <div className="text-xs text-gray-600">
                {currentRepetitions + 1}/3 repeticiones
                {currentRepetitions + 1 >= 3 && (
                  <span className="block mt-1 font-medium text-yellow-800">
                    ¡Máximo nivel alcanzado! 🏆
                  </span>
                )}
              </div>
            </div>

            {/* 🔥 Streak Feedback - NEW */}
            {newStreak && newStreak > 0 && (
              <div className="bg-orange-50 rounded-lg p-4 mb-4 border border-orange-200">
                <div className="text-3xl mb-2 animate-pulse">🔥</div>
                <div className="text-sm font-bold text-orange-700 mb-1">
                  ¡Racha Actualizada!
                </div>
                <div className="text-xs text-orange-600">
                  {newStreak === 1 ? (
                    <>
                      <span className="block font-medium">¡Iniciaste tu racha! 🚀</span>
                      <span className="text-orange-500">Vuelve mañana para continuarla</span>
                    </>
                  ) : (
                    <>
                      <span className="block font-medium">{newStreak} días consecutivos</span>
                      <span className="text-orange-500">¡Sigue así! 💪</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Unlock Next Lesson */}
            {isFirstCompletion && lessonId < 8 && (
              <div className="bg-green-50 rounded-lg p-3 mb-4 border border-green-200">
                <div className="text-lg mb-1">🔓</div>
                <div className="text-sm font-bold text-green-700">
                      ¡Lección {lessonId + 1} Desbloqueada!
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleLessonComplete}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                🏠 Regresar al Dashboard
              </button>
              
              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  router.push(`/dashboard/lesson/${lessonId}/main`);
                }}
                className="w-full bg-green-500 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                🔄 Repetir Lección
              </button>
            </div>

            {/* Keyboard Hint */}
            <p className="text-xs text-gray-400 mt-3">
              Presiona <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600 text-xs">Enter</kbd> para continuar
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
 