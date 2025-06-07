'use client';

import { useState } from 'react';
import DashboardHeader from './components/DashboardHeader';
import LessonCard from './components/LessonCard';

export default function Dashboard() {
  // Datos mock para las lecciones
  const [user] = useState({
    name: "María",
    completedLessons: 3,
    totalLessons: 10,
    currentLesson: 4
  });

  const lessons = [
    {
      id: 1,
      number: 1,
      title: "Saludos y Presentaciones",
      status: "completed",
      progress: 100,
      sections: ["Main Article", "Mini Story", "Mini Story con preguntas", "Vocabulario"]
    },
    {
      id: 2,
      number: 2,
      title: "En el Café",
      status: "completed",
      progress: 100,
      sections: ["Main Article", "Mini Story", "Mini Story con preguntas", "Vocabulario"]
    },
    {
      id: 3,
      number: 3,
      title: "Pidiendo Direcciones",
      status: "completed",
      progress: 100,
      sections: ["Main Article", "Mini Story", "Mini Story con preguntas", "Vocabulario"]
    },
    {
      id: 4,
      number: 4,
      title: "En el Supermercado",
      status: "in-progress",
      progress: 60,
      sections: ["Main Article", "Mini Story", "Mini Story con preguntas", "Vocabulario"]
    },
    {
      id: 5,
      number: 5,
      title: "Haciendo Planes",
      status: "locked",
      progress: 0,
      sections: ["Main Article", "Mini Story", "Mini Story con preguntas", "Vocabulario"]
    },
    {
      id: 6,
      number: 6,
      title: "En el Restaurante",
      status: "locked",
      progress: 0,
      sections: ["Main Article", "Mini Story", "Mini Story con preguntas", "Vocabulario"]
    },
    {
      id: 7,
      number: 7,
      title: "Hablando del Clima",
      status: "locked",
      progress: 0,
      sections: ["Main Article", "Mini Story", "Mini Story con preguntas", "Vocabulario"]
    },
    {
      id: 8,
      number: 8,
      title: "En el Trabajo",
      status: "locked",
      progress: 0,
      sections: ["Main Article", "Mini Story", "Mini Story con preguntas", "Vocabulario"]
    },
    {
      id: 9,
      number: 9,
      title: "Vacaciones y Viajes",
      status: "locked",
      progress: 0,
      sections: ["Main Article", "Mini Story", "Mini Story con preguntas", "Vocabulario"]
    },
    {
      id: 10,
      number: 10,
      title: "Entrevista de Trabajo",
      status: "locked",
      progress: 0,
      sections: ["Main Article", "Mini Story", "Mini Story con preguntas", "Vocabulario"]
    }
  ];

  const handleLessonClick = (lessonId: number) => {
    console.log(`Navegando a la lección ${lessonId}`);
    // Aquí iría la navegación a la lección específica
  };

  const handleContinueClick = () => {
    const nextLesson = lessons.find(lesson => lesson.status === 'in-progress' || lesson.status === 'locked');
    if (nextLesson) {
      handleLessonClick(nextLesson.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <DashboardHeader 
          user={user}
          onContinueClick={handleContinueClick}
        />

        {/* Lessons Grid */}
        <div className="mt-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tus Lecciones
            </h2>
            <p className="text-gray-600">
              Cada lección incluye artículo principal, mini historia, preguntas y vocabulario
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onClick={() => handleLessonClick(lesson.id)}
              />
            ))}
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ¡Vas muy bien!
            </h3>
            <p className="text-gray-600 mb-4">
              Cada lección completada te acerca más a la fluidez en inglés
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
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
  );
} 