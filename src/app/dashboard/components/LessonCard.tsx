'use client';

import { useRouter } from 'next/navigation';

interface Lesson {
  id: number;
  number: number;
  title: string;
  status: 'completed' | 'in-progress' | 'locked';
  progress: number;
  sections: string[];
}

interface LessonCardProps {
  lesson: Lesson;
  onClick?: () => void;
}

export default function LessonCard({ lesson, onClick }: LessonCardProps) {
  const router = useRouter();

  const handleLessonClick = () => {
    if (lesson.status !== 'locked') {
      router.push(`/dashboard/lesson/${lesson.id}`);
    }
    onClick?.();
  };
  const getStatusIcon = () => {
    switch (lesson.status) {
      case 'completed':
        return <span className="text-2xl">✅</span>;
      case 'in-progress':
        return <span className="text-2xl">⏳</span>;
      case 'locked':
        return <span className="text-2xl text-gray-400">🔒</span>;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (lesson.status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'in-progress':
        return 'border-blue-200 bg-blue-50';
      case 'locked':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const getButtonText = () => {
    switch (lesson.status) {
      case 'completed':
        return 'Revisar';
      case 'in-progress':
        return 'Continuar';
      case 'locked':
        return 'Bloqueada';
      default:
        return 'Ver Lección';
    }
  };

  const isClickable = lesson.status !== 'locked';

  // Calcular el perímetro del círculo para el progreso
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (lesson.progress / 100) * circumference;

  return (
    <div 
      className={`
        rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer
        ${getStatusColor()}
        ${isClickable 
          ? 'hover:shadow-lg hover:scale-105 transform' 
          : 'opacity-75 cursor-not-allowed'
        }
      `}
      onClick={isClickable ? handleLessonClick : undefined}
    >
      <div className="flex items-center justify-between">
        {/* Left Section - Lesson Info */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Lesson Number Circle */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-gray-100">
              <span className="text-xl font-bold text-gray-900">
                {lesson.number}
              </span>
            </div>
            
            {/* Progress Circle Overlay */}
            {lesson.status !== 'locked' && (
              <svg 
                className="absolute inset-0 w-16 h-16 transform -rotate-90"
                viewBox="0 0 56 56"
              >
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  stroke="#e5e7eb"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="28"
                  cy="28"
                  r={radius}
                  stroke={lesson.status === 'completed' ? '#10b981' : '#3b82f6'}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
            )}
          </div>

          {/* Lesson Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {lesson.title}
              </h3>
              {getStatusIcon()}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {lesson.sections.length} secciones • {lesson.progress}% completado
            </p>
            
            {/* Sections Preview */}
            <div className="flex flex-wrap gap-1">
              {lesson.sections.slice(0, 2).map((section, index) => (
                <span 
                  key={index}
                  className="inline-block px-2 py-1 bg-white rounded-md text-xs text-gray-600 border"
                >
                  {section}
                </span>
              ))}
              {lesson.sections.length > 2 && (
                <span className="inline-block px-2 py-1 bg-white rounded-md text-xs text-gray-500 border">
                  +{lesson.sections.length - 2} más
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Action Button */}
        <div className="flex-shrink-0 ml-4">
          <button
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300
              ${lesson.status === 'locked' 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : lesson.status === 'completed'
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'
              }
            `}
            disabled={lesson.status === 'locked'}
            onClick={(e) => {
              e.stopPropagation();
              if (isClickable) handleLessonClick();
            }}
          >
            {getButtonText()}
          </button>
        </div>
      </div>

      {/* Progress Bar (only for in-progress lessons) */}
      {lesson.status === 'in-progress' && lesson.progress > 0 && lesson.progress < 100 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>Progreso actual</span>
            <span>{lesson.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${lesson.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Celebration for completed lessons */}
      {lesson.status === 'completed' && (
        <div className="mt-4 pt-4 border-t border-green-200">
          <div className="flex items-center justify-center space-x-2 text-green-700">
            <span className="text-lg">🎉</span>
            <span className="text-sm font-medium">¡Lección completada!</span>
          </div>
        </div>
      )}
    </div>
  );
} 