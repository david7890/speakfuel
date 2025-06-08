'use client';

import { useState } from 'react';
import DashboardHeader from './components/DashboardHeader';
import LessonCard from './components/LessonCard';

// Forzar CSR - Dashboard es privado y dinámico
export const dynamic = 'force-dynamic';

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
      title: "The Coffee Shop Morning",
      description: "Aprende vocabulario esencial sobre cafeterías y rutinas matutinas en un contexto real.",
      duration: "15 min",
      difficulty: 'Principiante' as const,
      status: 'completed' as const,
      progress: 100,
      points: 50,
      streak: 3,
      badges: ['Completista', 'Vocabulario Maestro'],
      lastCompleted: 'ayer'
    },
    {
      id: 2,
      title: "Ordering Food at a Restaurant",
      description: "Domina las conversaciones típicas en restaurantes y amplía tu vocabulario gastronómico.",
      duration: "18 min",
      difficulty: 'Principiante' as const,
      status: 'completed' as const,
      progress: 100,
      points: 55,
      streak: 2,
      badges: ['Gourmet'],
      lastCompleted: 'hace 2 días'
    },
    {
      id: 3,
      title: "Job Interview Preparation",
      description: "Prepárate para entrevistas de trabajo con vocabulario profesional y expresiones clave.",
      duration: "22 min",
      difficulty: 'Intermedio' as const,
      status: 'in-progress' as const,
      progress: 65,
      points: 35,
      streak: 0,
      badges: []
    },
    {
      id: 4,
      title: "Travel and Airport Conversations",
      description: "Aprende a comunicarte efectivamente en aeropuertos y situaciones de viaje.",
      duration: "20 min",
      difficulty: 'Intermedio' as const,
      status: 'locked' as const,
      progress: 0,
      points: 0,
      streak: 0,
      badges: []
    },
    {
      id: 5,
      title: "Medical Appointments",
      description: "Vocabulario médico esencial y cómo describir síntomas en inglés.",
      duration: "25 min",
      difficulty: 'Intermedio' as const,
      status: 'locked' as const,
      progress: 0,
      points: 0,
      streak: 0,
      badges: []
    },
    {
      id: 6,
      title: "Business Presentations",
      description: "Técnicas avanzadas para presentaciones profesionales en inglés.",
      duration: "30 min",
      difficulty: 'Avanzado' as const,
      status: 'locked' as const,
      progress: 0,
      points: 0,
      streak: 0,
      badges: []
    },
    {
      id: 7,
      title: "Social Events and Networking",
      description: "Conversaciones sociales, networking y construcción de relaciones profesionales.",
      duration: "28 min",
      difficulty: 'Avanzado' as const,
      status: 'locked' as const,
      progress: 0,
      points: 0,
      streak: 0,
      badges: []
    },
    {
      id: 8,
      title: "Academic Discussions",
      description: "Debates académicos, expresión de opiniones y argumentación estructurada.",
      duration: "35 min",
      difficulty: 'Avanzado' as const,
      status: 'locked' as const,
      progress: 0,
      points: 0,
      streak: 0,
      badges: []
    },
    {
      id: 9,
      title: "Cultural Understanding",
      description: "Comprensión cultural profunda y comunicación intercultural efectiva.",
      duration: "32 min",
      difficulty: 'Avanzado' as const,
      status: 'locked' as const,
      progress: 0,
      points: 0,
      streak: 0,
      badges: []
    },
    {
      id: 10,
      title: "Mastery Challenge",
      description: "Desafío final que integra todos los conceptos aprendidos en situaciones complejas.",
      duration: "45 min",
      difficulty: 'Avanzado' as const,
      status: 'locked' as const,
      progress: 0,
      points: 0,
      streak: 0,
      badges: []
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
                id={lesson.id}
                title={lesson.title}
                description={lesson.description}
                duration={lesson.duration}
                difficulty={lesson.difficulty}
                status={lesson.status}
                progress={lesson.progress}
                points={lesson.points}
                streak={lesson.streak}
                badges={lesson.badges}
                lastCompleted={lesson.lastCompleted}
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