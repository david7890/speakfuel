'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Checkout() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const canceled = searchParams.get('canceled');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Obtener la URL de Stripe y redirigir
        const stripe = (await import('@stripe/stripe-js')).loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        const stripeInstance = await stripe;
        if (stripeInstance) {
          await stripeInstance.redirectToCheckout({ sessionId: data.sessionId });
        }
      } else {
        // Manejar caso especial: usuario ya tiene acceso
        if (data.type === 'already_paid') {
          setError(data.error + ' Redirigiendo a la página de acceso...');
          setTimeout(() => {
            window.location.href = '/acceso?from=checkout';
          }, 2000);
        } else {
          setError(data.error || 'Error procesando el pago');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Finalizar compra
          </h1>
          <p className="text-gray-600 mb-4">
            Curso completo por solo $29 USD
          </p>

          {/* Características del producto */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Incluye:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✅ 8 lecciones estructuradas</li>
              <li>✅ 30+ audios con nativos</li>
              <li>✅ Acceso de por vida</li>
              <li>✅ Sin anuncios</li>
            </ul>
          </div>
        </div>

        {/* Mensaje de cancelación */}
        {canceled && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm">Pago cancelado. Puedes intentarlo de nuevo cuando quieras.</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Tu correo electrónico
                </label>
                <input
                id="email"
                  type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="tu@email.com"
                disabled={loading}
                />
              <p className="text-xs text-gray-500 mt-1">
                Recibirás tu acceso al curso en este correo
              </p>
              </div>

              <button
                type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Procesando...
                </div>
              ) : (
                'Pagar $29 USD'
                )}
              </button>
            </form>
                </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Seguridad */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            🔒 Pago seguro con Stripe • Garantía de 30 días
          </p>
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
          >
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
} 