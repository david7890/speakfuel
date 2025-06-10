export default function Testimonials() {
  const testimonials = [
    {
      name: "María González",
      role: "Profesional de Marketing",
      location: "Madrid, España",
      text: "En solo 3 meses con SpeakFuel logré la fluidez que llevaba años buscando. Las historias hacen que todo sea tan natural que ni sientes que estás estudiando.",
      rating: 5,
      image: "MG"
    },
    {
      name: "Carlos Rodríguez",
      role: "Ingeniero de Software",
      location: "Buenos Aires, Argentina", 
      text: "Finalmente encontré un método que se adapta a mi rutina. Puedo practicar en el metro, en el trabajo, en cualquier lado. Mi inglés mejoró dramáticamente.",
      rating: 5,
      image: "CR"
    },
    {
      name: "Ana Martínez",
      role: "Estudiante Universitaria",
      location: "México DF, México",
      text: "Lo que más me gusta es que no se siente como estudiar gramática aburrida. Las historias son súper entretenidas y realmente se me quedan grabadas.",
      rating: 5,
      image: "AM"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Estudiantes activos" },
    { number: "95%", label: "Tasa de satisfacción" },
    { number: "30 días", label: "Promedio para ver resultados" },
    { number: "24/7", label: "Disponibilidad" }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestros
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}estudiantes
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Miles de hispanohablantes ya han transformado su inglés con SpeakFuel. 
            Descubre sus historias de éxito.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              
              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-gray-500">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Motivational Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              &ldquo;El mejor momento para plantar un árbol fue hace 20 años. 
              El segundo mejor momento es ahora.&rdquo;
            </h3>
            <p className="text-lg opacity-90 mb-8">
              No esperes más para dominar el inglés. Tu futuro profesional y personal 
              te lo agradecerá. SpeakFuel te da las herramientas, tú pones la determinación.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#cta"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Comenzar Mi Transformación
              </a>
              <a
                href="#how-it-works"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Ver Cómo Funciona
              </a>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-8">
            Únete a la comunidad de hispanohablantes que están transformando su futuro con el inglés
          </p>
          
          <div className="flex justify-center items-center space-x-8 opacity-60">
            {/* Placeholder for company/media logos */}
            <div className="text-gray-400 font-semibold">El País</div>
            <div className="text-gray-400 font-semibold">CNN Español</div>
            <div className="text-gray-400 font-semibold">Univision</div>
            <div className="text-gray-400 font-semibold">BBC Mundo</div>
          </div>
        </div>
      </div>
    </section>
  );
} 