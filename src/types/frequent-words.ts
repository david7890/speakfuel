export interface Word {
  english: string;
  ipa: string;
  spanish: string;
  audioUrl?: string | null;
}

export interface WordCategory {
  category: string;
  name: string;
  description: string;
  words: Word[];
}

export interface FlashcardProps {
  word: Word;
  isFlipped: boolean;
  onFlip: () => void;
  onPlayAudio: () => void;
}

export interface FrequentWordsPageProps {
  initialCategory?: string;
}

export interface QuizQuestion {
  word: Word;
  options: string[];
  correctAnswer: string;
  type: 'translation' | 'audio';
}

export interface QuizResult {
  question: QuizQuestion;
  userAnswer: string;
  isCorrect: boolean;
}
