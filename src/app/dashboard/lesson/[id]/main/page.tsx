'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LessonHeader from '../../components/LessonHeader';
import MainArticle from '../../components/MainArticle';
import LessonSectionNavigation from '../components/LessonSectionNavigation';
import { getMainArticle, getLessonInfo, type MainArticleData } from '@/data/lessons';

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

  // Cargar datos de la lección
  useEffect(() => {
    const loadLessonData = async () => {
      try {
        const lessonInfo = getLessonInfo(lessonId);
        const mainArticleData = await getMainArticle(lessonId);

        if (lessonInfo && mainArticleData) {
          const data: LessonData = {
            id: lessonId,
            title: lessonInfo.title,
            description: lessonInfo.description,
            mainArticle: mainArticleData
          };
          
          setLessonData(data);
        } else {
          console.error(`No data found for lesson ${lessonId}`);
        }
      } catch (error) {
        console.error('Error loading lesson data:', error);
      }
    };

    loadLessonData();
    
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

 