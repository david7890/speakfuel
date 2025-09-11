'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, SpeakerWaveIcon, AcademicCapIcon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { Word, WordCategory, FlashcardProps, QuizQuestion, QuizResult } from '@/types/frequent-words';
import verbsData from '@/data/frequent-words/verbs.json';
import adjectivesData from '@/data/frequent-words/adjectives.json';
import nounsData from '@/data/frequent-words/nouns.json';
import { motion, AnimatePresence } from 'framer-motion';

// Componente de Flashcard

function Flashcard({ word, isFlipped, onFlip, onPlayAudio }: FlashcardProps) {
  return (
    <motion.div 
      className="relative w-full h-40 sm:h-48 cursor-pointer perspective-1000"
      onClick={onFlip}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className={`
        absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d
        ${isFlipped ? 'rotate-y-180' : ''}
      `}>
        {/* Cara frontal */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg flex flex-col items-center justify-center text-white p-3 sm:p-6">
          <h3 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-3">{word.english}</h3>
          <p className="text-sm sm:text-lg mb-2 sm:mb-4 text-blue-100">{word.ipa}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayAudio();
            }}
            className="bg-white/20 hover:bg-white/30 p-2 sm:p-3 rounded-full transition-colors duration-200"
          >
            <SpeakerWaveIcon className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
          <p className="text-xs sm:text-sm mt-2 sm:mt-3 text-blue-100 opacity-75 text-center">Toca para ver la traducción</p>
        </div>
        
        {/* Cara trasera */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg flex flex-col items-center justify-center text-white p-3 sm:p-6">
          <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">{word.english}</h3>
          <p className="text-base sm:text-xl text-center font-medium px-2">{word.spanish}</p>
          <p className="text-xs sm:text-sm mt-2 sm:mt-4 text-emerald-100 opacity-75 text-center">Toca para volver</p>
        </div>
      </div>
    </motion.div>
  );
}

