'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StarIcon, ClockIcon, LockClosedIcon, CheckIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

interface LessonCardProps {
  id: number;
  title: string;
  duration: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  status: 'completed' | 'in-progress' | 'locked' | 'available';
  progress?: number;
  points?: number;
  streak?: number;
  badges?: string[];
  lastCompleted?: string;
  repetitions?: number;
  maxRepetitions?: number;
  questionsCompleted?: boolean;
}

export default function LessonCard({ 
  id, 
  title, 
  duration, 
  difficulty, 
  status, 
  progress = 0,
  repetitions = 0,
  maxRepetitions = 3,
  questionsCompleted = false
}: LessonCardProps) {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

  const getStars = () => {
    if (repetitions >= 3) return 3; // 3 estrellas doradas - Dominada
    if (repetitions >= 2) return 2; // 2 estrellas doradas - Avanzada  
    if (repetitions >= 1) return 1; // 1 estrella dorada - Completada
    return 0;
  };

  const renderStars = () => {
    const starCount = getStars();
    if (starCount === 0) return null;
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(3)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${
              index < starCount 
                ? 'text-amber-400 fill-current' 
                : 'text-gray-200 fill-current'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const getMotivationalText = () => {
    if (repetitions === 0) return '';
    if (repetitions === 1) return 'Completada 1 vez – ¡excelente inicio! 🌟';
    if (repetitions === 2) return 'Completada 2 veces – ¡avanzando increíble! 🔥';
    if (repetitions >= 3) return `¡Maestría alcanzada! Lección dominada 🏆`;
    return '';
  };

  const getCircularProgress = () => {
    const circumference = 2 * Math.PI * 28; // radius = 28
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return { strokeDasharray, strokeDashoffset };
  };

  const getStatusContent = () => {
    const starCount = getStars();
    
    switch (status) {
      case 'completed':
        return (
          <div className="relative w-20 h-20">
            {/* Completed circle with gradient */}
            <svg className="w-20 h-20" viewBox="0 0 60 60">
              <defs>
                <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <circle
                cx="30"
                cy="30"
                r="28"
                stroke="url(#completedGradient)"
                strokeWidth="4"
                fill="url(#completedGradient)"
              />
            </svg>
            {/* Check icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckIcon className="w-8 h-8 text-white" />
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
                className="text-slate-200"
              />
              {/* Progress circle with gradient */}
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <circle
                cx="30"
                cy="30"
                r="28"
                stroke="url(#progressGradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                className="transition-all duration-500"
                style={getCircularProgress()}
              />
            </svg>
            {/* Clock icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <ClockIcon className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        );
      case 'available':
        return (
          <div className="relative w-20 h-20">
            {/* Available circle - same as locked but clickable */}
            <svg className="w-20 h-20" viewBox="0 0 60 60">
              <circle
                cx="30"
                cy="30"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-slate-300"
              />
            </svg>
            {/* Number instead of lock */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-slate-600">{id}</span>
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
                className="text-slate-300"
              />
            </svg>
            {/* Lock icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <LockClosedIcon className="w-8 h-8 text-slate-500" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleMainClick = () => {
    if (status !== 'locked') {
      router.push(`/dashboard/lesson/${id}/main`);
    }
  };

  const handleQuestionsClick = () => {
    if (status !== 'locked') {
      router.push(`/dashboard/lesson/${id}/questions`);
    }
  };

  const handleTouchStart = () => {
    if (status !== 'locked') {
      setIsPressed(true);
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  return (
    <div 
      className={`group relative bg-white rounded-3xl shadow-sm border transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
        status === 'locked' 
          ? 'border-slate-200 opacity-60 cursor-not-allowed' 
          : 'border-slate-100 cursor-pointer hover:border-slate-200'
      } ${
        isPressed && status !== 'locked' 
          ? 'scale-95 shadow-sm' 
          : ''
      }`}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Subtle completion glow */}
      {status === 'completed' && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-green-50/30 rounded-3xl"></div>
      )}

      <div className="relative p-6">
        {/* Header with circular progress */}
        <div className="flex items-start space-x-6 mb-6">
          {getStatusContent()}
          
          <div className="flex-1 min-w-0">
            {/* Status badge for in-progress */}
            {status === 'in-progress' && (
              <div className="inline-flex items-center space-x-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-3 border border-blue-100">
                <ClockIcon className="w-3 h-3" />
                <span>En curso</span>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-2">
              <h2 className={`text-xl font-bold ${
                status === 'locked' 
                  ? 'text-slate-500' 
                  : status === 'completed' 
                    ? 'text-slate-900' 
                    : 'text-slate-900 group-hover:text-blue-600'
              } transition-colors duration-300`}>
                Lección {id}
              </h2>
              
              {/* Stars display */}
              {renderStars()}
            </div>
            
            <h3 className={`text-lg font-medium mb-3 ${
              status === 'locked' ? 'text-slate-400' : 'text-slate-700'
            }`}>
              {title}
            </h3>

            {/* Repetitions info - only show if questions completed */}
            {questionsCompleted && repetitions > 0 && (
              <div className="mb-3">
                <div className="inline-flex items-center space-x-2 text-sm font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                  <ArrowPathIcon className="w-4 h-4" />
                  <span>{repetitions}/{maxRepetitions} repeticiones</span>
                </div>
              </div>
            )}
            
            {/* Motivational text */}
            {getMotivationalText() && (
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {getMotivationalText()}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {status !== 'locked' && (
          <div className="mt-6">
            {status === 'completed' ? (
              <div className="flex space-x-3">
                {/* Main button - Escuchar ministory */}
                <button
                  onClick={handleQuestionsClick}
                  className="flex-1 flex items-center justify-center py-3 px-4 rounded-2xl text-sm font-medium transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
                >
                  <span className="mr-2">Escuchar ministory</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Review button */}
                <button
                  onClick={handleMainClick}
                  className="flex-1 py-3 px-4 rounded-2xl text-sm font-medium transition-all duration-200 bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 hover:border-slate-300"
                >
                  Revisar
                </button>
              </div>
            ) : (
              <button
                onClick={handleMainClick}
                className="flex items-center justify-center w-full py-3 px-4 rounded-2xl text-sm font-medium transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
              >
                <span className="mr-2">
                  {status === 'in-progress' ? 'Continuar' : 'Comenzar'}
                </span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 