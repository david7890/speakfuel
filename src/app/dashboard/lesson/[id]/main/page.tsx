'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LessonHeader from '../../components/LessonHeader';
import MainArticle from '../../components/MainArticle';
import LessonSectionNavigation from '../components/LessonSectionNavigation';

interface MainArticleData {
  title: string;
  content: string;
  keyPoints: string[];
}

interface LessonData {
  id: number;
  title: string;
  description: string;
  mainArticle: MainArticleData;
}

export default function MainArticlePage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = parseInt(params.id as string);
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);

  // Mock data para la lección
  useEffect(() => {
    const mockLessonData: LessonData = {
      id: lessonId,
      title: getLessonTitle(lessonId),
      description: getLessonDescription(lessonId),
      mainArticle: {
        title: "Coffee Shop Culture",
        content: `
          Coffee shops have become an integral part of modern social life. They serve as meeting places, 
          workspaces, and quiet retreats for people from all walks of life. In many cities around the world, 
          the local coffee shop is where community connections are made and maintained.
          
          The atmosphere of a coffee shop plays a crucial role in creating this sense of community. 
          The aroma of freshly brewed coffee, the gentle hum of conversation, and the comfortable seating 
          all contribute to an environment that encourages both productivity and relaxation.
          
          Whether you're meeting a friend, working on a project, or simply enjoying a moment of solitude, 
          coffee shops offer a unique space that combines the comfort of home with the energy of public life.
        `,
        keyPoints: [
          "Coffee shops are community gathering places",
          "They combine work and social environments", 
          "Atmosphere is key to their appeal",
          "They offer both productivity and relaxation"
        ]
      }
    };
    
    setLessonData(mockLessonData);
  }, [lessonId]);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push(`/dashboard/lesson/${lessonId}/vocabulary`);
    }, 300);
  };

  const handlePrevious = () => {
    router.push('/dashboard');
  };

  if (!lessonData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando lección...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-x-hidden">
      {/* Header */}
      <LessonHeader 
        title={lessonData.title}
        currentSection={0}
        totalSections={4}
        sectionName="Main Article"
      />

      {/* Main Content */}
      <main className="pt-20 pb-24 overflow-x-hidden">
        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
          <MainArticle 
            data={lessonData.mainArticle} 
            isTransitioning={isTransitioning}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      </main>

      {/* Section Navigation */}
      <LessonSectionNavigation 
        currentSection="main"
        isTransitioning={isTransitioning}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
}

// Helper functions
function getLessonTitle(id: number): string {
  const titles = [
    "Saludos y Presentaciones",
    "En el Café", 
    "Pidiendo Direcciones",
    "En el Supermercado",
    "Haciendo Planes",
    "En el Restaurante",
    "Hablando del Clima",
    "En el Trabajo",
    "Vacaciones y Viajes",
    "Entrevista de Trabajo"
  ];
  return titles[id - 1] || "Lección de Inglés";
}

function getLessonDescription(id: number): string {
  const descriptions = [
    "Aprende a saludar y presentarte en inglés",
    "Domina las conversaciones en cafeterías",
    "Aprende a pedir y dar direcciones",
    "Vocabulario y frases para ir de compras",
    "Cómo hacer planes y citas",
    "Conversaciones y pedidos en restaurantes",
    "Habla sobre el clima y las estaciones",
    "Vocabulario profesional y de oficina",
    "Planifica y habla sobre viajes",
    "Prepárate para entrevistas de trabajo"
  ];
  return descriptions[id - 1] || "Aprende inglés de manera práctica";
} 