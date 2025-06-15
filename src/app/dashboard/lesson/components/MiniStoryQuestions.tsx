'use client';

import { useState, useEffect, useRef } from 'react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface MiniStoryQuestionsProps {
  data: {
    questions: Question[];
    // Nueva estructura para seguir el diseño de MainArticle
    featuredImage?: string;
    audioUrl?: string;
    duration?: number;
    title?: string;
  };
  isTransitioning: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export default function MiniStoryQuestions({ data }: MiniStoryQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showExplanation, setShowExplanation] = useState<{ [key: number]: boolean }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(data.duration || 0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentQuestion = data.questions[currentQuestionIndex];
  const totalQuestions = data.questions.length;
  const mockDuration = data.duration || 20;
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

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    if (selectedAnswers[questionId] !== undefined) return;

    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));

    setTimeout(() => {
      setShowExplanation(prev => ({
        ...prev,
        [questionId]: true
      }));
    }, 500);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const getOptionStyle = (questionId: number, optionIndex: number) => {
    const selectedAnswer = selectedAnswers[questionId];
    const correctAnswer = currentQuestion.correctAnswer;
    const isSelected = selectedAnswer === optionIndex;
    const isCorrect = optionIndex === correctAnswer;
    const hasAnswered = selectedAnswer !== undefined;

    if (!hasAnswered) {
      return "bg-white border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer";
    }

    if (isSelected && isCorrect) {
      return "bg-green-100 border-2 border-green-500 text-green-800";
    }

    if (isSelected && !isCorrect) {
      return "bg-red-100 border-2 border-red-500 text-red-800";
    }

    if (!isSelected && isCorrect) {
      return "bg-green-50 border-2 border-green-300 text-green-700";
    }

    return "bg-gray-50 border-2 border-gray-200 text-gray-600";
  };

  const getScore = () => {
    let correct = 0;
    data.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  if (isCompleted) {
    const score = getScore();
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-nunito">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">¡Preguntas Completadas!</h2>
              <p className="text-purple-100">Excelente comprensión de la historia</p>
            </div>
          </div>

          <div className="p-8 text-center">
            <div className="mb-8">
              <div className="text-4xl font-bold text-gray-900 mb-2">{score}/{totalQuestions}</div>
              <div className="text-lg text-gray-600 mb-4">Respuestas Correctas</div>
              
              <div className={`p-6 rounded-xl ${percentage >= 70 ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border`}>
                <div className="text-lg font-semibold mb-2">
                  {percentage >= 70 ? '🎉 ¡Excelente!' : '👍 ¡Buen trabajo!'}
                </div>
                <p className="text-gray-700">
                  {percentage >= 70 
                    ? '¡Tienes una excelente comprensión de la historia!'
                    : 'Has entendido bien la historia. ¡Sigue practicando!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-nunito">
      {/* Layout Móvil - Tarjeta horizontal compacta */}
      <div className="lg:hidden mb-4 mx-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex p-4 gap-4">
            {/* Imagen cuadrada - 50% del ancho */}
            <div className="w-1/2 aspect-square bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden rounded-xl flex-shrink-0">
              <img 
                src={featuredImage} 
                alt={data.title || "Comprensión de lectura"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(`
                    <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style="stop-color:#9333EA;stop-opacity:1" />
                          <stop offset="100%" style="stop-color:#DB2777;stop-opacity:1" />
                        </linearGradient>
                      </defs>
                      <rect width="400" height="400" fill="url(#grad)"/>
                      <text x="200" y="200" text-anchor="middle" fill="white" font-size="20" font-family="system-ui">
                        ❓ Questions
                      </text>
                    </svg>
                  `)}`;
                }}
              />
            </div>
            
            {/* Contenido derecho - 50% del ancho */}
            <div className="w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Questions</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-3">
                  Pregunta {currentQuestionIndex + 1} de {totalQuestions}
                </h3>
              </div>
              
              {/* Reproductor compacto en la parte inferior */}
              <div className="mt-3">
                {/* Botones de control */}
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <button
                    onClick={() => {
                      setCurrentTime(0);
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                      }
                    }}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 shadow-sm"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                    </svg>
                  </button>

                  <button
                    onClick={togglePlayPause}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                      isPlaying 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-white text-purple-600 hover:bg-gray-50 border border-purple-200'
                    }`}
                  >
                    {isPlaying ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
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
                      className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
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
          
          {/* Layout principal - Desktop: imagen+reproductor | preguntas */}
          <div className="px-6 sm:px-8 pt-8 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Columna izquierda: Imagen y Reproductor */}
            <div className="space-y-6">
              {/* Imagen destacada */}
              <div className="relative h-64 sm:h-72 lg:h-64 bg-gradient-to-br from-purple-100 to-pink-100 overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                <img 
                  src={featuredImage} 
                  alt={data.title || "Comprensión de lectura"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback a imagen generada
                    e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(`
                      <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#9333EA;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#DB2777;stop-opacity:1" />
                          </linearGradient>
                        </defs>
                        <rect width="800" height="400" fill="url(#grad)"/>
                        <text x="400" y="200" text-anchor="middle" fill="white" font-size="24" font-family="system-ui">
                          ❓ Questions
                        </text>
                </svg>
                    `)}`;
                  }}
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-800">Comprensión</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reproductor de audio - Layout diferente para móvil vs desktop */}
              <div className="lg:bg-gradient-to-r lg:from-purple-50 lg:to-pink-50 lg:rounded-2xl lg:p-6 lg:border lg:border-purple-100">
                
                {/* Layout Desktop - Vertical */}
                <div className="hidden lg:block">
                  {/* Botones de control - Centrados arriba */}
                  <div className="flex justify-center items-center space-x-2 mb-4">
                    {/* Botón anterior */}
                    <button
                      onClick={() => {
                        setCurrentTime(0);
                        if (audioRef.current) {
                          audioRef.current.currentTime = 0;
                        }
                      }}
                      className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                      </svg>
                    </button>

                    {/* Botón de reproducir/pausar */}
                    <button
                      onClick={togglePlayPause}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg ${
                        isPlaying 
                          ? 'bg-purple-600 text-white hover:bg-purple-700' 
                          : 'bg-white text-purple-600 hover:bg-gray-50 border-2 border-purple-200'
                      }`}
                    >
                      {isPlaying ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
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
                        className="h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
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
                          className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                          style={{ width: `${(currentTime / mockDuration) * 100}%` }}
                        >
                        </div>
                      </div>
                    </div>

                    {/* Botones de control - Lado derecho */}
                    <div className="flex items-center space-x-1">
                      {/* Botón anterior */}
                      <button
                        onClick={() => {
                          setCurrentTime(0);
                          if (audioRef.current) {
                            audioRef.current.currentTime = 0;
                          }
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200 shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                        </svg>
                      </button>

                      {/* Botón de play/pause */}
                      <button
                        onClick={togglePlayPause}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg ${
                          isPlaying 
                            ? 'bg-purple-600 text-white hover:bg-purple-700' 
                            : 'bg-white text-purple-600 hover:bg-gray-50 border-2 border-purple-200'
                        }`}
                      >
                        {isPlaying ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha: Preguntas y navegación */}
            <div className="lg:h-[600px] flex flex-col">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Comprensión de Lectura
                  </div>
                  <div className="text-sm text-purple-600 font-medium bg-purple-100 px-3 py-1 rounded-full">
              {currentQuestionIndex + 1} de {totalQuestions}
                  </div>
                </h3>
                
                <div className="flex-1 overflow-y-auto space-y-6">
                  {/* Question */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-6">
                      {currentQuestion.question}
                    </h4>

                    {/* Options */}
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                          disabled={selectedAnswers[currentQuestion.id] !== undefined}
                          className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${getOptionStyle(currentQuestion.id, index)}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span>{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Explanation */}
                  {showExplanation[currentQuestion.id] && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-semibold text-blue-800 mb-2">Explicación</h5>
                          <p className="text-blue-700 text-sm">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                {selectedAnswers[currentQuestion.id] !== undefined && (
                  <div className="flex justify-center mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleNextQuestion}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {currentQuestionIndex === totalQuestions - 1 ? 'Terminar' : 'Siguiente Pregunta'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

          {/* Audio element oculto */}
          <audio
            ref={audioRef}
            src={data.audioUrl || "/api/audio/sample-questions.mp3"}
            onEnded={() => {
              setIsPlaying(false);
              setCurrentTime(0);
            }}
          />
        </div>
      </div>

      {/* Contenido móvil - Preguntas debajo de la tarjeta */}
      <div className="lg:hidden mx-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Comprensión de Lectura
            </div>
            <div className="text-sm text-purple-600 font-medium bg-purple-100 px-3 py-1 rounded-full">
              {currentQuestionIndex + 1} de {totalQuestions}
            </div>
            </h3>
          
          <div className="space-y-6">
            {/* Question */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-6">
                {currentQuestion.question}
              </h4>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                  disabled={selectedAnswers[currentQuestion.id] !== undefined}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${getOptionStyle(currentQuestion.id, index)}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Explanation */}
          {showExplanation[currentQuestion.id] && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-semibold text-blue-800 mb-2">Explicación</h5>
                  <p className="text-blue-700 text-sm">{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          {selectedAnswers[currentQuestion.id] !== undefined && (
              <div className="flex justify-center pt-6 border-t border-gray-200">
              <button
                onClick={handleNextQuestion}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Terminar' : 'Siguiente Pregunta'}
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
} 