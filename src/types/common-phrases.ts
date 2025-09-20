export interface Phrase {
  english: string;
  spanish: string;
}

export interface PhraseCategory {
  category: string;
  name: string;
  description: string;
  phrases: Phrase[];
}

export interface PhraseCardProps {
  phrase: Phrase;
  isFlipped: boolean;
  onFlip: () => void;
  onPlayAudio: () => void;
}

export interface CommonPhrasesPageProps {
  initialBlock?: number;
}
