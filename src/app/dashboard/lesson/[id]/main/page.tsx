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
  // Nueva estructura para audio y transcripción
  audioUrl?: string;
  duration?: number;
  transcript?: {
    text: string;
    startTime: number;
    endTime: number;
  }[];
  featuredImage?: string;
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
  
  const [isTransitioning, setIsTransitioning] = useState(true);
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
          "Coffee shops serve as modern community hubs",
          "They blend social interaction with productivity", 
          "Atmosphere creates a welcoming environment",
          "They offer flexibility for different activities"
        ],
        // Nuevos datos para el reproductor de audio
        audioUrl: "/audio/coffee-shop-culture.mp3",
        duration: 25,
        transcript: [
          { text: "Welcome to today's lesson about coffee shop culture.", startTime: 0, endTime: 3.5 },
          { text: "Coffee shops have become an integral part of modern social life.", startTime: 3.5, endTime: 7.2 },
          { text: "They serve as meeting places, workspaces, and quiet retreats for people from all walks of life.", startTime: 7.2, endTime: 12.8 },
          { text: "The atmosphere of a coffee shop plays a crucial role in creating this sense of community.", startTime: 12.8, endTime: 17.5 },
          { text: "Whether you're meeting a friend or working on a project, coffee shops offer a unique space that combines comfort with energy.", startTime: 17.5, endTime: 25.0 },
        ],
        featuredImage: "/images/coffee-shop-hero.jpg"
      }
    };
    
    setLessonData(mockLessonData);
    
    // Add entrance transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, 100);
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
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f0fdf4 100%)'}}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando lección...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-25 via-white to-green-25 overflow-x-hidden" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f0fdf4 100%)'}}>
      {/* Lesson Header - Only visible on desktop */}
      <LessonHeader 
        title={lessonData.mainArticle.title}
        currentSection={0}
        totalSections={4}
        sectionName="Artículo Principal"
      />
      
      {/* Main Content */}
      <main className="pt-4 lg:pt-24 pb-24 overflow-x-hidden">
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