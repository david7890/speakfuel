'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GraciasRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirección automática al nuevo flujo
    console.log('🔄 Redirecting from old gracias page to new registration flow');
    const timer = setTimeout(() => {
      router.push('/auth/register');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        {/* Header with Logo */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="ml-2 text-2xl font-bold text-gray-900">SpeakFuel</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="text-4xl mb-6">✨</div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            ¡Gracias por tu interés!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Hemos actualizado nuestro proceso para ofrecerte una mejor experiencia. Ahora puedes crear tu cuenta de forma gratuita antes de realizar el pago.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">✅ Beneficios del nuevo flujo:</h3>
            <div className="text-sm text-green-700 space-y-1 text-left">
              <div className="flex items-center">
                <span className="mr-2">🚀</span>
                <span>Acceso inmediato después del pago</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">🔒</span>
                <span>Proceso más seguro y confiable</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">💾</span>
                <span>Tu progreso se guarda automáticamente</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📱</span>
                <span>Accede desde cualquier dispositivo</span>
              </div>
            </div>
          </div>

          <Link 
            href="/auth/register"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mb-4"
          >
            Crear cuenta gratuita
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <p className="text-xs text-gray-500 mb-4">
            Serás redirigido automáticamente en 3 segundos...
          </p>

          {/* Already have account option */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400 mb-2">
              ¿Ya tienes cuenta?
            </p>
            <Link 
              href="/auth/login"
              className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
            >
              Iniciar sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 