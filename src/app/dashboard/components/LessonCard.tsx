'use client';

import { useRouter } from 'next/navigation';
import { StarIcon, ClockIcon, LockClosedIcon } from '@heroicons/react/24/solid';

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
  progress = 0
}: LessonCardProps) {
  const router = useRouter();



  const getCircularProgress = () => {
    const circumference = 2 * Math.PI * 28; // radius = 28
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return { strokeDasharray, strokeDashoffset };
  };

  const getStatusContent = () => {
    switch (status) {
      case 'completed':
        return (
          <div className="relative w-20 h-20">
            {/* Completed circle */}
            <svg className="w-20 h-20" viewBox="0 0 60 60">
              <circle
                cx="30"
                cy="30"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="currentColor"
                className="text-green-500"
              />
            </svg>
            {/* Star icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <StarIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        );
      case 'in-progress':
        return (
          <div className="relative w-20 h-20">
            {/* Background circle */}
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 60 60">
              <circle
                cx="30"
                cy="30"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="30"
                cy="30"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                className="text-orange-500 transition-all duration-500"
                style={getCircularProgress()}
              />
            </svg>
            {/* Clock icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <ClockIcon className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        );
      case 'locked':
        return (
          <div className="relative w-20 h-20">
            {/* Locked circle */}
            <svg className="w-20 h-20" viewBox="0 0 60 60">
              <circle
                cx="30"
                cy="30"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="currentColor"
                className="text-gray-300"
              />
            </svg>
            {/* Lock icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <LockClosedIcon className="w-8 h-8 text-gray-500" />
            </div>
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
      className={`group relative bg-white rounded-3xl shadow-md border transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
        status === 'locked' 
          ? 'border-gray-200 opacity-60 cursor-not-allowed' 
          : 'border-gray-100 cursor-pointer'
      }`}
      onClick={handleClick}
    >
      {/* Subtle completion glow */}
      {status === 'completed' && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl"></div>
      )}

              <div className="relative p-8">
          {/* Header with circular progress */}
          <div className="flex items-start space-x-6 mb-6">
            {getStatusContent()}
            
            <div className="flex-1 min-w-0">
              {/* Status badge for in-progress */}
              {status === 'in-progress' && (
                <div className="inline-flex items-center space-x-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
                  <ClockIcon className="w-3 h-3" />
                  <span>En curso</span>
                </div>
              )}
              
              <h2 className={`text-xl font-bold mb-1 ${
                status === 'locked' 
                  ? 'text-gray-500' 
                  : status === 'completed' 
                    ? 'text-gray-900' 
                    : 'text-gray-900 group-hover:text-orange-600'
              } transition-colors duration-300`}>
                Lección {id}
              </h2>
              
              <h3 className={`text-lg font-medium mb-3 ${
                status === 'locked' ? 'text-gray-400' : 'text-gray-700'
              }`}>
                {title}
              </h3>
              
              <p className={`text-sm leading-relaxed ${
                status === 'locked' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {description}
              </p>
            </div>
          </div>

        {/* Action button */}
        {status !== 'locked' && (
          <div className="mt-6">
            <div className={`flex items-center justify-center w-full py-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
              status === 'completed' 
                ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
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
    </div>
  );
} 