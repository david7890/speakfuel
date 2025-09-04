'use client';

import { useRouter } from 'next/navigation';

export default function CTA() {
  const router = useRouter();

  const plans = [
    {
      name: "Acceso Gratuito",
      price: "Gratis",
      period: "para siempre",
      features: [
        "5 historias interactivas",
        "Ejercicios básicos",
        "Audio nativo",
        "Acceso móvil"
      ],
      cta: "Comenzar Gratis",
      popular: false,
      comingSoon: true
    },
    {
      name: "SpeakFuel Complete",
      price: "$29",
      period: "pago único",
      features: [
        "8 lecciones estructuradas",
        "30+ audios con nativos",
        "Ejercicios interactivos",
        "Certificados de finalización",
        "Acceso de por vida",
        "Actualizaciones gratuitas",
        "Sin límites de tiempo"
      ],
      cta: "Crear Cuenta y Comprar",
      popular: true
    },
    {
      name: "SpeakFuel Premium",
      price: "$97",
      period: "pago único",
      originalPrice: "$197",
      features: [
        "Todo el contenido Complete",
        "Historias exclusivas premium",
        "Coaching personalizado (3 sesiones)",
        "Certificado oficial de competencia",
        "Soporte prioritario vitalicio",
        "Acceso a comunidad privada",
        "Garantía de 60 días"
      ],
      cta: "Inversión Premium",
      popular: false,
      comingSoon: true
    }
  ];

  return (
    <section id="cta" className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Invierte en tu futuro
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}una sola vez
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Sin mensualidades, sin compromisos recurrentes. Una inversión única 
            para dominar el inglés de por vida.
          </p>
        </div>

        {/* Quick Start CTA */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Comienza tu transformación hoy!
              </h3>
              <p className="text-gray-600">
                Crea tu cuenta y accede al curso completo por solo $29 USD
              </p>
            </div>
            
            <button
              onClick={() => router.push('/auth/register')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-medium text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl mb-4"
            >
              Crear Cuenta y Empezar
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                ✓ Sin spam ✓ Acceso inmediato ✓ Proceso seguro
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Options */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Elige tu paquete de aprendizaje
            </h3>
            <p className="text-gray-600">
              Una inversión única para acceso completo y de por vida
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`relative bg-white rounded-2xl p-8 shadow-lg border transition-all duration-300 hover:shadow-xl ${
                  plan.popular 
                    ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20 scale-105' 
                    : 'border-gray-200 hover:border-blue-300'
                } ${plan.comingSoon ? 'opacity-75' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Disponible Ahora
                    </span>
                  </div>
                )}

                {plan.comingSoon && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gray-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Próximamente
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h4>
                  <div className="mb-4">
                    {plan.originalPrice && (
                      <span className="text-gray-400 line-through text-lg mr-2">
                        {plan.originalPrice}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-1">
                      {plan.period}
                    </span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => router.push('/auth/register')}
                  disabled={plan.comingSoon}
                  className={`w-full py-3 rounded-lg font-medium text-lg transition-all duration-300 ${
                    plan.comingSoon 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                        : 'border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
                  }`}
                >
                  {plan.comingSoon ? 'Próximamente' : plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Tu futuro en inglés comienza hoy
            </h3>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Una inversión inteligente en tu futuro profesional y personal. 
              Sin pagos recurrentes, sin compromisos a largo plazo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/auth/register')}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Comenzar Mi Curso
              </button>
              <a
                href="#testimonials"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Ver Más Testimonios
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 