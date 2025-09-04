import Link from "next/link";

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
          <Link
            href="/auth/register"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            🚀 Empezar ahora - Gratis
          </Link>
          <p className="text-sm text-gray-500 mt-3">
            Crea tu cuenta y obtén acceso inmediato
          </p>
        </div>
        
        {/* Link discreto */}
        <div>
          <a
            href="/auth/login"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ¿Ya compraste? Inicia sesión aquí.
          </a>
        </div>
      </div>
    </section>
  );
} 