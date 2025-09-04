'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import GoogleAuthButton from '@/app/components/GoogleAuthButton';
import EmailAuthForm from '@/app/components/EmailAuthForm';
import AuthSeparator from '@/app/components/AuthSeparator';

function RegisterContent() {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authInfo, setAuthInfo] = useState<string | null>(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    console.log('🔍 RegisterContent useEffect triggered');
    console.log('  - isVerificationSent:', isVerificationSent);
    
    // Solo verificar estado de autenticación si no estamos en proceso de verificación
    if (!isVerificationSent) {
      console.log('🔍 Calling checkAuthStatus...');
      checkAuthStatus();
    }
  }, [isVerificationSent]);

  // Función para limpiar estado de autenticación
  const clearPreviousAuthState = async () => {
    try {
      console.log('🧹 Clearing previous auth state...');
      await supabase.auth.signOut({ scope: 'global' });
      console.log('✅ Auth state cleared');
    } catch (error) {
      console.error('❌ Error clearing auth state:', error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log('✅ User already authenticated, redirecting to dashboard...');
        // Usuario ya autenticado, ir directamente al dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const handleAuthSuccess = async () => {
    console.log('🎉 handleAuthSuccess called - redirecting to dashboard');
    console.log('🔍 Current window location:', window.location.href);
    
    setSuccessMessage('✅ ¡Cuenta creada exitosamente! Redirigiendo al dashboard...');
    
    // Verificar que hay sesión antes de redirigir
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔍 Session check before redirect:', session ? 'EXISTS' : 'NULL');
      if (session) {
        console.log('  - User ID:', session.user.id);
        console.log('  - Email:', session.user.email);
        console.log('  - Expires at:', new Date(session.expires_at! * 1000));
      }
    } catch (error) {
      console.error('❌ Error checking session before redirect:', error);
    }
    
    // Pequeña espera para mostrar el mensaje y luego redirigir
    setTimeout(() => {
      console.log('🚀 About to redirect to dashboard...');
      router.push('/dashboard');
    }, 2000); // Aumentar a 2 segundos para dar tiempo a que se establezca la sesión
  };

  const handleAuthError = (errorMessage: string) => {
    console.log('❌ handleAuthError called with message:', errorMessage);
    setAuthError(errorMessage);
    setAuthInfo(null);
    setSuccessMessage(null);
  };

  const handleAuthInfo = (infoMessage: string) => {
    console.log('ℹ️ handleAuthInfo called with message:', infoMessage);
    if (infoMessage.includes('Revisa tu email')) {
      console.log('📧 Setting verification sent state to true');
      setIsVerificationSent(true);
    }
    setAuthInfo(infoMessage);
    setAuthError(null);
    setSuccessMessage(null);
  };

  // Si ya se envió el email de verificación, mostrar una pantalla diferente
  if (isVerificationSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-lg w-full text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-5xl mb-4">📧</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Revisa tu email!
            </h1>
            <p className="text-gray-600 mb-6">
              Te hemos enviado un enlace de confirmación. Por favor revisa tu bandeja de entrada y sigue las instrucciones para activar tu cuenta.
            </p>
            <div className="text-sm text-gray-500 mb-6">
              <p>No olvides revisar tu carpeta de spam si no encuentras el email.</p>
            </div>
            <button
              onClick={() => setIsVerificationSent(false)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Volver al registro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="ml-2 text-2xl font-bold text-gray-900">SpeakFuel</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Comienza tu curso de inglés
          </h1>
          <p className="text-gray-600 mb-4">
            Crea tu cuenta para acceder al método auditivo que te hará hablar inglés con fluidez
          </p>
          
          {/* Value proposition */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <span className="text-2xl mr-2">🎯</span>
              <span className="font-semibold text-blue-800">Solo $29 USD - Pago único</span>
            </div>
            <p className="text-sm text-blue-700">
              Sin mensualidades • Acceso de por vida • Garantía 30 días
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          {/* Quick benefits */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 text-center">¿Por qué crear cuenta primero?</h3>
            <div className="grid grid-cols-1 gap-2 text-sm">
              {[
                { icon: '⚡', text: 'Acceso inmediato después del pago' },
                { icon: '🔒', text: 'Tu progreso se guarda automáticamente' },
                { icon: '📱', text: 'Accede desde cualquier dispositivo' },
                { icon: '🎯', text: 'Proceso de pago más rápido y seguro' }
              ].map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <span className="mr-3">{benefit.icon}</span>
                  <span className="text-gray-700">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* Google OAuth */}
            <GoogleAuthButton 
              mode="signup"
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
            
            {/* Separator */}
            <AuthSeparator />
            
            {/* Email/Password Form */}
            <EmailAuthForm 
              mode="signup"
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
              onInfo={handleAuthInfo}
            />
          </div>

          {/* Auth Error */}
          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4">
              <p className="text-sm">{authError}</p>
              {authError.includes('ya está registrado') && (
                <div className="mt-3 text-xs">
                  <p className="text-red-600 mb-2">
                    Si crees que esto es un error, puedes limpiar el estado de autenticación:
                  </p>
                  <button
                    onClick={clearPreviousAuthState}
                    className="text-blue-600 hover:text-blue-700 font-medium text-xs"
                  >
                    🧹 Limpiar estado y probar de nuevo
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mt-4">
              <p className="text-sm">{successMessage}</p>
            </div>
          )}

          {/* Auth Info */}
          {authInfo && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mt-4">
              <p className="text-sm">{authInfo}</p>
            </div>
          )}

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta? 
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 ml-1 font-medium">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Verificando tu cuenta...</p>
            </div>
          </div>
        )}

        {/* Security & Trust */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span>🔒 100% Seguro</span>
            <span>✅ Sin spam</span>
            <span>⚡ Acceso inmediato</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Al crear tu cuenta aceptas nuestros términos de servicio
          </p>
        </div>

        {/* Back to home */}
        <div className="text-center mt-4 space-y-2">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-700 text-sm transition-colors inline-flex items-center"
          >
            ← Volver a inicio
          </Link>
          <div>
            <Link 
              href="/debug-auth-flow" 
              className="text-gray-400 hover:text-gray-600 text-xs transition-colors"
            >
              🔧 Debug Auth Flow
            </Link>
          </div>
          
          {/* Debug button para limpiar todo */}
          <div className="mt-4">
            <button
              onClick={async () => {
                console.log('🧹 Clearing all auth state and localStorage...');
                // Limpiar localStorage
                if (typeof window !== 'undefined') {
                  localStorage.clear();
                  sessionStorage.clear();
                }
                // Limpiar estado de Supabase
                await clearPreviousAuthState();
                console.log('✅ All state cleared');
                alert('Estado limpio. Ahora puedes intentar registrarte.');
              }}
              className="text-red-400 hover:text-red-600 text-xs transition-colors"
            >
              🗑️ Limpiar Todo el Estado (Debug)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
} 