'use client';

import { useState } from 'react';

export default function CTA() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío del formulario
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      alert('¡Gracias! Te hemos enviado el acceso gratuito a tu email.');
    }, 2000);
  };

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
      popular: false
    },
    {
      name: "SpeakFuel Complete",
      price: "$97",
      period: "pago único",
      features: [
        "200+ historias interactivas",
        "Todos los ejercicios y niveles",
        "Audio nativo premium",
        "Certificados de finalización",
        "Acceso de por vida",
        "Actualizaciones gratuitas",
        "Sin límites de tiempo"
      ],
      cta: "Comprar Ahora",
      popular: true
    },
    {
      name: "SpeakFuel Premium",
      price: "$197",
      period: "pago único",
      originalPrice: "$297",
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
      popular: false
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

                 {/* Free Access Form */}
        <div className="max-w-md mx-auto mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Acceso gratuito inmediato
              </h3>
              <p className="text-gray-600">
                Sin compromisos. Comienza tu viaje ahora mismo.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu email para comenzar"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                  required
                />
              </div>
              
                             <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Comenzar Gratis'}
              </button>
            </form>
            
                         <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                ✓ Sin spam ✓ Acceso inmediato ✓ Datos seguros
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
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Más Popular
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
                  className={`w-full py-3 rounded-lg font-medium text-lg transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      : 'border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
                  }`}
                >
                  {plan.cta}
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
              <a
                href="#"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Ver Contenido Gratuito
              </a>
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