'use client';

import { useState, useEffect, useRef } from 'react';
import { PlayIcon, PauseIcon, BackwardIcon } from '@heroicons/react/24/solid';

interface MainArticleProps {
  data: {
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
  };
  isTransitioning: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export default function MainArticle({ data, onNext, onPrevious }: MainArticleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(data.duration || 0);
  const [currentTranscriptIndex, setCurrentTranscriptIndex] = useState(-1);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Mock data para demostración
  const mockTranscript = data.transcript || [
    { text: "Welcome to today's lesson about coffee shop culture.", startTime: 0, endTime: 3.5 },
    { text: "Coffee shops have become an integral part of modern social life.", startTime: 3.5, endTime: 7.2 },
    { text: "They serve as meeting places, workspaces, and quiet retreats.", startTime: 7.2, endTime: 11.8 },
    { text: "The atmosphere of a coffee shop plays a crucial role in creating community.", startTime: 11.8, endTime: 16.5 },
    { text: "Whether you're meeting a friend or working on a project, coffee shops offer a unique space.", startTime: 16.5, endTime: 22.0 },
  ];

  const mockDuration = data.duration || 25;
  const featuredImage = data.featuredImage || "/api/placeholder/800/400";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        }
      };
    }
  }, []);

  // Simulación de audio si no hay archivo real
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= mockDuration) {
            setIsPlaying(false);
            setCurrentTranscriptIndex(-1);
            setCurrentWordIndex(-1);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, mockDuration]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      
      // Encontrar la frase actual en la transcripción
      const transcriptIndex = mockTranscript.findIndex(
        item => time >= item.startTime && time < item.endTime
      );
      setCurrentTranscriptIndex(transcriptIndex);

      // Simular resaltado de palabra (simplificado)
      if (transcriptIndex >= 0) {
        const phrase = mockTranscript[transcriptIndex];
        const phraseProgress = (time - phrase.startTime) / (phrase.endTime - phrase.startTime);
        const words = phrase.text.split(' ');
        const wordIndex = Math.floor(phraseProgress * words.length);
        setCurrentWordIndex(wordIndex);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderTranscriptWord = (word: string, wordIndex: number, phraseIndex: number) => {
    const isCurrentPhrase = phraseIndex === currentTranscriptIndex;
    const isCurrentWord = isCurrentPhrase && wordIndex === currentWordIndex;
    const isPreviousPhrase = phraseIndex < currentTranscriptIndex;

    return (
      <span
        key={`${phraseIndex}-${wordIndex}`}
        className={`transition-all duration-300 ${
          isCurrentWord
            ? 'bg-blue-200 text-blue-900 font-semibold px-1 py-0.5 rounded-md shadow-sm'
            : isCurrentPhrase
            ? 'text-gray-900 font-medium'
            : isPreviousPhrase
            ? 'text-gray-400'
            : 'text-gray-600'
        }`}
      >
        {word}
      </span>
    );
  };

  return (
    <div className="font-nunito" style={{paddingBottom: '120px'}}>
      {/* Layout Móvil - Tarjeta horizontal compacta */}
      <div className="lg:hidden mb-4 mx-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex p-4 gap-4">
            {/* Imagen cuadrada - 50% del ancho */}
            <div className="w-1/2 aspect-square bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden rounded-xl flex-shrink-0">
              <img 
                src={featuredImage} 
                alt={data.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(`
                    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
                          <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
                        </linearGradient>
                      </defs>
                      <rect width="400" height="400" fill="url(#grad)"/>
                      <text x="200" y="200" text-anchor="middle" fill="white" font-size="20" font-family="system-ui">
                        🎧 ${data.title}
                      </text>
                    </svg>
                  `)}`;
                }}
              />
            </div>
            
            {/* Contenido derecho - 50% del ancho */}
            <div className="w-1/2 flex flex-col justify-center">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Main Article</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2">
                  {data.title}
                </h3>
              </div>
              
              {/* Reproductor compacto centrado */}
              <div>
                {/* Botones de control */}
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <button
                    onClick={() => {
                      setCurrentTime(0);
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                      }
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm hover:scale-105"
                  >
                    <BackwardIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={togglePlayPause}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-105 ${
                      isPlaying 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-white text-blue-600 hover:bg-gray-50 border border-blue-200'
                    }`}
                  >
                    {isPlaying ? (
                      <PauseIcon className="w-6 h-6" />
                    ) : (
                      <PlayIcon className="w-6 h-6" />
                    )}
                  </button>
                </div>
                
                {/* Barra de progreso */}
                <div>
                  <div 
                    className="w-full h-1.5 bg-gray-200 rounded-full cursor-pointer"
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${(currentTime / mockDuration) * 100}%` }}
                    >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layout Desktop - Mantener el diseño actual */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          
          {/* Layout principal - Desktop: imagen+reproductor | transcripción */}
          <div className="px-6 sm:px-8 pt-8 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Columna izquierda: Imagen y Reproductor */}
            <div className="space-y-6">
              {/* Imagen destacada */}
              <div className="relative h-64 sm:h-72 lg:h-64 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                <img 
                  src={featuredImage} 
                  alt={data.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback a imagen generada
                    e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(`
                      <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#60A5FA;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#A855F7;stop-opacity:1" />
                          </linearGradient>
                        </defs>
                        <rect width="800" height="400" fill="url(#grad)"/>
                        <text x="400" y="200" text-anchor="middle" fill="white" font-size="24" font-family="system-ui">
                          ☕ ${data.title}
                        </text>
                      </svg>
                    `)}`;
                  }}
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-800">Audio Story</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reproductor de audio - Layout diferente para móvil vs desktop */}
              <div className="lg:bg-gradient-to-r lg:from-blue-50 lg:to-purple-50 lg:rounded-2xl lg:p-6 lg:border lg:border-blue-100">
                
                {/* Layout Desktop - Vertical */}
                <div className="hidden lg:block">
                  {/* Botones de control - Centrados arriba */}
                  <div className="flex justify-center items-center space-x-4 mb-4">
                    {/* Botón anterior */}
                    <button
                      onClick={() => {
                        setCurrentTime(0);
                        if (audioRef.current) {
                          audioRef.current.currentTime = 0;
                        }
                      }}
                      className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 shadow-lg"
                    >
                      <BackwardIcon className="w-8 h-8" />
                    </button>

                    {/* Botón de reproducir/pausar */}
                    <button
                      onClick={togglePlayPause}
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg ${
                        isPlaying 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-white text-blue-600 hover:bg-gray-50 border-2 border-blue-200'
                      }`}
                    >
                      {isPlaying ? (
                        <PauseIcon className="w-10 h-10" />
                      ) : (
                        <PlayIcon className="w-10 h-10" />
                      )}
                    </button>
                  </div>

                  {/* Barra de progreso */}
                  <div>
                    <div 
                      className="w-full h-3 bg-white rounded-full cursor-pointer shadow-inner"
                      onClick={handleProgressClick}
                    >
                      <div 
                        className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${(currentTime / mockDuration) * 100}%` }}
                      >
                      </div>
                    </div>
                  </div>
                </div>

                {/* Layout Móvil - Horizontal compacto */}
                <div className="lg:hidden">
                  <div className="flex items-center space-x-3 py-2">
                    {/* Barra de progreso - Lado izquierdo */}
                    <div className="flex-1">
                      <div 
                        className="w-full h-2 bg-gray-200 rounded-full cursor-pointer"
                        onClick={handleProgressClick}
                      >
                        <div 
                          className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                          style={{ width: `${(currentTime / mockDuration) * 100}%` }}
                        >
                        </div>
                      </div>
                    </div>

                    {/* Botones de control - Lado derecho */}
                    <div className="flex items-center space-x-2">
                      {/* Botón anterior */}
                      <button
                        onClick={() => {
                          setCurrentTime(0);
                          if (audioRef.current) {
                            audioRef.current.currentTime = 0;
                          }
                        }}
                        className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 shadow-lg"
                      >
                        <BackwardIcon className="w-6 h-6" />
                      </button>

                      {/* Botón de play/pause */}
                      <button
                        onClick={togglePlayPause}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg ${
                          isPlaying 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-white text-blue-600 hover:bg-gray-50 border-2 border-blue-200'
                        }`}
                      >
                        {isPlaying ? (
                          <PauseIcon className="w-7 h-7" />
                        ) : (
                          <PlayIcon className="w-7 h-7" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha: Transcripción */}
            <div className="lg:h-[600px] flex flex-col">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14l-2-16M10 9v6M14 9v6" />
                  </svg>
                  Follow Along
                </h3>
                
                <div className="text-xl leading-relaxed space-y-4 flex-1 overflow-y-auto">
                  {mockTranscript.map((phrase, phraseIndex) => (
                    <p key={phraseIndex} className="transition-all duration-500">
                      {phrase.text.split(' ').map((word, wordIndex) => (
                        <span key={wordIndex}>
                          {renderTranscriptWord(word, wordIndex, phraseIndex)}
                          {wordIndex < phrase.text.split(' ').length - 1 && ' '}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>



          {/* Audio element oculto */}
          <audio
            ref={audioRef}
            src={data.audioUrl || "/api/audio/sample-lesson.mp3"}
            onEnded={() => {
              setIsPlaying(false);
              setCurrentTime(0);
              setCurrentTranscriptIndex(-1);
              setCurrentWordIndex(-1);
            }}
          />
        </div>
      </div>

      {/* Transcripción móvil - Contenido completo debajo de la tarjeta */}
      <div className="lg:hidden mx-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14l-2-16M10 9v6M14 9v6" />
            </svg>
            Follow Along
          </h3>
          
          <div className="text-lg leading-relaxed space-y-4">
            {mockTranscript.map((phrase, phraseIndex) => (
              <p key={phraseIndex} className="transition-all duration-500">
                {phrase.text.split(' ').map((word, wordIndex) => (
                  <span key={wordIndex}>
                    {renderTranscriptWord(word, wordIndex, phraseIndex)}
                    {wordIndex < phrase.text.split(' ').length - 1 && ' '}
                  </span>
                ))}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 