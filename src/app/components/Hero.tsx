export default function Hero() {
  return (
    <section className="pt-20 pb-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Título Emocional */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Habla inglés con confianza
          <br />
          <span className="text-blue-600">sin memorizar reglas</span>
        </h1>
        
        {/* Subtítulo */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Método auditivo para hablar inglés con fluidez. Sin reglas, sin libros.
        </p>
        
        {/* CTA Principal */}
        <div className="mb-6">
          <a
            href="/checkout"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Empieza ahora por $29 USD
          </a>
        </div>
        
        {/* Link discreto */}
        <div>
          <a
            href="/auth/signin"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ¿Ya compraste? Accede aquí.
          </a>
        </div>
      </div>
    </section>
  );
} 