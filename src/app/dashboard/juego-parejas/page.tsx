'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { Word } from '@/types/frequent-words';
import verbsData from '@/data/frequent-words/verbs.json';
import adjectivesData from '@/data/frequent-words/adjectives.json';
import nounsData from '@/data/frequent-words/nouns.json';
import { motion, AnimatePresence } from 'framer-motion';

interface GameWord {
  id: string;
  text: string;
  language: 'spanish' | 'english';
  pairId: string;
  isMatched: boolean;
  isSelected: boolean;
  isCorrect?: boolean;
  showFeedback?: boolean;
}

interface GamePair {
  id: string;
  spanish: string;
  english: string;
}

export default function JuegoParejas() {
  const router = useRouter();
  const [gameWords, setGameWords] = useState<GameWord[]>([]);
  const [selectedWords, setSelectedWords] = useState<GameWord[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [currentPairs, setCurrentPairs] = useState(5); // Show 5 pairs at a time
  const [completedPairs, setCompletedPairs] = useState(0);
  const [totalPairs] = useState(55);
  const [isLoadingNextRound, setIsLoadingNextRound] = useState(false);
  const roundProcessedRef = useRef(false);

  // Combine all word data
  const allWords: Word[] = [
    ...verbsData.words,
    ...adjectivesData.words,
    ...nounsData.words
  ];

  // Store game pairs in state to maintain consistency
  const [gamePairs, setGamePairs] = useState<GamePair[]>([]);

  // Generate game pairs
  const generateGamePairs = (): GamePair[] => {
    const shuffled = [...allWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, totalPairs).map((word, index) => ({
      id: `pair-${index}`,
      spanish: word.spanish,
      english: word.english
    }));
  };

  // Generate words for current round
  const generateRoundWords = (pairs: GamePair[], startIndex: number, count: number): GameWord[] => {
    const currentRoundPairs = pairs.slice(startIndex, startIndex + count);
    
    const words: GameWord[] = [];
    
    currentRoundPairs.forEach(pair => {
      words.push({
        id: `${pair.id}-spanish`,
        text: pair.spanish,
        language: 'spanish',
        pairId: pair.id,
        isMatched: false,
        isSelected: false
      });
      
      words.push({
        id: `${pair.id}-english`,
        text: pair.english,
        language: 'english',
        pairId: pair.id,
        isMatched: false,
        isSelected: false
      });
    });

    // Shuffle Spanish and English words separately
    const spanishWords = words.filter(w => w.language === 'spanish').sort(() => Math.random() - 0.5);
    const englishWords = words.filter(w => w.language === 'english').sort(() => Math.random() - 0.5);
    
    return [...spanishWords, ...englishWords];
  };

  // Initialize game
  useEffect(() => {
    const pairs = generateGamePairs();
    setGamePairs(pairs);
    const roundWords = generateRoundWords(pairs, 0, currentPairs);
    setGameWords(roundWords);
  }, []);

  // Check if current round is complete
  useEffect(() => {
    if (gameWords.length > 0 && 
        gameWords.every(word => word.isMatched) && 
        !isLoadingNextRound && 
        !isGameComplete &&
        !roundProcessedRef.current) {
      
      roundProcessedRef.current = true; // Prevent multiple executions
      
      const currentCompletedPairs = completedPairs + currentPairs;
      console.log('Round complete! CompletedPairs will be:', currentCompletedPairs);
      
      if (currentCompletedPairs < totalPairs) {
        console.log('Loading next round...');
        setIsLoadingNextRound(true);
        
        setTimeout(() => {
          const nextRoundWords = generateRoundWords(gamePairs, currentCompletedPairs, currentPairs);
          setGameWords(nextRoundWords);
          setCompletedPairs(currentCompletedPairs);
          setIsLoadingNextRound(false);
          roundProcessedRef.current = false; // Reset for next round
        }, 2000);
      } else {
        console.log('Game complete!');
        setCompletedPairs(currentCompletedPairs);
        setIsGameComplete(true);
      }
    }
  }, [gameWords, currentPairs, totalPairs, gamePairs, isLoadingNextRound, isGameComplete, completedPairs]);

  // Handle word selection
  const handleWordClick = (clickedWord: GameWord) => {
    if (clickedWord.isMatched || clickedWord.showFeedback) return;

    setGameWords(prev => prev.map(word => 
      word.id === clickedWord.id 
        ? { ...word, isSelected: !word.isSelected }
        : word
    ));

    const newSelectedWords = selectedWords.find(w => w.id === clickedWord.id)
      ? selectedWords.filter(w => w.id !== clickedWord.id)
      : [...selectedWords.filter(w => w.id !== clickedWord.id), clickedWord];

    setSelectedWords(newSelectedWords);

    // Check for match when 2 words are selected
    if (newSelectedWords.length === 2) {
      const [first, second] = newSelectedWords;
      const isMatch = first.pairId === second.pairId && first.language !== second.language;
      
      setAttempts(prev => prev + 1);

      if (isMatch) {
        // Correct match
        setScore(prev => prev + 1);
        setGameWords(prev => prev.map(word => 
          word.pairId === first.pairId 
            ? { ...word, isMatched: true, isSelected: false, isCorrect: true, showFeedback: true }
            : word
        ));
        
        setTimeout(() => {
          // Remove the feedback
          setGameWords(prev => prev.map(word => 
            word.pairId === first.pairId 
              ? { ...word, showFeedback: false }
              : word
          ));
        }, 1500);
      } else {
        // Incorrect match
        setGameWords(prev => prev.map(word => 
          newSelectedWords.some(sw => sw.id === word.id)
            ? { ...word, isCorrect: false, showFeedback: true, isSelected: false }
            : word
        ));
        
        setTimeout(() => {
          setGameWords(prev => prev.map(word => 
            newSelectedWords.some(sw => sw.id === word.id)
              ? { ...word, showFeedback: false }
              : word
          ));
        }, 1000);
      }
      
      setSelectedWords([]);
    }
  };

  // Reset game
  const resetGame = () => {
    const pairs = generateGamePairs();
    setGamePairs(pairs);
    const roundWords = generateRoundWords(pairs, 0, currentPairs);
    setGameWords(roundWords);
    setSelectedWords([]);
    setScore(0);
    setAttempts(0);
    setCompletedPairs(0);
    setIsGameComplete(false);
    setIsLoadingNextRound(false);
    roundProcessedRef.current = false;
  };

  const accuracy = attempts > 0 ? Math.round((score / attempts) * 100) : 0;
  const progress = Math.round((completedPairs / totalPairs) * 100);

  const spanishWords = gameWords.filter(w => w.language === 'spanish');
  const englishWords = gameWords.filter(w => w.language === 'english');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800">Selecciona los pares</h1>
          </div>

          <button
            onClick={resetGame}
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            Reiniciar
          </button>
        </div>

        {!isGameComplete ? (
          <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
            {/* Spanish Column */}
            <div className="space-y-3">
              <h2 className="text-base md:text-lg font-semibold text-gray-700 text-center mb-4">Español</h2>
              {spanishWords.map((word, index) => (
                <motion.button
                  key={word.id}
                  onClick={() => handleWordClick(word)}
                  disabled={word.isMatched || word.showFeedback}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    w-full p-3 md:p-4 rounded-2xl border-2 text-left font-medium transition-all duration-200 relative overflow-hidden text-sm md:text-base
                    ${word.isMatched 
                      ? 'bg-green-100 border-green-300 text-green-800' 
                      : word.isSelected 
                        ? 'bg-blue-100 border-blue-400 text-blue-800 transform scale-105' 
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md'
                    }
                    ${word.showFeedback && word.isCorrect ? 'bg-green-100 border-green-400' : ''}
                    ${word.showFeedback && !word.isCorrect ? 'bg-red-100 border-red-400' : ''}
                    disabled:cursor-not-allowed
                  `}
                >
                  {word.text}
                  
                  {/* Feedback Icons */}
                  <AnimatePresence>
                    {word.showFeedback && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      >
                        {word.isCorrect ? (
                          <CheckIcon className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                        ) : (
                          <XMarkIcon className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>

            {/* English Column */}
            <div className="space-y-3">
              <h2 className="text-base md:text-lg font-semibold text-gray-700 text-center mb-4">English</h2>
              {englishWords.map((word, index) => (
                <motion.button
                  key={word.id}
                  onClick={() => handleWordClick(word)}
                  disabled={word.isMatched || word.showFeedback}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    w-full p-3 md:p-4 rounded-2xl border-2 text-left font-medium transition-all duration-200 relative overflow-hidden text-sm md:text-base
                    ${word.isMatched 
                      ? 'bg-green-100 border-green-300 text-green-800' 
                      : word.isSelected 
                        ? 'bg-blue-100 border-blue-400 text-blue-800 transform scale-105' 
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md'
                    }
                    ${word.showFeedback && word.isCorrect ? 'bg-green-100 border-green-400' : ''}
                    ${word.showFeedback && !word.isCorrect ? 'bg-red-100 border-red-400' : ''}
                    disabled:cursor-not-allowed
                  `}
                >
                  {word.text}
                  
                  {/* Feedback Icons */}
                  <AnimatePresence>
                    {word.showFeedback && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      >
                        {word.isCorrect ? (
                          <CheckIcon className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                        ) : (
                          <XMarkIcon className="h-5 w-5 md:h-6 md:w-6 text-red-600" />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
            
            {/* Loading indicator when transitioning to next round */}
            {isLoadingNextRound && (
              <div className="mt-8 text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="w-8 h-8 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
                  <p className="text-green-600 font-medium">Cargando siguientes parejas...</p>
                </motion.div>
              </div>
            )}
          </div>
        ) : (
          /* Game Complete Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Felicidades!</h2>
              <p className="text-gray-600 mb-6">Has completado todas las parejas</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-green-700">Parejas correctas</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
                  <div className="text-sm text-blue-700">Precisión</div>
                </div>
              </div>
              
              <button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all"
              >
                Jugar de nuevo
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
