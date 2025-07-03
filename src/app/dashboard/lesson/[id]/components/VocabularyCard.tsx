'use client';

import { useState } from 'react';
import { SpeakerWaveIcon } from '@heroicons/react/24/outline';

interface VocabWord {
  word: string;
  pronunciation: string;
  definition: string;
  example: string;
  translation: string;
}

interface VocabularyCardProps {
  word: VocabWord;
  wordIndex: number;
  totalWords: number;
}

export default function VocabularyCard({ word, wordIndex, totalWords }: VocabularyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);

  const handlePlayPronunciation = () => {
    setPlayingAudio(true);
    // Aquí iría la lógica de Text-to-Speech
    setTimeout(() => setPlayingAudio(false), 2000);
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Card Container */}
      <div className="relative h-96 perspective-1000 group">
        <div 
          className={`relative w-full h-full duration-700 transform-style-preserve-3d cursor-pointer transition-all hover:scale-105 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleCardFlip}
        >
          {/* Front Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 h-full flex flex-col justify-center items-center p-8 bg-gradient-to-br from-white to-orange-50 group-hover:shadow-3xl transition-all duration-300">
              {/* Word */}
              <div className="text-center mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300">
                  {word.word}
                </h1>
                
                {/* Pronunciation */}
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <p className="text-lg text-gray-600 font-mono transition-all duration-300">
                    {word.pronunciation}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPronunciation();
                    }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform ${
                      playingAudio
                        ? 'bg-orange-600 text-white scale-110 shadow-lg'
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200 hover:scale-105 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {playingAudio ? (
                      <div className="flex space-x-1">
                        <div className="w-1 h-4 bg-white rounded animate-bounce"></div>
                        <div className="w-1 h-4 bg-white rounded animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1 h-4 bg-white rounded animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    ) : (
                      <SpeakerWaveIcon className="w-6 h-6" />
                    )}
                  </button>
                </div>

                {/* Translation Badge */}
                <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  {word.translation}
                </div>
              </div>

              {/* Flip Instruction */}
              <div className="text-center mt-8">
                <div className="bg-gray-100 rounded-lg p-3 inline-flex items-center space-x-2 hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                  <svg className="w-5 h-5 text-gray-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm text-gray-600">Toca para ver definición</span>
                </div>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 h-full flex flex-col p-8 bg-gradient-to-br from-blue-50 to-purple-50 group-hover:shadow-3xl transition-all duration-300">
              {/* Definition Section */}
              <div className="flex-1 flex flex-col justify-center space-y-6">
                <div className="transform transition-all duration-500 hover:translate-y-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Definition
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {word.definition}
                  </p>
                </div>

                {/* Example Section */}
                <div className="transform transition-all duration-500 hover:translate-y-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                    <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Example
                  </h3>
                  <div className="bg-white rounded-xl p-4 border-l-4 border-green-500 shadow-sm hover:shadow-md transition-all duration-300">
                    <p className="text-gray-800 italic text-lg">
                      &ldquo;{word.example}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Flip Back Instruction */}
              <div className="text-center mt-6">
                <div className="bg-gray-100 rounded-lg p-3 inline-flex items-center space-x-2 hover:bg-gray-200 transition-all duration-300 transform hover:scale-105">
                  <svg className="w-5 h-5 text-gray-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm text-gray-600">Toca para volver</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h5 className="font-semibold text-yellow-800 mb-2">Tip de Aprendizaje</h5>
            <p className="text-yellow-700 text-sm">
              Repite la pronunciación en voz alta y trata de crear tu propia oración usando esta palabra. 
              ¡La práctica activa mejora la retención!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// CSS personalizado para las transformaciones 3D
const styles = `
  .perspective-1000 {
    perspective: 1000px;
  }
  
  .transform-style-preserve-3d {
    transform-style: preserve-3d;
  }
  
  .backface-hidden {
    backface-visibility: hidden;
  }
  
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
`;

// Agregar estilos al head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
} 