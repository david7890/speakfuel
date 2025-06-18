// Tipos para las transcripciones de audio
export interface TranscriptSegment {
  text: string;
  startTime: number;
  endTime: number;
}

// Tipo para el contenido principal de la lección
export interface MainArticleData {
  title: string;
  content: string;
  audioUrl: string;
  duration: number;
  featuredImage?: string;
}

// Tipo para las palabras de vocabulario
export interface VocabWord {
  word: string;
  pronunciation: string;
  definition: string;
  example: string;
  translation: string;
  audioUrl?: string;
}

// Tipo para la sección de vocabulario
export interface VocabularyData {
  words: VocabWord[];
}

// Tipo para la mini historia
export interface MiniStoryData {
  title: string;
  story: string;
  audioUrl: string;
  duration: number;
  featuredImage?: string;
}

// Tipo para las preguntas
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Tipo para la sección de preguntas
export interface QuestionsData {
  title: string;
  audioUrl: string;
  duration: number;
  featuredImage?: string;
}

// Tipo para una lección completa
export interface LessonData {
  id: number;
  title: string;
  description: string;
  mainArticle: MainArticleData;
  vocabulary: VocabularyData;
  miniStory: MiniStoryData;
  questions: QuestionsData;
}

// Tipo para el índice de lecciones
export interface LessonIndex {
  id: number;
  title: string;
  description: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: number; // en minutos
}

// Tipos para las transcripciones separadas
export interface TranscriptData {
  lessonId: number;
  section: 'main' | 'ministory' | 'questions';
  segments: TranscriptSegment[];
} 