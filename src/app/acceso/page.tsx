'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SessionDurations } from '@/lib/auth-helpers';

export default function Acceso() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const searchParams = useSearchParams();
  const fromCheckout = searchParams.get('from') === 'checkout';

  useEffect(() => {
    if (fromCheckout) {
      setMessage({
        type: 'success',
        text: '¡Ya tienes acceso al curso! Introduce tu email para acceder.'
      });
    }
  }, [fromCheckout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/acceso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          rememberMe: true, // Siempre 30 días
          sessionDuration: SessionDurations.EXTENDED // 30 días
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: data.message 
        });
        setEmail(''); // Limpiar el formulario
      } else {
        // Manejar diferentes tipos de error
        if (data.errorType === 'user_not_found') {
          setMessage({ 
            type: 'error', 
            text: 'No encontramos una cuenta con este correo. ¿Estás seguro de que compraste el curso con este email?' 
          });
        } else if (data.errorType === 'no_paid_access') {
          setMessage({ 
            type: 'error', 
            text: 'Esta cuenta no tiene acceso pagado al curso. Si compraste recientemente, contacta soporte.' 
          });
        } else {
          setMessage({ 
            type: 'error', 
            text: data.error || 'Ocurrió un error. Inténtalo de nuevo.' 
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error de conexión. Verifica tu internet e inténtalo de nuevo.' 
      });
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
            Accede a tu curso
          </h1>
          <p className="text-gray-600">
            Ingresa el correo con el que compraste para recibir tu enlace de acceso
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
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
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verificando acceso...
                </div>
              ) : (
                'Recibir acceso'
              )}
            </button>
          </form>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <p className="text-sm font-medium">{message.text}</p>
            {message.type === 'error' && (
              <p className="text-xs mt-2 opacity-80">
                Si necesitas ayuda, escríbenos a hola@speakfuel.com
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">
            ¿No compraste aún?
          </p>
          <a 
            href="/" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
} 