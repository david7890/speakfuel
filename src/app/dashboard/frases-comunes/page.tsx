'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, SpeakerWaveIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import phrasesData from '@/data/common-phrases/phrases.json';
import { Phrase, PhraseCardProps } from '@/types/common-phrases';

// Componente de Tarjeta de Frase
function PhraseCard({ phrase, isFlipped, onFlip, onPlayAudio }: PhraseCardProps) {
  return (
    <motion.div 
      className="relative w-full h-56 cursor-pointer perspective-1000"
      onClick={onFlip}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className={`
        absolute inset-0 w-full h-full transition-transform duration-700 transform-style-preserve-3d
        ${isFlipped ? 'rotate-y-180' : ''}
      `}>
        {/* Cara frontal - Inglés */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg flex flex-col items-center justify-center text-white p-4">
          <h3 className="text-base font-bold mb-4 text-center leading-relaxed px-2">{phrase.english}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayAudio();
            }}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors duration-200 mb-3"
            aria-label="Reproducir audio"
          >
            <SpeakerWaveIcon className="w-6 h-6" />
          </button>
          <p className="text-sm text-purple-100 opacity-75 text-center">Toca para revelar</p>
        </div>
        
        {/* Cara trasera - Español */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg flex flex-col items-center justify-center text-white p-4">
          <h3 className="text-sm font-semibold mb-3 text-emerald-100 text-center opacity-80">{phrase.english}</h3>
          <p className="text-base font-medium leading-relaxed text-center px-2">{phrase.spanish}</p>
          <p className="text-sm mt-4 text-emerald-100 opacity-75 text-center">Toca para volver</p>
        </div>
      </div>
    </motion.div>
  );
}

// Componente principal
export default function FrasesComunesPage() {
  const router = useRouter();
  const [currentBlock, setCurrentBlock] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const phrasesPerBlock = 5;
  const totalBlocks = Math.ceil(phrasesData.phrases.length / phrasesPerBlock);
  const currentPhrases = phrasesData.phrases.slice(
    currentBlock * phrasesPerBlock,
    (currentBlock + 1) * phrasesPerBlock
  );

  // Verificar si todas las frases del bloque actual han sido revisadas
  const allPhrasesReviewed = flippedCards.size === currentPhrases.length;

  const handleCardFlip = (cardIndex: number) => {
    const newFlippedCards = new Set(flippedCards);
    if (flippedCards.has(cardIndex)) {
      newFlippedCards.delete(cardIndex);
    } else {
      newFlippedCards.add(cardIndex);
    }
    setFlippedCards(newFlippedCards);
  };

  const handlePlayAudio = async (phrase: string) => {
    try {
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'en-US';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Error al reproducir audio:', error);
    }
  };

  const goToNextBlock = () => {
    if (currentBlock < totalBlocks - 1 && !isTransitioning && allPhrasesReviewed) {
      setIsTransitioning(true);
      setAnimationDirection('right');
      setCurrentBlock(currentBlock + 1);
      setFlippedCards(new Set());
      setTimeout(() => setIsTransitioning(false), 100);
    }
  };

  const goToPreviousBlock = () => {
    if (currentBlock > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setAnimationDirection('left');
      setCurrentBlock(currentBlock - 1);
      setFlippedCards(new Set());
      setTimeout(() => setIsTransitioning(false), 100);
    }
  };

  // Variantes de animación
  const containerVariants = {
    enter: (direction: string) => ({
      x: direction === 'right' ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: string) => ({
      x: direction === 'right' ? -300 : 300,
      opacity: 0
    })
  };

  const cardVariants = {
    enter: {
      opacity: 0,
      y: 30,
      scale: 0.9
    },
    center: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    exit: {
      opacity: 0,
      y: -30,
      scale: 0.9
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header móvil */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Volver al dashboard"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-gray-800 leading-tight">
                Inglés en Acción
              </h1>
              <p className="text-sm text-gray-600">100 frases que necesitas</p>
            </div>
          </div>
          
          {/* Progreso del bloque */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Bloque {currentBlock + 1} de {totalBlocks}
            </span>
            <span className="text-gray-500">
              {flippedCards.size}/{currentPhrases.length} revisadas
            </span>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(flippedCards.size / currentPhrases.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Navegación de bloques - Mobile */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousBlock}
            disabled={currentBlock === 0 || isTransitioning}
            className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-200 active:scale-95"
          >
            <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
          </button>
          
          {/* Indicadores de progreso */}
          <div className="flex gap-2">
            {Array.from({ length: totalBlocks }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentBlock ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={goToNextBlock}
            disabled={currentBlock === totalBlocks - 1 || isTransitioning || !allPhrasesReviewed}
            className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-200 active:scale-95"
          >
            <ChevronRightIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Grid de Tarjetas de Frases - Mobile First */}
        <AnimatePresence mode="wait" custom={animationDirection}>
          <motion.div
            key={`phrases-${currentBlock}`}
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
            className="space-y-4"
          >
            {currentPhrases.map((phrase, index) => (
              <motion.div
                key={`phrase-${currentBlock}-${index}`}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  delay: index * 0.1,
                  duration: 0.3,
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                }}
              >
                <PhraseCard
                  phrase={phrase}
                  isFlipped={flippedCards.has(index)}
                  onFlip={() => handleCardFlip(index)}
                  onPlayAudio={() => handlePlayAudio(phrase.english)}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navegación inferior */}
        <div className="flex items-center justify-center gap-8 mt-8 mb-6">
          <button
            onClick={goToPreviousBlock}
            disabled={currentBlock === 0 || isTransitioning}
            className="flex items-center justify-center w-14 h-14 bg-purple-500 text-white rounded-full shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-400 hover:bg-purple-600 transition-all duration-200 active:scale-95"
          >
            <ChevronLeftIcon className="w-7 h-7" />
          </button>
          
          <div className="flex flex-col items-center gap-1">
            <div className="text-xs text-gray-500 uppercase font-medium tracking-wide">
              {phrasesData.name}
            </div>
            <div className="text-sm font-semibold text-gray-700">
              {currentBlock + 1} / {totalBlocks}
            </div>
          </div>
          
          <button
            onClick={goToNextBlock}
            disabled={currentBlock === totalBlocks - 1 || isTransitioning || !allPhrasesReviewed}
            className="flex items-center justify-center w-14 h-14 bg-purple-500 text-white rounded-full shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-400 hover:bg-purple-600 transition-all duration-200 active:scale-95"
          >
            <ChevronRightIcon className="w-7 h-7" />
          </button>
        </div>

        {/* Información adicional */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-semibold text-purple-600">Frases útiles para dominar</span>
          </p>
          
          {/* Mensaje de progreso */}
          {!allPhrasesReviewed && currentBlock < totalBlocks - 1 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-2">
              <p className="text-xs text-orange-700 font-medium">
                📖 Revisa todas las frases para continuar al siguiente bloque
              </p>
              <p className="text-xs text-orange-600 mt-1">
                Te faltan {currentPhrases.length - flippedCards.size} frases por revisar
              </p>
            </div>
          )}
          
          {/* Mensaje de completado */}
          {allPhrasesReviewed && currentBlock < totalBlocks - 1 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
              <p className="text-xs text-green-700 font-medium">
                ✅ ¡Excelente! Todas las frases revisadas
              </p>
              <p className="text-xs text-green-600 mt-1">
                Puedes avanzar al siguiente bloque
              </p>
            </div>
          )}
          
          <p className="text-xs text-gray-500">
            Practica diariamente para mejorar tu fluidez en inglés
          </p>
        </div>
      </div>
      
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