// Componente principal
export default function PalabrasFrecuentesPage() {
  const router = useRouter();
  const [currentCategory, setCurrentCategory] = useState('verbs');
  const [currentBlock, setCurrentBlock] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | 'fade'>('right');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Estados del quiz
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [quizPhase, setQuizPhase] = useState<'translation' | 'audio' | 'completed'>('translation');
  
  // Datos de categorías
  const categories = {
    verbs: verbsData,
    adjectives: adjectivesData,
    nouns: nounsData
  };
  
  const currentCategoryData = categories[currentCategory as keyof typeof categories];
  const wordsPerBlock = 8;
  const totalBlocks = Math.ceil(currentCategoryData.words.length / wordsPerBlock);
  const currentWords = currentCategoryData.words.slice(
    currentBlock * wordsPerBlock,
    (currentBlock + 1) * wordsPerBlock
  );

  const handleCardFlip = (cardIndex: number) => {
    const newFlippedCards = new Set(flippedCards);
    if (flippedCards.has(cardIndex)) {
      newFlippedCards.delete(cardIndex);
    } else {
      newFlippedCards.add(cardIndex);
    }
    setFlippedCards(newFlippedCards);
  };

  const handlePlayAudio = async (word: string) => {
    try {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error al reproducir audio:', error);
    }
  };

  const goToNextBlock = () => {
    if (currentBlock < totalBlocks - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setAnimationDirection('right');
      setCurrentBlock(currentBlock + 1);
      setFlippedCards(new Set());
      // Resetear isTransitioning después de la animación
      setTimeout(() => setIsTransitioning(false), 100);
    }
  };

  const goToPreviousBlock = () => {
    if (currentBlock > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setAnimationDirection('left');
      setCurrentBlock(currentBlock - 1);
      setFlippedCards(new Set());
      // Resetear isTransitioning después de la animación
      setTimeout(() => setIsTransitioning(false), 100);
    }
  };

  const handleCategoryChange = (category: string) => {
    if (category !== currentCategory && !isTransitioning) {
      setIsTransitioning(true);
      setAnimationDirection('fade');
      setCurrentCategory(category);
      setCurrentBlock(0);
      setFlippedCards(new Set());
      // Resetear isTransitioning después de la animación
      setTimeout(() => setIsTransitioning(false), 100);
    }
  };

  // Funciones del Quiz
  const generateWrongOptions = (correctAnswer: string, allWords: Word[], count: number = 3): string[] => {
    const wrongOptions: string[] = [];
    const availableWords = allWords.filter(w => w.spanish !== correctAnswer);
    
    while (wrongOptions.length < count && availableWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      const option = availableWords[randomIndex].spanish;
      
      if (!wrongOptions.includes(option)) {
        wrongOptions.push(option);
      }
      availableWords.splice(randomIndex, 1);
    }
    
    return wrongOptions;
  };

  const generateTranslationQuestions = (words: Word[], count: number = 5): QuizQuestion[] => {
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledWords.slice(0, count);
    
    return selectedWords.map(word => {
      const wrongOptions = generateWrongOptions(word.spanish, words);
      const allOptions = [word.spanish, ...wrongOptions].sort(() => Math.random() - 0.5);
      
      return {
        word,
        options: allOptions,
        correctAnswer: word.spanish,
        type: 'translation' as const
      };
    });
  };

  const generateAudioQuestions = (words: Word[], count: number = 5): QuizQuestion[] => {
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledWords.slice(0, count);
    
    return selectedWords.map(word => {
      const wrongOptions = words
        .filter(w => w.english !== word.english)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.english);
      
      const allOptions = [word.english, ...wrongOptions].sort(() => Math.random() - 0.5);
      
      return {
        word,
        options: allOptions,
        correctAnswer: word.english,
        type: 'audio' as const
      };
    });
  };

  const startQuiz = () => {
    const translationQuestions = generateTranslationQuestions(currentCategoryData.words);
    setQuizQuestions(translationQuestions);
    setCurrentQuestionIndex(0);
    setQuizResults([]);
    setQuizPhase('translation');
    setSelectedAnswer(null);
    setShowQuiz(true);
  };

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      // Respuesta correcta - guardar resultado y avanzar
      const result: QuizResult = {
        question: currentQuestion,
        userAnswer: answer,
        isCorrect: true
      };
      
      setQuizResults(prev => [...prev, result]);
      setSelectedAnswer(answer);
      
      // Avanzar automáticamente después de 1 segundo
      setTimeout(() => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedAnswer(null);
        } else {
          // Terminar fase actual
          if (quizPhase === 'translation') {
            // Iniciar fase de audio
            const audioQuestions = generateAudioQuestions(currentCategoryData.words);
            setQuizQuestions(audioQuestions);
            setCurrentQuestionIndex(0);
            setQuizPhase('audio');
            setSelectedAnswer(null);
          } else {
            // Quiz completado
            setQuizPhase('completed');
          }
        }
      }, 1000);
    } else {
      // Respuesta incorrecta - mostrar feedback pero no avanzar
      setSelectedAnswer(answer);
      
      // Resetear la selección después de un momento para permitir otro intento
      setTimeout(() => {
        setSelectedAnswer(null);
      }, 800);
    }
  };

  const closeQuiz = () => {
    setShowQuiz(false);
    setQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setQuizResults([]);
    setSelectedAnswer(null);
    setQuizPhase('translation');
  };

  // Variantes de animación
  const containerVariants = {
    enter: (direction: string) => ({
      x: direction === 'right' ? 1000 : direction === 'left' ? -1000 : 0,
      opacity: direction === 'fade' ? 0 : 1,
      scale: direction === 'fade' ? 0.8 : 1,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: string) => ({
      x: direction === 'right' ? -1000 : direction === 'left' ? 1000 : 0,
      opacity: direction === 'fade' ? 0 : 1,
      scale: direction === 'fade' ? 0.8 : 1,
    }),
  };

  const cardVariants = {
    enter: {
      opacity: 0,
      y: 50,
      scale: 0.8,
    },
    center: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.8,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Botón de regreso */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Volver al Dashboard</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
            Las 300 Palabras Más Usadas en Inglés
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 px-2">
            Domina el inglés con flashcards interactivas
          </p>
          
          {/* Selector de categorías */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg p-1 shadow-md flex flex-wrap justify-center gap-1 sm:gap-0">
               <button 
                 onClick={() => handleCategoryChange('verbs')}
                 disabled={isTransitioning}
                 className={`px-3 sm:px-6 py-2 rounded-md font-medium text-xs sm:text-base transition-all duration-200 flex-1 sm:flex-none ${
                   currentCategory === 'verbs' 
                     ? 'bg-blue-500 text-white' 
                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                 } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                 Verbos
               </button>
               <button 
                 onClick={() => handleCategoryChange('adjectives')}
                 disabled={isTransitioning}
                 className={`px-3 sm:px-6 py-2 rounded-md font-medium text-xs sm:text-base transition-all duration-200 flex-1 sm:flex-none ${
                   currentCategory === 'adjectives' 
                     ? 'bg-blue-500 text-white' 
                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                 } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                 Adjetivos
               </button>
               <button 
                 onClick={() => handleCategoryChange('nouns')}
                 disabled={isTransitioning}
                 className={`px-3 sm:px-6 py-2 rounded-md font-medium text-xs sm:text-base transition-all duration-200 flex-1 sm:flex-none ${
                   currentCategory === 'nouns' 
                     ? 'bg-blue-500 text-white' 
                     : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                 } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                 Sustantivos
               </button>
            </div>
          </div>
          
          {/* Botón de Quiz */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-lg p-1 shadow-md w-full max-w-md">
              <button
                onClick={startQuiz}
                disabled={isTransitioning}
                className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <AcademicCapIcon className="w-5 h-5" />
                Iniciar quiz de {currentCategoryData.name}
              </button>
            </div>
          </div>
        </div>

        {/* Navegación de bloques - Mobile First */}
        <div className="mb-6 sm:mb-8">
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center justify-between gap-4">
            <button
              onClick={goToPreviousBlock}
              disabled={currentBlock === 0 || isTransitioning}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 text-base"
            >
              <ChevronLeftIcon className="w-5 h-5" />
              Anterior
            </button>
            
            <div className="flex flex-col items-center gap-2">
              <span className="text-lg font-medium text-gray-700 text-center">
                Bloque {currentBlock + 1} de {totalBlocks}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: totalBlocks }, (_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full ${
                      i === currentBlock ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <button
              onClick={goToNextBlock}
              disabled={currentBlock === totalBlocks - 1 || isTransitioning}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 text-base"
            >
              Siguiente
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Navigation - Top */}
          <div className="flex sm:hidden items-center justify-between mb-4">
            <button
              onClick={goToPreviousBlock}
              disabled={currentBlock === 0 || isTransitioning}
              className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
            </button>
            
            <div className="flex flex-col items-center gap-2">
              <span className="text-base font-medium text-gray-700">
                {currentBlock + 1} de {totalBlocks}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalBlocks, 8) }, (_, i) => {
                  // Mostrar solo 8 puntos máximo en móvil
                  const showIndex = totalBlocks > 8 ? 
                    Math.floor((i / 7) * (totalBlocks - 1)) : i;
                  return (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        showIndex === currentBlock ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
            
            <button
              onClick={goToNextBlock}
              disabled={currentBlock === totalBlocks - 1 || isTransitioning}
              className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Grid de Flashcards */}
        <AnimatePresence mode="wait" custom={animationDirection}>
          <motion.div
            key={`${currentCategory}-${currentBlock}`}
            custom={animationDirection}
            variants={containerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 25,
              duration: 0.3
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
          >
            {currentWords.map((word, index) => (
              <motion.div
                key={`${currentCategory}-${currentBlock}-${index}`}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
                  type: "spring" as const,
                  stiffness: 150,
                  damping: 20,
                }}
              >
                <Flashcard
                  word={word}
                  isFlipped={flippedCards.has(index)}
                  onFlip={() => handleCardFlip(index)}
                  onPlayAudio={() => handlePlayAudio(word.english)}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Mobile Navigation - Bottom */}
        <div className="flex sm:hidden items-center justify-center gap-8 mb-8">
          <button
            onClick={goToPreviousBlock}
            disabled={currentBlock === 0 || isTransitioning}
            className="flex items-center justify-center w-14 h-14 bg-blue-500 text-white rounded-full shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 hover:bg-blue-600 transition-all duration-200 active:scale-95"
          >
            <ChevronLeftIcon className="w-7 h-7" />
          </button>
          
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs text-gray-500 uppercase font-medium tracking-wide">
              {currentCategoryData.name}
            </div>
            <div className="text-sm font-semibold text-gray-700">
              {currentBlock + 1} / {totalBlocks}
            </div>
          </div>
          
          <button
            onClick={goToNextBlock}
            disabled={currentBlock === totalBlocks - 1 || isTransitioning}
            className="flex items-center justify-center w-14 h-14 bg-blue-500 text-white rounded-full shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 hover:bg-blue-600 transition-all duration-200 active:scale-95"
          >
            <ChevronRightIcon className="w-7 h-7" />
          </button>
        </div>

        {/* Progreso del bloque actual */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              {currentCategoryData.name} - Bloque {currentBlock + 1}
            </h3>
            <span className="text-sm text-gray-600">
              {flippedCards.size} de {currentWords.length} palabras revisadas
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(flippedCards.size / currentWords.length) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Total: {currentCategoryData.words.length} {currentCategoryData.name.toLowerCase()}
          </div>
        </div>
      </div>
      
      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {quizPhase === 'completed' ? (
              // Pantalla de resultados
              <div className="p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Quiz Completado!</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Respondiste {quizResults.filter(r => r.isCorrect).length} de {quizResults.length} preguntas correctamente
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={startQuiz}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    Reintentar
                  </button>
                  <button
                    onClick={closeQuiz}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : (
              // Pregunta actual
              <div className="p-6">
                <div className="flex justify-end items-center mb-6">
                  <button
                    onClick={closeQuiz}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                

                {quizQuestions[currentQuestionIndex] && (
                  <div>
                    <div className="text-center mb-8">
                      {quizQuestions[currentQuestionIndex].type === 'translation' ? (
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-4">
                            ¿Cuál es la traducción de:
                          </h3>
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {quizQuestions[currentQuestionIndex].word.english}
                          </div>
                          <div className="text-lg text-gray-500">
                            {quizQuestions[currentQuestionIndex].word.ipa}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-4">
                            Escucha y elige la palabra correcta:
                          </h3>
                          <button
                            onClick={() => handlePlayAudio(quizQuestions[currentQuestionIndex].word.english)}
                            className="flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors mx-auto mb-4"
                          >
                            <SpeakerWaveIcon className="w-8 h-8" />
                          </button>
                          <p className="text-sm text-gray-500">Haz clic para reproducir de nuevo</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {quizQuestions[currentQuestionIndex].options.map((option, index) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrect = option === quizQuestions[currentQuestionIndex].correctAnswer;
                        const showResult = selectedAnswer !== null;
                        const selectedAnswerIsCorrect = selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer;

                        return (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(option)}
                            disabled={selectedAnswer !== null && selectedAnswerIsCorrect}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 font-medium ${
                              !showResult
                                ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                : isSelected && isCorrect
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : isSelected && !isCorrect
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            } ${(selectedAnswer !== null && selectedAnswerIsCorrect) ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Estilos CSS personalizados para el efecto 3D */}
      <style jsx>{`
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
      `}</style>
    </div>
  );
}
