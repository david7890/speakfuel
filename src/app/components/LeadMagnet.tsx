export default function LeadMagnet() {
  return (
    <section className="py-16 px-4 bg-blue-600">
      <div className="max-w-2xl mx-auto text-center">
        {/* Título */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          🎧 Prueba una historia gratis
        </h2>
        
        <p className="text-blue-100 mb-8">
          Descubre cómo funciona nuestro método con una historia completa sin costo
        </p>
        
        {/* Form */}
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Tu email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Acceder gratis ahora
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4">
            Sin spam. Solo contenido de calidad.
          </p>
        </div>
      </div>
    </section>
  );
} 