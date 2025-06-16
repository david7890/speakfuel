'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LessonHeader from '../../components/LessonHeader';
import MiniStory from '../../components/MiniStory';
import LessonSectionNavigation from '../components/LessonSectionNavigation';
import { getMiniStory, getLessonInfo, type MiniStoryData } from '@/data/lessons';

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
  
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);

  // Cargar datos de la lección
  useEffect(() => {
    const loadLessonData = async () => {
      try {
        const lessonInfo = getLessonInfo(lessonId);
        const miniStoryData = await getMiniStory(lessonId);

        if (lessonInfo && miniStoryData) {
          const data: LessonData = {
            id: lessonId,
            title: lessonInfo.title,
            description: lessonInfo.description,
            miniStory: miniStoryData
          };
          
          setLessonData(data);
        } else {
          console.error(`No ministory data found for lesson ${lessonId}`);
        }
      } catch (error) {
        console.error('Error loading ministory data:', error);
      }
    };

    loadLessonData();
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

  if (!lessonData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mini historia...</p>
        </div>
      </div>
    );
  }

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

 