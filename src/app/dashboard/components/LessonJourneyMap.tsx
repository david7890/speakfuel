'use client';

import { useState, useRef, useEffect } from 'react';
import LessonCard from './LessonCard';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  status: 'completed' | 'in-progress' | 'locked' | 'available';
  progress: number;
  points: number;
  streak: number;
  badges: string[];
  lastCompleted?: string;
  repetitions: number;
  maxRepetitions: number;
  questionsCompleted: boolean;
  // Nuevas propiedades para el sistema de estrellas
  starRequirement?: number | null;
  totalStarsAvailable?: number;
  starsNeeded?: number;
}

interface LessonJourneyMapProps {
  lessons: Lesson[];
}

export default function LessonJourneyMap({ lessons }: LessonJourneyMapProps) {
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getMilestoneIcon = (lessonIndex: number, totalLessons: number) => {
    if (lessonIndex === 0) return '🚀';
    if (lessonIndex === Math.floor(totalLessons / 3)) return '⭐';
    if (lessonIndex === Math.floor((totalLessons * 2) / 3)) return '🔥';
    if (lessonIndex === totalLessons - 1) return '🏆';
    return null;
  };

  const getConnectionColor = (lesson: Lesson) => {
    if (lesson.status === 'completed') return 'from-green-400 to-green-500';
    if (lesson.status === 'in-progress') return 'from-blue-400 to-blue-500';
    if (lesson.status === 'available') return 'from-gray-300 to-gray-400';
    return 'from-gray-200 to-gray-300';
  };

  const handleLessonClick = (lessonId: number) => {
    setSelectedLesson(lessonId);
    const element = document.getElementById(`lesson-${lessonId}`);
    if (element && scrollContainerRef.current) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      });
    }
  };

    if (isMobile) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Tus Lecciones
          </h2>
          <p className="text-gray-600">
            Cada lección completada te acerca más a la fluidez en inglés
          </p>
        </div>

        {/* Grid simple para mobile */}
        <div className="space-y-6">
          {lessons.map((lesson) => (
            <div key={lesson.id}>
              <LessonCard {...lesson} />
            </div>
          ))}
        </div>

        {/* Indicador de progreso para mobile */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm font-semibold text-gray-700">
                {lessons.filter(l => l.status === 'completed').length} de {lessons.length} completadas
              </span>
              <div className="text-xl">
                {lessons.filter(l => l.status === 'completed').length === lessons.length ? '🎉' : '💪'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tu Ruta de Aprendizaje
        </h2>
        <p className="text-gray-600">
          Cada lección completada te acerca más a la fluidez en inglés
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Línea central serpenteante */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 transform -translate-x-1/2 z-10">
          <div className="w-full h-full bg-gradient-to-b from-green-400 via-blue-400 to-purple-400"></div>
        </div>

        {lessons.map((lesson, index) => {
          const isLeft = index % 2 === 0;
          const milestone = getMilestoneIcon(index, lessons.length);
          const isLast = index === lessons.length - 1;

          return (
            <div key={lesson.id} className="relative mb-16">
              {/* Milestone indicator */}
              {milestone && (
                <div className="absolute left-1/2 -top-8 z-40 transform -translate-x-1/2">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full border-4 border-white flex items-center justify-center shadow-xl">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-2xl">{milestone}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Nodo central */}
              <div className="absolute left-1/2 top-16 w-8 h-8 transform -translate-x-1/2 z-30">
                <div className={`w-full h-full rounded-full border-4 border-white shadow-lg ${
                  lesson.status === 'completed' 
                    ? 'bg-green-500' 
                    : lesson.status === 'in-progress'
                    ? 'bg-blue-500'
                    : lesson.status === 'available'
                    ? 'bg-gray-400'
                    : 'bg-gray-300'
                }`}></div>
              </div>

              {/* Línea conectora hacia la tarjeta */}
              <div className={`absolute top-20 w-32 h-0.5 -z-10 ${
                isLeft ? 'left-1/2 -ml-32' : 'left-1/2'
              }`}>
                <div className={`w-full h-full bg-gradient-to-${isLeft ? 'l' : 'r'} ${getConnectionColor(lesson)} rounded-full`}></div>
              </div>

              {/* Lesson card */}
              <div 
                id={`lesson-${lesson.id}`}
                className={`relative z-30 ${
                  isLeft ? 'mr-auto pr-8' : 'ml-auto pl-8'
                } w-1/2 transition-all duration-300 cursor-pointer ${
                  selectedLesson === lesson.id 
                    ? 'scale-105' 
                    : 'hover:scale-102'
                }`}
                onClick={() => handleLessonClick(lesson.id)}
              >
                <div className="relative z-30">
                  {lesson.status === 'in-progress' && (
                    <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
                  )}
                  
                  <LessonCard {...lesson} />
                </div>
              </div>
            </div>
          );
        })}

        {/* Indicador de progreso global */}
        <div className="mt-12 text-center relative z-30">
          <div className="inline-block bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200 relative z-30">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-lg font-semibold text-gray-700">
                {lessons.filter(l => l.status === 'completed').length} de {lessons.length} lecciones completadas
              </span>
              <div className="text-2xl">
                {lessons.filter(l => l.status === 'completed').length === lessons.length ? '🎉' : '💪'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 