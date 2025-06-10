'use client';

import { useRouter } from 'next/navigation';

interface LessonCardProps {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  status: 'completed' | 'in-progress' | 'locked';
  progress?: number;
  points?: number;
  streak?: number;
  badges?: string[];
  lastCompleted?: string;
}

export default function LessonCard({ 
  id, 
  title, 
  description, 
  duration, 
  difficulty, 
  status, 
  progress = 0,
  points = 0,
  streak = 0,
  badges = [],
  lastCompleted
}: LessonCardProps) {
  const router = useRouter();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Principiante': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermedio': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Avanzado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return (
          <div className="relative">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            {streak > 1 && (
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">{streak}</span>
              </div>
            )}
          </div>
        );
      case 'in-progress':
        return (
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'locked':
        return (
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const handleClick = () => {
    if (status !== 'locked') {
      router.push(`/dashboard/lesson/${id}/main`);
    }
  };

  return (
    <div 
      className={`group relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 ${
        status === 'locked' 
          ? 'border-gray-200 opacity-60 cursor-not-allowed' 
          : 'border-transparent hover:border-orange-200 cursor-pointer'
      }`}
      onClick={handleClick}
    >
      {/* Completion Glow Effect */}
      {status === 'completed' && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-2xl animate-pulse"></div>
      )}

      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h3 className={`text-lg font-bold ${status === 'locked' ? 'text-gray-500' : 'text-gray-900 group-hover:text-orange-600'} transition-colors duration-300`}>
                {title}
              </h3>
              {lastCompleted && status === 'completed' && (
                <p className="text-xs text-green-600 font-medium">
                  Completado {lastCompleted}
                </p>
              )}
            </div>
          </div>
          
          {/* Points Badge */}
          {points > 0 && (
            <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{points}</span>
            </div>
          )}
        </div>

        <p className={`text-sm mb-4 ${status === 'locked' ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </p>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {badges.map((badge, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                🏆 {badge}
              </span>
            ))}
          </div>
        )}

        {/* Progress Bar */}
        {status === 'in-progress' && progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-700">Progreso</span>
              <span className="text-xs text-gray-500">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{duration}</span>
            </div>
            
            {streak > 0 && status === 'completed' && (
              <div className="flex items-center space-x-1 text-orange-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">{streak} días</span>
              </div>
            )}
          </div>
          
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        </div>
      </div>

      {/* Action Hint */}
      {status !== 'locked' && (
        <div className="px-6 pb-6">
          <div className={`flex items-center justify-center w-full py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
            status === 'completed' 
              ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200' 
              : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
          } group-hover:scale-105`}>
            <span className="mr-2">
              {status === 'completed' ? 'Revisar lección' : status === 'in-progress' ? 'Continuar' : 'Comenzar'}
            </span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
} 