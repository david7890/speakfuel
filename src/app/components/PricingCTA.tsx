import Link from 'next/link';

export default function PricingCTA() {
  return (
    <section className="py-16 px-4 bg-blue-600">
      <div className="max-w-3xl mx-auto text-center">
        {/* Título */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Accede hoy por solo $29 USD
        </h2>
        
        <p className="text-blue-100 mb-8">
          Precio único. Sin mensualidades ni sorpresas.
        </p>
        
        {/* Price Display */}
        <div className="bg-white rounded-lg p-8 mb-8 max-w-md mx-auto">
          <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            $29 <span className="text-lg text-gray-600">USD</span>
          </div>
          <p className="text-gray-600 mb-6">
            Pago único • Acceso de por vida
          </p>
          
          {/* CTA Button */}
          <a
            href="/checkout"
            className="block w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Crear cuenta y comprar
          </a>
          <p className="text-xs text-gray-500 mt-2">
            Acceso inmediato después del pago
          </p>
        </div>
        
        {/* Subtexto */}
        <p className="text-blue-100 text-sm">
          Acceso inmediato con Google OAuth o Email/Password.
        </p>
        
        {/* Garantía */}
        <div className="mt-6 flex items-center justify-center text-blue-100">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <span className="text-sm">Garantía de 30 días</span>
        </div>
      </div>
    </section>
  );
} 