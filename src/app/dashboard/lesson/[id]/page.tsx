'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LessonHeader from '../components/LessonHeader';
import MainArticle from '../components/MainArticle';
import MiniStory from '../components/MiniStory';
import MiniStoryQuestions from '../components/MiniStoryQuestions';
import Vocabulary from '../components/Vocabulary';
import LessonNavigation from '../components/LessonNavigation';

interface LessonData {
  id: number;
  title: string;
  description: string;
  sections: {
    mainArticle: any;
    miniStory: any;
    miniStoryQuestions: any;
    vocabulary: any;
  };
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = parseInt(params.id as string);
  
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lessonData, setLessonData] = useState<LessonData | null>(null);

  // Mock data para la lección
  useEffect(() => {
    // Simular carga de datos
    const mockLessonData: LessonData = {
      id: lessonId,
      title: getLessonTitle(lessonId),
      description: getLessonDescription(lessonId),
      sections: {
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
        },
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
        },
        miniStoryQuestions: {
          questions: [
            {
              id: 1,
              question: "What does Sarah order at the coffee shop?",
              options: [
                "A small coffee with milk",
                "A large cappuccino with an extra shot", 
                "A tea with honey",
                "A regular cappuccino"
              ],
              correctAnswer: 1,
              explanation: "Sarah orders 'one large cappuccino with an extra shot' according to the story."
            },
            {
              id: 2, 
              question: "How does the barista know Sarah?",
              options: [
                "They are old friends",
                "Sarah is a new customer",
                "Emma has memorized Sarah's order",
                "They work together"
              ],
              correctAnswer: 2,
              explanation: "The text mentions that Emma 'has memorized her order', showing Sarah is a regular customer."
            },
            {
              id: 3,
              question: "Where does Sarah plan to work?",
              options: [
                "At the coffee counter",
                "In her car",
                "At her favorite corner table by the window",
                "Standing by the door"
              ],
              correctAnswer: 2,
              explanation: "Sarah 'finds her favorite corner table by the window' to work at her 'office away from office.'"
            }
          ]
        },
        vocabulary: {
          words: [
            {
              word: "Chiming",
              pronunciation: "/ˈtʃaɪmɪŋ/",
              definition: "Making a musical ringing sound",
              example: "The bell was chiming above her head as she entered.",
              translation: "Sonando (como una campana)"
            },
            {
              word: "Rush",
              pronunciation: "/rʌʃ/",
              definition: "A period of intense activity or demand",
              example: "The morning rush is in full swing at the coffee shop.",
              translation: "Hora pico, prisa"
            },
            {
              word: "Barista",
              pronunciation: "/bəˈrɪstə/",
              definition: "A person who prepares and serves coffee drinks",
              example: "Emma, the barista, has memorized Sarah's order.",
              translation: "Barista (persona que prepara café)"
            },
            {
              word: "Cappuccino",
              pronunciation: "/ˌkæpəˈtʃiːnoʊ/",
              definition: "An Italian coffee drink with espresso and steamed milk foam",
              example: "She ordered a large cappuccino with an extra shot.",
              translation: "Capuchino"
            },
            {
              word: "Espresso machine",
              pronunciation: "/ɪˈspreso məˈʃiːn/",
              definition: "A machine that brews coffee by forcing pressurized water through ground coffee",
              example: "Emma works the espresso machine expertly.",
              translation: "Máquina de espresso"
            },
            {
              word: "Settles in",
              pronunciation: "/ˈsetəlz ɪn/",
              definition: "To make oneself comfortable in a place",
              example: "She settles in for another productive morning.",
              translation: "Se acomoda, se instala"
            }
          ]
        }
      }
    };
    
    setLessonData(mockLessonData);
  }, [lessonId]);

  const sectionNames = ['Main Article', 'Mini Story', 'Mini Story Questions', 'Vocabulary'];
  const totalSections = sectionNames.length;

  const handleNext = () => {
    if (currentSection < totalSections - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSection(currentSection + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      // Lección completada
      handleLessonComplete();
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSection(currentSection - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleLessonComplete = () => {
    // Aquí se guardaría el progreso
    console.log('Lección completada!');
    router.push('/dashboard');
  };

  const renderCurrentSection = () => {
    if (!lessonData) return null;

    const sectionProps = {
      isTransitioning,
      onNext: handleNext,
      onPrevious: handlePrevious
    };

    switch (currentSection) {
      case 0:
        return <MainArticle data={lessonData.sections.mainArticle} {...sectionProps} />;
      case 1:
        return <MiniStory data={lessonData.sections.miniStory} {...sectionProps} />;
      case 2:
        return <MiniStoryQuestions data={lessonData.sections.miniStoryQuestions} {...sectionProps} />;
      case 3:
        return <Vocabulary data={lessonData.sections.vocabulary} {...sectionProps} />;
      default:
        return null;
    }
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
        currentSection={currentSection}
        totalSections={totalSections}
        sectionName={sectionNames[currentSection]}
      />

      {/* Main Content */}
      <main className="pt-20 pb-24 overflow-x-hidden">
        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
          {renderCurrentSection()}
        </div>
      </main>

      {/* Navigation */}
      <LessonNavigation
        currentSection={currentSection}
        totalSections={totalSections}
        sectionNames={sectionNames}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isLastSection={currentSection === totalSections - 1}
      />
    </div>
  );
}

// Helper functions para datos mock
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
  return `Aprende vocabulario y expresiones esenciales para situaciones cotidianas en inglés.`;
} 