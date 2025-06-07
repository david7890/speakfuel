export default function Benefits() {
  const benefits = [
    {
      icon: "🎯",
      title: "Método Natural",
      description: "Aprende inglés como aprendiste español: a través de historias contextualizadas que se quedan en tu memoria."
    },
    {
      icon: "🎧",
      title: "Audio Nativo",
      description: "Escucha pronunciación auténtica de hablantes nativos para desarrollar tu oído y acento."
    },
    {
      icon: "⚡",
      title: "Resultados Rápidos",
      description: "Ve progreso real en tu fluidez desde la primera semana con nuestro sistema probado."
    },
    {
      icon: "🎮",
      title: "Interactivo y Divertido",
      description: "Ejercicios gamificados que mantienen tu motivación alta y hacen del aprendizaje una experiencia placentera."
    },
    {
      icon: "📱",
      title: "Aprende Anywhere",
      description: "Estudia desde cualquier dispositivo, en cualquier momento. Perfecto para tu rutina diaria."
    },
    {
      icon: "🧠",
      title: "Para Hispanohablantes",
      description: "Diseñado específicamente para superar los desafíos únicos que enfrentamos al aprender inglés."
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ¿Por qué elegir 
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}SpeakFuel?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nuestro método revolucionario combina neurociencia, tecnología y pedagogía 
            para acelerar tu dominio del inglés de forma natural.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Listo para transformar tu inglés?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Únete a miles de hispanohablantes que ya están dominando el inglés 
              con nuestro método de historias interactivas.
            </p>
            <a
              href="#cta"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Comenzar Mi Transformación
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 