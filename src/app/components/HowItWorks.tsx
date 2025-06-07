export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Escucha la Historia",
      description: "Comienza con una mini-historia cautivadora narrada por hablantes nativos. Cada historia está diseñada para introducir vocabulario y estructuras de forma natural.",
      icon: "🎧"
    },
    {
      step: "02", 
      title: "Interactúa y Practica",
      description: "Responde preguntas, completa diálogos y participa en ejercicios interactivos que refuerzan lo aprendido de manera inmediata y efectiva.",
      icon: "🎮"
    },
    {
      step: "03",
      title: "Aplica lo Aprendido",
      description: "Usa el nuevo vocabulario y estructuras en conversaciones simuladas y situaciones reales, consolidando tu aprendizaje.",
      icon: "💬"
    },
    {
      step: "04",
      title: "Avanza Progresivamente",
      description: "Cada lección construye sobre la anterior, creando una base sólida que te lleva desde principiante hasta un nivel avanzado de manera natural.",
      icon: "🚀"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Cómo funciona 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}SpeakFuel?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nuestro método de 4 pasos está respaldado por la ciencia del aprendizaje 
            y diseñado para que domines el inglés de forma natural y efectiva.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
            >
              {/* Content */}
              <div className="flex-1 lg:max-w-lg">
                <div className="flex items-center mb-4">
                  <span className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-full mr-4">
                    {step.step}
                  </span>
                  <div className="text-4xl">{step.icon}</div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Visual */}
              <div className="flex-1 lg:max-w-lg">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  {/* Different visual for each step */}
                  {index === 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Historia en reproducción</span>
                        <span className="text-xs text-blue-600">2:34 / 4:12</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{width: '60%'}}></div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 italic">
                          "Sarah walked into the coffee shop and ordered her usual latte..."
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {index === 1 && (
                    <div className="space-y-4">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">Complete la oración:</p>
                        <p className="text-sm text-gray-600">Sarah _____ her usual latte.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="p-2 bg-blue-100 text-blue-800 rounded text-sm font-medium">ordered</button>
                        <button className="p-2 bg-gray-100 text-gray-600 rounded text-sm">asked</button>
                        <button className="p-2 bg-gray-100 text-gray-600 rounded text-sm">bought</button>
                        <button className="p-2 bg-gray-100 text-gray-600 rounded text-sm">wanted</button>
                      </div>
                    </div>
                  )}
                  
                  {index === 2 && (
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">Conversación simulada:</p>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">🤖: "Hi! What would you like to order?"</div>
                          <div className="text-sm text-blue-600">👤: "I'd like a latte, please."</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-xs text-green-600 font-medium">¡Excelente pronunciación!</span>
                      </div>
                    </div>
                  )}
                  
                  {index === 3 && (
                    <div className="space-y-4">
                      <div className="text-center mb-4">
                        <div className="text-2xl mb-2">🏆</div>
                        <p className="text-sm font-medium text-gray-700">Nivel completado</p>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Progreso general</span>
                          <span className="text-sm text-green-600 font-medium">Nivel 3 → Nivel 4</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full" style={{width: '75%'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Quieres experimentar el método por ti mismo?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Prueba una lección gratuita y descubre por qué miles de estudiantes 
              eligen SpeakFuel para dominar el inglés.
            </p>
            <a
              href="#cta"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Probar Lección Gratuita
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 