'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirección automática al nuevo flujo después de un breve delay
    console.log('🔄 Redirecting from old signup to new registration flow');
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
          <div className="text-4xl mb-6">🔄</div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Flujo de registro actualizado
          </h1>
          
          <p className="text-gray-600 mb-6">
            Hemos mejorado nuestro proceso. Ahora puedes registrarte primero y luego proceder al pago de forma más segura.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Nuevo proceso:</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center mr-2">1</span>
                <span>Crear cuenta gratis</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center mr-2">2</span>
                <span>Pagar de forma segura</span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center mr-2">3</span>
                <span>Acceso inmediato</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link 
              href="/auth/register"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ir al registro
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <p className="text-xs text-gray-500">
              Serás redirigido automáticamente en 3 segundos...
            </p>
          </div>

          {/* Legacy access option */}
          <div className="mt-6 pt-4 border-t border-gray-200">
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