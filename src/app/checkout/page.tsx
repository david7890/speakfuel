'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  
  // Cargar email desde URL params si existe
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setFormData(prev => ({
        ...prev,
        email: emailParam
      }));
    }
  }, [searchParams]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      
      console.log('🚀 Enviando Magic Link a:', formData.email);
      
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: formData.name // Enviar el nombre en los metadatos
          }
        }
      });

      if (error) {
        console.error('❌ Error enviando Magic Link:', error);
        alert('Error enviando el enlace. Por favor intenta de nuevo.');
      } else {
        console.log('✅ Magic Link enviado exitosamente');
        
        // Guardar el nombre temporalmente en localStorage para cuando se registre
        localStorage.setItem('pending_user_name', formData.name);
        
        setSubmittedEmail(formData.email);
        setShowSuccess(true);
      }
    } catch (error) {
      console.error('❌ Error en checkout:', error);
      alert('Error procesando tu solicitud. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
          {/* Success Animation */}
          <div className="mb-6">
            <div className="text-6xl mb-4 animate-bounce">📧</div>
            <div className="text-4xl text-green-500 mb-4">✅</div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Revisa tu correo!
          </h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Hemos enviado un enlace mágico a:
            <br />
            <span className="font-semibold text-blue-600 break-all">
              {submittedEmail}
            </span>
          </p>
          
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              Pasos siguientes:
            </h3>
            <ol className="text-sm text-blue-800 text-left space-y-1">
              <li>1. Abre tu email</li>
              <li>2. Busca el mensaje de SpeakFuel</li>
              <li>3. Haz clic en "Acceder al curso"</li>
              <li>4. ¡Comienza a aprender!</li>
            </ol>
          </div>
          
          <div className="text-xs text-gray-500 mb-6">
            ¿No ves el email? Revisa tu carpeta de spam o promociones
          </div>
          
          <button
            onClick={() => {
              setShowSuccess(false);
              setFormData({ name: '', email: '' });
              setSubmittedEmail('');
            }}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
          >
            Enviar a otro email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">SpeakFuel</h1>
            <p className="text-sm text-gray-600">Checkout</p>
          </div>
          
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Resumen del Curso */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100 h-fit">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Lo que recibirás
            </h2>
            
            {/* Curso Principal */}
            <div className="mb-8">
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-blue-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    SpeakFuel Complete
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Curso completo de inglés con historias interactivas
                  </p>
                </div>
              </div>
            </div>

            {/* Lista de Beneficios */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-700">
                  <strong>8 lecciones completas</strong> con historias inmersivas
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-700">
                  <strong>Audio nativo profesional</strong> para cada historia
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-700">
                  <strong>Vocabulario especializado</strong> para cada lección
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-700">
                  <strong>Mini-historias adicionales</strong> para práctica extra
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-700">
                  <strong>Ejercicios interactivos</strong> de comprensión
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-700">
                  <strong>Sistema de progreso</strong> con estrellas y repeticiones
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-1">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-gray-700">
                  <strong>Acceso móvil completo</strong> desde cualquier dispositivo
                </span>
              </div>
            </div>

            {/* Precio */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  Total:
                </span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-blue-600">
                    GRATIS
                  </span>
                  <p className="text-sm text-gray-500">
                    Acceso completo por tiempo limitado
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Accede al curso ahora
            </h2>
            <p className="text-gray-600 mb-8">
              Solo necesitamos tu nombre y email para enviarte el acceso instantáneo
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Tu nombre completo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-lg"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-lg"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando acceso...
                  </span>
                ) : (
                  '🚀 Acceder al curso ahora'
                )}
              </button>

              <div className="text-center text-sm text-gray-500 space-y-2">
                <p>✓ Acceso inmediato por email</p>
                <p>✓ Sin compromisos ni pagos</p>
                <p>✓ Tus datos están seguros</p>
              </div>
            </form>

            {/* Garantía */}
            <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-full p-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">
                    100% Garantizado
                  </h4>
                  <p className="text-sm text-green-700">
                    Acceso completo sin restricciones. Si no te gusta, simplemente deja de usar la plataforma.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 