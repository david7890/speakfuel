'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import DashboardHeader from './components/DashboardHeader';
import LessonJourneyMap from './components/LessonJourneyMap';
import SessionInfo from './components/SessionInfo';
import StreakCalendar from './components/StreakCalendar';
import lessonsData from '@/data/lessons/index.json';

// Forzar CSR - Dashboard es privado y dinámico
export const dynamic = 'force-dynamic';

export default function Dashboard() {
  const router = useRouter();
  const { user, profile, lessonProgress, isLoading, error, clearError, forceRefresh } = useAuth();

  // Mapear difficulty del JSON a los valores esperados por el componente
  const mapDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Principiante' as const;
      case 'intermediate':
        return 'Intermedio' as const;
      case 'advanced':
        return 'Avanzado' as const;
      default:
        return 'Principiante' as const;
    }
  };

  // Obtener progreso de una lección específica
  const getLessonProgress = (lessonId: number) => {
    if (!lessonProgress) {
      // Si no hay datos, la lección 1 debería estar disponible
      return {
        status: lessonId === 1 ? 'available' as const : 'locked' as const,
        progress: 0,
        repetitions: 0,
        questionsCompleted: false
      };
    }

    const progress = lessonProgress.find((p: any) => p.lesson_id === lessonId);
    
    if (!progress) {
      // Si no hay progreso específico, determinar basado en lógica de desbloqueo
      const isUnlocked = isLessonUnlocked(lessonId);
      return {
        status: isUnlocked ? 'available' as const : 'locked' as const,
        progress: 0,
        repetitions: 0,
        questionsCompleted: false
      };
    }

    // Mapear status de DB a tipos esperados por el componente
    const mapStatus = (dbStatus: string, lessonId: number) => {
      switch (dbStatus) {
        case 'available':
          return 'available' as const; // Disponible = se puede empezar
        case 'locked':
          return 'locked' as const; // Bloqueado = no se puede acceder
        case 'in_progress':
          return 'in-progress' as const;
        case 'completed':
          return 'completed' as const;
        default:
          // Si no hay datos específicos, usar lógica de desbloqueo
          return isLessonUnlocked(lessonId) ? 'available' as const : 'locked' as const;
      }
    };

    return {
      status: mapStatus(progress.status, lessonId),
      progress: progress.status === 'completed' ? 100 : progress.status === 'in_progress' ? 65 : 0,
      repetitions: progress.repetitions_completed,
      questionsCompleted: progress.questions_completed
    };
  };

  // Calcular total de estrellas acumuladas
  const getTotalStars = () => {
    if (!lessonProgress) return 0;
    
    return lessonProgress.reduce((total: number, progress: any) => {
      return total + (progress.repetitions_completed || 0);
    }, 0);
  };

  // Determinar si una lección está desbloqueada (sistema de bloques con estrellas)
  const isLessonUnlocked = (lessonId: number) => {
    if (lessonId === 1) return true; // Lección 1 siempre disponible
    
    if (!lessonProgress) return false;
    
    const totalStars = getTotalStars();
    
    // Requisitos especiales por lección
    const starRequirements: { [key: number]: number } = {
      4: 5,   // Lección 4: requiere 5 estrellas mínimas
      7: 12,  // Lección 7: requiere 12 estrellas acumuladas
      8: 18   // Lección 8: requiere 18 estrellas acumuladas
    };
    
    // Verificar requisitos de estrellas para lecciones especiales
    if (starRequirements[lessonId]) {
      const requiredStars = starRequirements[lessonId];
      if (totalStars < requiredStars) {
        return false; // No tiene suficientes estrellas
      }
    }
    
    // Lógica de desbloqueo secuencial por bloques
    switch (lessonId) {
      case 2:
        // Lección 2: requiere completar lección 1
        const lesson1 = lessonProgress.find((p: any) => p.lesson_id === 1);
        return lesson1?.status === 'completed';
      
      case 3:
        // Lección 3: requiere completar lección 2
        const lesson2 = lessonProgress.find((p: any) => p.lesson_id === 2);
        return lesson2?.status === 'completed';
      
      case 4:
        // Lección 4: requiere completar lección 3 + 5 estrellas (ya verificado arriba)
        const lesson3 = lessonProgress.find((p: any) => p.lesson_id === 3);
        return lesson3?.status === 'completed';
      
      case 5:
        // Lección 5: requiere completar lección 4
        const lesson4 = lessonProgress.find((p: any) => p.lesson_id === 4);
        return lesson4?.status === 'completed';
      
      case 6:
        // Lección 6: requiere completar lección 5
        const lesson5 = lessonProgress.find((p: any) => p.lesson_id === 5);
        return lesson5?.status === 'completed';
      
      case 7:
        // Lección 7: requiere completar lección 6 + 12 estrellas (ya verificado arriba)
        const lesson6 = lessonProgress.find((p: any) => p.lesson_id === 6);
        return lesson6?.status === 'completed';
      
      case 8:
        // Lección 8: requiere completar lección 7 + 18 estrellas (ya verificado arriba)
        const lesson7 = lessonProgress.find((p: any) => p.lesson_id === 7);
        return lesson7?.status === 'completed';
      
      default:
        return false;
    }
  };

  // Obtener requisitos de estrellas para una lección específica
  const getStarRequirement = (lessonId: number) => {
    const starRequirements: { [key: number]: number } = {
      4: 5,   // Lección 4: requiere 5 estrellas mínimas
      7: 12,  // Lección 7: requiere 12 estrellas acumuladas
      8: 18   // Lección 8: requiere 18 estrellas acumuladas
    };
    
    return starRequirements[lessonId] || null;
  };

  // Calcular estadísticas del usuario
  const getUserStats = () => {
    if (!lessonProgress) {
      return {
        completedLessons: 0,
        totalLessons: 8,
        currentLesson: 1
      };
    }

    const completedCount = lessonProgress.filter((p: any) => p.status === 'completed').length;
    const inProgressLesson = lessonProgress.find((p: any) => p.status === 'in_progress');
    
    return {
      completedLessons: completedCount,
      totalLessons: 8,
      currentLesson: inProgressLesson?.lesson_id || completedCount + 1
    };
  };

  // Calcular estrellas totales para mostrar en la UI
  const totalStars = getTotalStars();

  // Usar solo las primeras 8 lecciones del JSON
  const lessons = lessonsData.slice(0, 8).map((lessonData) => {
    const progressInfo = getLessonProgress(lessonData.id);
    const starRequirement = getStarRequirement(lessonData.id);
    
    return {
      id: lessonData.id,
      title: lessonData.title,
      duration: `${lessonData.estimatedTime} min`,
      difficulty: mapDifficulty(lessonData.difficulty),
      status: progressInfo.status,
      progress: progressInfo.progress,
      points: progressInfo.status === 'completed' ? 50 + (lessonData.id * 5) : 0,
      streak: progressInfo.status === 'completed' ? Math.floor(Math.random() * 5) : 0,
      badges: progressInfo.status === 'completed' ? ['Completista'] : [],
      lastCompleted: undefined,
      repetitions: progressInfo.repetitions,
      maxRepetitions: 3,
      questionsCompleted: progressInfo.questionsCompleted,
      // Información adicional para el sistema de estrellas
      starRequirement: starRequirement,
      totalStarsAvailable: totalStars,
      starsNeeded: starRequirement ? Math.max(0, starRequirement - totalStars) : 0
    };
  });

  const handleContinueClick = async () => {
    console.log('🎯 Determinando siguiente lección...');
    console.log('📊 Estado de lecciones:', lessons.map(l => ({ id: l.id, title: l.title, status: l.status })));
    
    // 1. Primero buscar lección en progreso
    const inProgressLesson = lessons.find(lesson => lesson.status === 'in-progress');
    
    if (inProgressLesson) {
      console.log('▶️ Continuando lección en progreso:', inProgressLesson.id);
      router.push(`/dashboard/lesson/${inProgressLesson.id}/main`);
      return;
    }
    
    // 2. Si no hay lección en progreso, buscar la siguiente DISPONIBLE (no bloqueada)
    const availableLesson = lessons.find(lesson => lesson.status === 'available');
    
    if (availableLesson) {
      console.log('🔓 Iniciando lección disponible:', availableLesson.id);
      router.push(`/dashboard/lesson/${availableLesson.id}/main`);
      return;
    }
    
    // 3. Si no hay disponibles, ir a la primera lección completada para repetir
    const completedLesson = lessons.find(lesson => lesson.status === 'completed');
    
    if (completedLesson) {
      console.log('🔄 Repitiendo lección completada:', completedLesson.id);
      router.push(`/dashboard/lesson/${completedLesson.id}/main`);
      return;
    }
    
    // 4. Fallback: ir a lección 1
    console.log('🏠 Fallback: ir a lección 1');
    router.push('/dashboard/lesson/1/main');
  };

  // Estado de error con opciones de recuperación
  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-200">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Problema de Conexión
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {error}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  clearError();
                  forceRefresh();
                }}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                🔄 Reintentar
              </button>
              
              <button
                onClick={() => {
                  clearError();
                  window.location.reload();
                }}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                🔄 Recargar Página
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Si el problema persiste, verifica tu conexión a internet
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu progreso...</p>
          <p className="text-sm text-gray-500 mt-2">
            Esto no debería tomar más de unos segundos...
          </p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    router.push('/auth/signin');
    return null;
  }

  const userStats = getUserStats();
  
  // Extraer solo la parte antes del @ si es un email
  const getDisplayName = (name: string) => {
    if (name.includes('@')) {
      return name.split('@')[0];
    }
    return name;
  };
  
  const userData = {
    name: getDisplayName(profile.name),
    completedLessons: userStats.completedLessons,
    totalLessons: userStats.totalLessons,
    currentLesson: userStats.currentLesson
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Streak Calendar */}
      <StreakCalendar 
        userId={user?.id}
        currentStreak={profile?.current_streak || 0}
      />
      
      {/* Header */}
      <DashboardHeader 
        user={userData}
        totalStars={totalStars}
        onContinueClick={handleContinueClick}
      />

      {/* Session Information */}
      <SessionInfo />

      {/* Journey Map */}
      <div className="mt-12">
        <LessonJourneyMap lessons={lessons} />
      </div>

      {/* Enhanced Motivational Footer */}
      <div className="mt-16">
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-100 to-yellow-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
          
          <div className="relative text-center">
            {/* Dynamic content based on user progress */}
            <div className="text-4xl mb-4 animate-fadeIn">
              {userStats.completedLessons === 0 && '🚀'}
              {userStats.completedLessons >= 1 && userStats.completedLessons <= 2 && '⭐'}
              {userStats.completedLessons >= 3 && userStats.completedLessons <= 5 && '🔥'}
              {userStats.completedLessons >= 6 && userStats.completedLessons <= 7 && '🏆'}
              {userStats.completedLessons === 8 && '👑'}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {userStats.completedLessons === 0 && '¡Tu viaje comienza aquí!'}
              {userStats.completedLessons >= 1 && userStats.completedLessons <= 2 && `¡Excelente inicio, ${userData.name}!`}
              {userStats.completedLessons >= 3 && userStats.completedLessons <= 5 && `¡Vas por buen camino, ${userData.name}!`}
              {userStats.completedLessons >= 6 && userStats.completedLessons <= 7 && `¡Casi lo logras, ${userData.name}!`}
              {userStats.completedLessons === 8 && `¡Increíble, ${userData.name}! ¡Completaste todo!`}
            </h3>
            
            <p className="text-gray-600 mb-6 max-w-lg mx-auto leading-relaxed">
              Cada lección completada te acerca más a la fluidez en inglés
            </p>

            {/* Core principles */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Constancia diaria
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Progreso medible
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Resultados reales
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}