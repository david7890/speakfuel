'use client';

import { useState } from 'react';

export default function DebugReset() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);
  const [result, setResult] = useState<{success?: boolean; message?: string; error?: string; details?: Record<string, unknown>} | null>(null);
  const [checkResult, setCheckResult] = useState<{found?: boolean; error?: string; user?: {email: string}; profile?: {has_paid_access: boolean}; function_result?: {has_access: boolean}; debug_info?: Record<string, unknown>} | null>(null);

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-900 mb-4">🚫 No Disponible</h1>
          <p className="text-red-700">Esta herramienta solo está disponible en modo desarrollo.</p>
        </div>
      </div>
    );
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/debug/reset-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          secret: 'debug_reset_2024'
        }),
      });

      const data = await response.json();
      setResult(data);

    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckUser = async () => {
    if (!email.trim()) return;
    
    setCheckLoading(true);
    setCheckResult(null);

    try {
      const response = await fetch('/api/debug/check-user-state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          secret: 'debug_reset_2024'
        }),
      });

      const data = await response.json();
      setCheckResult(data);

    } catch (error) {
      console.error('Error:', error);
      setCheckResult({ error: 'Error de conexión' });
    } finally {
      setCheckLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🧹</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Reset Acceso (DEV)
          </h1>
          <p className="text-gray-600 text-sm">
            Resetea el acceso pagado de un usuario para poder probar el flujo desde cero
          </p>
        </div>

        {/* Warning */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <span className="text-blue-600 mr-2">ℹ️</span>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Modo Seguro</p>
              <p>Esto reseteará el acceso pagado pero preservará el usuario y su cuenta de email.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email del Usuario
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="usuario@ejemplo.com"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleCheckUser}
                disabled={checkLoading || !email.trim()}
                className="bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {checkLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verificando...
                  </div>
                ) : (
                  '🔍 Verificar Estado'
                )}
              </button>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Reseteando...
                  </div>
                ) : (
                  '🔄 Resetear Acceso'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Check Result */}
        {checkResult && (
          <div className={`p-4 rounded-lg mb-6 ${
            checkResult.found && !checkResult.error
              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <div className="font-medium mb-2">
              {checkResult.found ? '🔍 Estado del Usuario' : '❌ Error'}
            </div>
            
            {checkResult.found && (
              <div className="text-sm space-y-2">
                <p><strong>Email:</strong> {checkResult.user?.email}</p>
                <p><strong>has_paid_access:</strong> 
                  <span className={`ml-1 px-2 py-1 rounded text-xs ${
                    checkResult.profile?.has_paid_access === true 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {String(checkResult.profile?.has_paid_access)}
                  </span>
                </p>
                <p><strong>Función check_user_paid_access:</strong>
                  <span className={`ml-1 px-2 py-1 rounded text-xs ${
                    checkResult.function_result?.has_access === true 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {checkResult.function_result?.has_access ? 'HAS ACCESS' : 'NO ACCESS'}
                  </span>
                </p>
                
                {checkResult.debug_info && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs opacity-70">Ver debug detallado</summary>
                    <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(checkResult.debug_info, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
            
            {checkResult.error && (
              <p className="text-sm">{checkResult.error}</p>
            )}
          </div>
        )}

        {/* Reset Result */}
        {result && (
          <div className={`p-4 rounded-lg mb-6 ${
            result.success 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <div className="font-medium mb-2">
              {result.success ? '✅ Reset Completo' : '❌ Error'}
            </div>
            <p className="text-sm">{result.message || result.error}</p>
            
            {result.details && (
              <div className="mt-2 text-xs opacity-80">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-900 mb-2">📋 Instrucciones:</h3>
          <ol className="text-sm text-green-800 space-y-1">
            <li>1. Introduce el email del usuario</li>
            <li>2. Haz clic en <strong>&ldquo;🔍 Verificar Estado&rdquo;</strong> para ver el estado actual</li>
            <li>3. Si tiene <code className="bg-green-100 px-1 rounded">has_paid_access: true</code>, haz clic en <strong>&ldquo;🔄 Resetear Acceso&rdquo;</strong></li>
            <li>4. Verifica de nuevo para confirmar que cambió a <code className="bg-red-100 px-1 rounded">false</code></li>
            <li>5. Ahora el usuario podrá pasar por <code className="bg-green-100 px-1 rounded">/checkout</code> de nuevo</li>
          </ol>
        </div>

        {/* Quick Access */}
        <div className="mt-6 text-center space-x-4">
          <a 
            href="/checkout" 
            className="inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            → Ir a Checkout
          </a>
          <a 
            href="/acceso" 
            className="inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            → Ir a Acceso
          </a>
        </div>
      </div>
    </div>
  );
} 