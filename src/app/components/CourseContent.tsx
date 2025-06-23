export default function CourseContent() {
  const features = [
    "8 lecciones estructuradas",
    "30+ audios con hablantes nativos", 
    "Ejercicios interactivos",
    "Acceso de por vida",
    "Sin anuncios ni distracciones",
    "Aprende a tu ritmo"
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto text-center">
        {/* Título */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Todo lo que necesitas para dominar el inglés
        </h2>
        
        <p className="text-gray-600 mb-12">
          Método completo y sin complicaciones
        </p>
        
        {/* Features List */}
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center text-left">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 