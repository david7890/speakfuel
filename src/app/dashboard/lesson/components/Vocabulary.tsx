'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface VocabWord {
  word: string;
  pronunciation: string;
  definition: string;
  example: string;
  translation: string;
}

interface VocabularyProps {
  data: {
    words: VocabWord[];
  };
  isTransitioning: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Vocabulary({ data }: VocabularyProps) {
  const router = useRouter();
  const params = useParams();
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const handlePlayPronunciation = (word: string) => {
    setPlayingAudio(word);
    // Aquí iría la lógica de Text-to-Speech
    setTimeout(() => setPlayingAudio(null), 1500);
  };

  const handleGoToVocabularyPage = () => {
    router.push(`/dashboard/lesson/${params.id}/vocabulary`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Vocabulario</h2>
              <p className="text-orange-100">Aprende palabras clave de la lección</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Tip y Botón de Estudio Enfocado */}
          <div className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-semibold text-orange-800 mb-2">Estudio Enfocado</h5>
                  <p className="text-orange-700 text-sm">
                    Para una mejor concentración, practica cada palabra individualmente en modo carrusel.
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleGoToVocabularyPage}
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 self-start lg:self-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-medium">Modo Enfocado</span>
              </button>
            </div>
          </div>

          {/* Vocabulary Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.words.map((word, index) => (
              <div
                key={index}
                className={`bg-white border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedWord === index 
                    ? 'border-orange-500 shadow-lg bg-orange-50' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
                onClick={() => setSelectedWord(selectedWord === index ? null : index)}
              >
                {/* Word Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {word.word}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPronunciation(word.word);
                    }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      playingAudio === word.word
                        ? 'bg-orange-600 text-white'
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    }`}
                  >
                    {playingAudio === word.word ? (
                      <div className="flex space-x-1">
                        <div className="w-1 h-3 bg-white rounded animate-pulse"></div>
                        <div className="w-1 h-3 bg-white rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1 h-3 bg-white rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.586 17H2v-6h2.586L12 3.586z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Pronunciation */}
                <p className="text-sm text-gray-600 mb-3 font-mono">
                  {word.pronunciation}
                </p>

                {/* Translation Badge */}
                <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-3 py-1 rounded-full mb-4">
                  {word.translation}
                </div>

                {/* Expanded Content */}
                {selectedWord === index && (
                  <div className="mt-4 pt-4 border-t border-orange-200 space-y-4">
                    {/* Definition */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Definition:</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {word.definition}
                      </p>
                    </div>

                    {/* Example */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Example:</h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-800 text-sm italic">
                          &ldquo;{word.example}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expand Indicator */}
                <div className="flex justify-center mt-4">
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      selectedWord === index ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{data.words.length}</div>
                <div className="text-sm text-gray-600">Nuevas Palabras</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">100%</div>
                <div className="text-sm text-gray-600">Con Pronunciación</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">✓</div>
                <div className="text-sm text-gray-600">Con Ejemplos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">ES</div>
                <div className="text-sm text-gray-600">Traducido</div>
              </div>
            </div>
          </div>

          {/* Practice Suggestion */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h5 className="font-semibold text-blue-800 mb-2">Sugerencia de Práctica</h5>
                <p className="text-blue-700 text-sm">
                  Intenta crear una oración usando al menos 3 de estas palabras. 
                  Escríbela en tu cuaderno o practícala en voz alta. ¡La práctica hace al maestro!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 