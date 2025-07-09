'use client';

import { StarIcon, LockClosedIcon } from '@heroicons/react/24/solid';

interface ProgressionSystemProps {
  totalStars: number;
}

export default function ProgressionSystem({ totalStars }: ProgressionSystemProps) {
  const milestones = [
    {
      id: 1,
      title: "Bloque Inicial",
      description: "Lecciones 1-3",
      requirement: "Secuencial",
      stars: null,
      lessons: "1 → 2 → 3",
      unlocked: true
    },
    {
      id: 2,
      title: "Bloque Intermedio",
      description: "Lecciones 4-6",
      requirement: "5 estrellas",
      stars: 5,
      lessons: "4 → 5 → 6",
      unlocked: totalStars >= 5
    },
    {
      id: 3,
      title: "Bloque Avanzado",
      description: "Lección 7",
      requirement: "12 estrellas",
      stars: 12,
      lessons: "7",
      unlocked: totalStars >= 12
    },
    {
      id: 4,
      title: "Bloque Maestría",
      description: "Lección 8 Final",
      requirement: "18 estrellas",
      stars: 18,
      lessons: "8",
      unlocked: totalStars >= 18
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
          <StarIcon className="w-6 h-6 text-amber-500 mr-2" />
          Sistema de Progresión por Bloques
        </h3>
        <p className="text-gray-600">
          Completa lecciones y gana estrellas para desbloquear nuevos bloques de contenido
        </p>
      </div>

      {/* Milestones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
              milestone.unlocked
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            {/* Status Icon */}
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                milestone.unlocked
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300 text-gray-500'
              }`}>
                {milestone.unlocked ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <LockClosedIcon className="w-5 h-5" />
                )}
              </div>
              
              {/* Star Requirement */}
              {milestone.stars && (
                <div className={`flex items-center text-sm ${
                  milestone.unlocked ? 'text-green-700' : 'text-gray-500'
                }`}>
                  <StarIcon className="w-4 h-4 mr-1" />
                  <span>{milestone.stars}</span>
                </div>
              )}
            </div>

            {/* Content */}
            <h4 className={`font-semibold mb-1 ${
              milestone.unlocked ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {milestone.title}
            </h4>
            
            <p className={`text-sm mb-2 ${
              milestone.unlocked ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {milestone.description}
            </p>
            
            <div className={`text-xs ${
              milestone.unlocked ? 'text-green-600' : 'text-gray-400'
            }`}>
              {milestone.requirement}
            </div>

            {/* Progress Connector */}
            {index < milestones.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
            )}
          </div>
        ))}
      </div>

      {/* Current Progress */}
      <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <StarIcon className="w-5 h-5 text-amber-500 mr-2" />
            <span className="text-amber-800 font-medium">
              Progreso actual: {totalStars} estrellas
            </span>
          </div>
          
          <div className="text-sm text-amber-700">
            {totalStars < 5 && `${5 - totalStars} estrellas para Bloque Intermedio`}
            {totalStars >= 5 && totalStars < 12 && `${12 - totalStars} estrellas para Bloque Avanzado`}
            {totalStars >= 12 && totalStars < 18 && `${18 - totalStars} estrellas para Bloque Maestría`}
            {totalStars >= 18 && '¡Todos los bloques desbloqueados!'}
          </div>
        </div>
      </div>

      {/* How to earn stars */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          💡 <strong>Consejo:</strong> Gana estrellas completando las preguntas de cada lección. ¡Puedes repetir lecciones para ganar más estrellas!
        </p>
      </div>
    </div>
  );
} 