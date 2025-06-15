'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LessonHeader from '../../components/LessonHeader';
import MiniStory from '../../components/MiniStory';
import LessonSectionNavigation from '../components/LessonSectionNavigation';

interface MiniStoryData {
  title: string;
  story: string;
  characters: string[];
  setting: string;
}

interface LessonData {
  id: number;
  title: string;
  description: string;
  miniStory: MiniStoryData;
}

export default function MiniStoryPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = parseInt(params.id as string);
  
  const [isTransitioning, setIsTransitioning] = useState(true); // Start with transition active

  // Mock data para la lección - Usar useMemo para evitar re-renders
  const lessonData = useMemo<LessonData>(() => {
    return {
      id: lessonId,
      title: getLessonTitle(lessonId),
      description: getLessonDescription(lessonId),
      miniStory: {
        title: "Sarah's Morning Routine",
        story: `
          Sarah pushes open the door to her favorite coffee shop, the familiar bell chiming above her head. 
          The morning rush is in full swing, but she doesn't mind waiting. She knows exactly what she wants.
          
          "Good morning, Sarah!" calls out Emma, the barista who has memorized her order. 
          "The usual today?"
          
          "You know me too well," Sarah laughs, pulling out her phone to check the time. 
          "One large cappuccino with an extra shot, please."
          
          As Emma works the espresso machine, Sarah finds her favorite corner table by the window. 
          She opens her laptop and settles in for another productive morning at her "office away from office."
        `,
        characters: ["Sarah - Regular customer", "Emma - Friendly barista"],
        setting: "A busy coffee shop during morning rush"
      }
    };
  }, [lessonId]);

  // Add entrance transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push(`/dashboard/lesson/${lessonId}/questions`);
    }, 300);
  };

  const handlePrevious = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push(`/dashboard/lesson/${lessonId}/vocabulary`);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-x-hidden">
      {/* Lesson Header - Only visible on desktop */}
      <LessonHeader 
        title={lessonData.miniStory.title}
        currentSection={1}
        totalSections={4}
        sectionName="Mini Historia"
      />
      
      {/* Main Content */}
      <main className="pt-4 lg:pt-24 pb-24 overflow-x-hidden">
        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
          <MiniStory 
            data={lessonData.miniStory} 
            isTransitioning={isTransitioning}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      </main>

      {/* Section Navigation */}
      <LessonSectionNavigation 
        currentSection="ministory"
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