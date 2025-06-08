import React, { useState, useEffect } from 'react';

const MiniStoryQuestions: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState<{ [key: number]: boolean }>({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [celebrationShow, setCelebrationShow] = useState(false);

  const questions = [
    {
      question: "¿Cuál es el sonido que Sarah escucha al entrar a la cafetería?",
      options: [
        "El sonido de la máquina de espresso",
        "El sonido de la campana sonando",
        "El sonido de la música de fondo",
        "El sonido de las conversaciones"
      ],
      correct: 1,
      explanation: "Sarah escucha 'the bell chiming above her head' (la campana sonando sobre su cabeza)."
    },
    {
      question: "¿Cómo describe el texto la hora del día en la cafetería?",
      options: [
        "Una hora tranquila",
        "Una hora normal",
        "La hora pico de la mañana",
        "Una hora silenciosa"
      ],
      correct: 2,
      explanation: "El texto menciona 'the morning rush is in full swing' (la hora pico de la mañana está en pleno apogeo)."
    },
    {
      question: "¿Qué demuestra la actitud de Emma hacia Sarah?",
      options: [
        "Emma es nueva en el trabajo",
        "Emma conoce bien las preferencias de Sarah",
        "Emma no recuerda a Sarah",
        "Emma está muy ocupada para atender"
      ],
      correct: 1,
      explanation: "Emma 'has memorized Sarah's order perfectly' (ha memorizado perfectamente el pedido de Sarah)."
    }
  ];

  const handleAnswerSelect = async (questionIndex: number, answerIndex: number) => {
    if (showResults[questionIndex] || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }));
    setShowResults(prev => ({ ...prev, [questionIndex]: true }));
    
    // Celebración si es correcto
    if (answerIndex === questions[questionIndex].correct) {
      setCelebrationShow(true);
      setTimeout(() => setCelebrationShow(false), 2000);
    }
    
    setIsSubmitting(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const allQuestionsAnswered = Object.keys(selectedAnswers).length === questions.length;
  const correctAnswers = Object.entries(selectedAnswers).filter(
    ([questionIndex, answerIndex]) => answerIndex === questions[parseInt(questionIndex)].correct
  ).length;

  const completionPercentage = (correctAnswers / questions.length) * 100;

  // Mostrar celebración final si se completan todas las preguntas
  useEffect(() => {
    if (allQuestionsAnswered && !showCompletion) {
      setTimeout(() => {
        setShowCompletion(true);
      }, 1000);
    }
  }, [allQuestionsAnswered, showCompletion]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Celebration Overlay */}
      {celebrationShow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">¡Correcto!</h3>
            <p className="text-gray-600">¡Excelente trabajo!</p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progreso de Preguntas</span>
          <span className="text-sm text-gray-500">{Object.keys(selectedAnswers).length}/{questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentQuestionIndex(index);
                  setIsTransitioning(false);
                }, 300);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                index === currentQuestionIndex
                  ? 'bg-orange-500 text-white shadow-lg scale-110'
                  : selectedAnswers[index] !== undefined
                  ? selectedAnswers[index] === questions[index].correct
                    ? 'bg-green-500 text-white shadow-md hover:shadow-lg'
                    : 'bg-red-500 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:scale-105'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question Content */}
      <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">
                Pregunta {currentQuestionIndex + 1} de {questions.length}
              </span>
              {selectedAnswers[currentQuestionIndex] !== undefined && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedAnswers[currentQuestionIndex] === questions[currentQuestionIndex].correct
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedAnswers[currentQuestionIndex] === questions[currentQuestionIndex].correct ? '✓ Correcto' : '✗ Incorrecto'}
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {questions[currentQuestionIndex].question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-4 mb-6">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestionIndex, index)}
                disabled={showResults[currentQuestionIndex] || isSubmitting}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                  showResults[currentQuestionIndex]
                    ? index === questions[currentQuestionIndex].correct
                      ? 'border-green-500 bg-green-50 text-green-800 shadow-md'
                      : selectedAnswers[currentQuestionIndex] === index
                      ? 'border-red-500 bg-red-50 text-red-800 shadow-md'
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                    : selectedAnswers[currentQuestionIndex] === index
                    ? 'border-orange-500 bg-orange-50 text-orange-800 shadow-md'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50 hover:shadow-md transform hover:scale-105'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {isSubmitting && selectedAnswers[currentQuestionIndex] === index && (
                    <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {showResults[currentQuestionIndex] && (
                    <>
                      {index === questions[currentQuestionIndex].correct && (
                        <span className="text-green-600 font-bold">✓</span>
                      )}
                      {selectedAnswers[currentQuestionIndex] === index && index !== questions[currentQuestionIndex].correct && (
                        <span className="text-red-600 font-bold">✗</span>
                      )}
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showResults[currentQuestionIndex] && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl animate-slideIn">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Explicación</h4>
                  <p className="text-blue-800">{questions[currentQuestionIndex].explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            currentQuestionIndex === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200'
          }`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </p>
          {allQuestionsAnswered && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              Puntuación: {correctAnswers}/{questions.length} ({Math.round(completionPercentage)}%)
            </div>
          )}
        </div>

        <button
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            currentQuestionIndex === questions.length - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200'
          }`}
        >
          Siguiente
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Completion Modal */}
      {showCompletion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center animate-slideUp">
            <div className="text-6xl mb-4">
              {completionPercentage >= 80 ? '🏆' : completionPercentage >= 60 ? '🎯' : '📚'}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {completionPercentage >= 80 ? '¡Excelente!' : completionPercentage >= 60 ? '¡Buen trabajo!' : '¡Sigue practicando!'}
            </h3>
            <p className="text-gray-600 mb-6">
              Has completado las preguntas con {correctAnswers} de {questions.length} respuestas correctas.
            </p>
            <div className="bg-gray-100 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Tu puntuación</span>
                <span className="text-sm text-gray-500">{Math.round(completionPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    completionPercentage >= 80 ? 'bg-green-500' : completionPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
            <button
              onClick={() => setShowCompletion(false)}
              className="w-full bg-orange-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-orange-600 transition-colors duration-300"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniStoryQuestions; 