export default function Hero() {
  return (
    <section className="pt-24 pb-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Título Emocional */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8">
          Habla inglés con confianza
          <br />
          <span className="text-blue-600">sin memorizar reglas</span>
        </h1>
        
        {/* Subtítulo */}
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Método auditivo para hablar inglés con fluidez. Sin reglas, sin libros.
        </p>
        
        {/* CTA Principal */}
        <div className="mb-8">
          <a
            href="/checkout"
            className="inline-block bg-blue-600 text-white px-10 py-5 rounded-lg font-semibold text-xl hover:bg-blue-700 transition-colors duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            Empieza ahora por $29 USD
          </a>
        </div>
        
        {/* Link discreto */}
        <div>
          <a
            href="/acceso"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ¿Ya compraste? Accede aquí.
          </a>
        </div>
      </div>
    </section>
  );
} 