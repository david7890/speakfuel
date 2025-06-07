'use client';

import { useState } from 'react';

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

  const currentQuestion = data.questions[currentQuestionIndex];
  const totalQuestions = data.questions.length;

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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Preguntas de Comprensión</h2>
                <p className="text-purple-100">Evalúa tu entendimiento</p>
              </div>
            </div>
            <div className="text-white text-sm font-medium">
              {currentQuestionIndex + 1} de {totalQuestions}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Question */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {currentQuestion.question}
            </h3>

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
            <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
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
            <div className="flex justify-center">
              <button
                onClick={handleNextQuestion}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {currentQuestionIndex === totalQuestions - 1 ? 'Terminar' : 'Siguiente Pregunta'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 