'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import GoogleAuthButton from '@/app/components/GoogleAuthButton';
import EmailAuthForm from '@/app/components/EmailAuthForm';
import AuthSeparator from '@/app/components/AuthSeparator';

function LoginContent() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Mostrar mensaje si viene de redirección con error
    const error = searchParams.get('error');
    if (error) {
      setInfoMessage(decodeURIComponent(error));
    }
  }, [searchParams]);

  const handleAuthSuccess = () => {
    console.log('✅ Authentication successful, redirecting to dashboard');
    router.push('/dashboard');
  };

  const handleAuthError = (errorMessage: string) => {
    setAuthError(errorMessage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="ml-2 text-2xl font-bold text-gray-900">SpeakFuel</span>
          </Link>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Accede a tu curso
          </h1>
          <p className="text-gray-600">
            Bienvenido de vuelta
          </p>
        </div>

        {/* Info Message (from redirects) */}
        {infoMessage && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <span className="mr-2">💡</span>
              <span className="text-sm">{infoMessage}</span>
            </div>
          </div>
        )}

        {/* Auth Options */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="space-y-4">
            {/* Google OAuth */}
            <GoogleAuthButton 
              mode="login"
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
            
            {/* Separator */}
            <AuthSeparator />
            
            {/* Email/Password Form */}
            <EmailAuthForm 
              mode="login"
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
          </div>

          {/* Auth Error */}
          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4">
              <p className="text-sm">{authError}</p>
            </div>
          )}

          {/* Signup link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta? 
              <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 ml-1 font-medium">
                Crear cuenta aquí
              </Link>
            </p>
          </div>

          {/* Forgot password */}
          <div className="mt-4 text-center">
            <button 
              onClick={() => {
                // TODO: Implement forgot password functionality
                alert('Funcionalidad de recuperación de contraseña próximamente. Por ahora, contacta soporte.');
              }}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        {/* Help section */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-500">¿Necesitas ayuda?</p>
          <Link 
            href="mailto:hola@speakfuel.com"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            Contacta soporte: hola@speakfuel.com
          </Link>
        </div>

        {/* Back to home */}
        <div className="mt-4 text-center">
          <Link 
            href="/" 
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
} 