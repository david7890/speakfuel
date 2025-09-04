'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DebugTesting() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkUserState = async () => {
    if (!email.trim()) {
      setError('Por favor introduce un email');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/debug/check-user-state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(),
          secret: 'debug_reset_2024'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Error verificando usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const resetUser = async () => {
    if (!email.trim()) {
      setError('Por favor introduce un email');
      return;
    }

    if (!confirm('¿Estás seguro de que quieres resetear este usuario? Esto eliminará su acceso pagado.')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/debug/reset-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim(),
          secret: 'debug_reset_2024'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
        alert('Usuario reseteado exitosamente. Ahora puede registrarse de nuevo.');
      } else {
        setError(data.error || 'Error reseteando usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="ml-2 text-2xl font-bold text-gray-900">SpeakFuel</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Debug Testing
          </h1>
          <p className="text-gray-600">
            Herramientas para verificar y resetear usuarios de prueba
          </p>
        </div>

        {/* Warning */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <div className="text-red-600 mr-3 text-xl">⚠️</div>
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Solo para desarrollo</h3>
              <p className="text-red-700 text-sm">
                Esta página solo funciona en modo desarrollo y está diseñada para testing.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Check User Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              🔍 Verificar Estado del Usuario
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email del usuario
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={checkUserState}
                  disabled={loading || !email.trim()}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Verificando...
                    </div>
                  ) : (
                    '🔍 Verificar Estado'
                  )}
                </button>

                <button
                  onClick={resetUser}
                  disabled={loading || !email.trim()}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Reseteando...
                    </div>
                  ) : (
                    '🔄 Resetear Usuario'
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Resultado:</h3>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3">📋 Instrucciones:</h3>
            <ol className="text-sm text-green-800 space-y-2">
              <li><strong>1.</strong> Introduce el email que está dando problemas</li>
              <li><strong>2.</strong> Haz clic en "🔍 Verificar Estado" para ver si el usuario existe</li>
              <li><strong>3.</strong> Si existe y tiene acceso pagado, usa "🔄 Resetear Usuario" para limpiarlo</li>
              <li><strong>4.</strong> Después del reset, intenta registrarte de nuevo</li>
              <li><strong>5.</strong> Si el problema persiste, verifica los logs del navegador (F12)</li>
            </ol>
          </div>

          {/* Navigation */}
          <div className="text-center space-y-4">
            <div className="space-x-4">
              <Link 
                href="/auth/register"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                → Ir a Registro
              </Link>
              <Link 
                href="/auth/login"
                className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                → Ir a Login
              </Link>
            </div>

            <div>
              <Link 
                href="/"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 