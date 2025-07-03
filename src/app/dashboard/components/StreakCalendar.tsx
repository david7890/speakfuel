'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FireIcon } from '@heroicons/react/24/solid';

interface DayActivity {
  date: string;
  hasActivity: boolean;
  lessonsCompleted: number;
  isToday: boolean;
}

interface StreakCalendarProps {
  userId?: string;
  currentStreak?: number;
}

export default function StreakCalendar({ userId, currentStreak = 0 }: StreakCalendarProps) {
  const [weeklyActivity, setWeeklyActivity] = useState<DayActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchWeeklyActivity = async () => {
      try {
        const supabase = createClient();
        
        // Obtener los últimos 7 días
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 6); // 6 días atrás + hoy = 7 días
        
        const { data: activities, error } = await supabase
          .from('user_daily_activity')
          .select('activity_date, lessons_completed, has_activity')
          .eq('user_id', userId)
          .gte('activity_date', weekAgo.toISOString().split('T')[0])
          .lte('activity_date', today.toISOString().split('T')[0])
          .order('activity_date', { ascending: true });

        if (error) {
          console.error('Error fetching weekly activity:', error);
          return;
        }

        // Crear array de los últimos 7 días
        const weeklyData: DayActivity[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          const dateString = date.toISOString().split('T')[0];
          
          const activity = activities?.find(a => a.activity_date === dateString);
          
          weeklyData.push({
            date: dateString,
            hasActivity: activity?.has_activity || false,
            lessonsCompleted: activity?.lessons_completed || 0,
            isToday: i === 0
          });
        }

        setWeeklyActivity(weeklyData);
      } catch (error) {
        console.error('Error loading weekly activity:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyActivity();
  }, [userId]);

  const getDayName = (date: string) => {
    const dayDate = new Date(date);
    const today = new Date();
    
    if (dayDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    }
    
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (dayDate.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    }
    
    return dayDate.toLocaleDateString('es', { weekday: 'short' }).charAt(0).toUpperCase();
  };

  const getDayNumber = (date: string) => {
    return new Date(date).getDate();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded-full w-16"></div>
          </div>
          
          <div className="flex justify-between space-x-1 sm:space-x-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-1 flex-1">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-4 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 sm:mt-4 text-center">
            <div className="h-3 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 mb-6 hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2">
          <FireIcon className="w-4 h-4 text-orange-500" />
          <h3 className="text-sm font-semibold text-gray-700">Racha Semanal</h3>
        </div>
        {currentStreak > 0 && (
          <div className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-full animate-fadeIn">
            {currentStreak} día{currentStreak !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Calendar Days */}
      <div className="flex justify-between space-x-1 sm:space-x-2">
        {weeklyActivity.map((day, index) => (
          <div 
            key={day.date} 
            className="flex flex-col items-center space-y-1 flex-1 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Day Circle */}
            <div 
              className={`
                relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
                ${day.hasActivity 
                  ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-md hover:shadow-lg hover:scale-110' 
                  : 'bg-gray-100 text-gray-400 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
                ${day.isToday ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
                animate-fadeIn
              `}
              title={`${getDayName(day.date) === 'Hoy' ? 'Hoy' : getDayName(day.date)} - ${day.lessonsCompleted > 0 ? `${day.lessonsCompleted} lección${day.lessonsCompleted !== 1 ? 'es' : ''} completada${day.lessonsCompleted !== 1 ? 's' : ''}` : 'Sin actividad'}`}
            >
              {day.hasActivity && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              )}
              <span className="text-xs font-medium">
                {getDayNumber(day.date)}
              </span>
              
              {/* Hover tooltip */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {day.lessonsCompleted > 0 
                  ? `${day.lessonsCompleted} lección${day.lessonsCompleted !== 1 ? 'es' : ''}`
                  : 'Sin actividad'
                }
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
              </div>
            </div>

            {/* Day Label */}
            <span className={`text-xs font-medium transition-colors duration-200 ${
              day.isToday ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
            }`}>
              {getDayName(day.date)}
            </span>

            {/* Activity Indicator */}
            {day.lessonsCompleted > 0 && (
              <div className="text-xs text-orange-600 font-bold animate-fadeIn">
                {day.lessonsCompleted}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Message */}
      <div className="mt-3 sm:mt-4 text-center">
        <p className="text-xs text-gray-500 animate-fadeIn">
          {currentStreak === 0 && 'Completa una lección hoy para iniciar tu racha 💪'}
          {currentStreak === 1 && '¡Excelente inicio! Vuelve mañana para continuar 🚀'}
          {currentStreak >= 2 && currentStreak <= 6 && `¡Increíble! ${currentStreak} días consecutivos 🔥`}
          {currentStreak >= 7 && currentStreak <= 13 && `¡Una semana completa! ${currentStreak} días 🏆`}
          {currentStreak >= 14 && currentStreak <= 29 && `¡Eres imparable! ${currentStreak} días consecutivos ⚡`}
          {currentStreak >= 30 && `¡Leyenda! ${currentStreak} días de disciplina total 👑`}
        </p>
      </div>
    </div>
  );
} 