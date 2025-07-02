'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SessionDurations } from '@/lib/auth-helpers';

export default function Gracias() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [email, setEmail] = useState('');
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  // Obtener detalles de la sesión y procesar pago al cargar la página
  useEffect(() => {
    if (sessionId) {
      processPayment();
    }
  }, [sessionId]);

  const processPayment = async () => {
    try {
      console.log('🔄 Processing payment for session:', sessionId);
      
      // 1. Procesar el pago
      const paymentResponse = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      const paymentData = await paymentResponse.json();

      if (paymentResponse.ok) {
        console.log('✅ Payment processed successfully');
        setEmail(paymentData.customer_email);
        setMessage({ 
          type: 'success', 
          text: '✅ Pago procesado y magic link enviado exitosamente.' 
        });
      } else {
        console.error('❌ Payment processing failed:', paymentData);
        setMessage({ 
          type: 'error', 
          text: `Error procesando pago: ${paymentData.error}` 
        });
        
        // Fallback: intentar obtener al menos el email
        fetchSessionDetails();
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error de conexión procesando el pago.' 
      });
      
      // Fallback: intentar obtener al menos el email
      fetchSessionDetails();
    }
  };

  const fetchSessionDetails = async () => {
    try {
      const response = await fetch(`/api/checkout/session?session_id=${sessionId}`);
      const data = await response.json();
      
      if (response.ok && data.customer_email) {
        setEmail(data.customer_email);
      }
    } catch (error) {
      console.error('Error fetching session details:', error);
    }
  };

  const resendMagicLink = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'No se pudo obtener tu email. Intenta usar la página de acceso.' });
      return;
    }

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
          text: `✅ Magic Link reenviado a ${email}. Revisa tu correo (incluyendo spam).` 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Error reenviando el enlace. Inténtalo de nuevo.' 
        });
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
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {sessionId ? (
              <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            ) : (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            )}
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            ✅ ¡Gracias por tu compra!
          </h1>
          
          {sessionId && !email && !message && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-blue-800 text-sm">Procesando tu acceso...</span>
              </div>
            </div>
          )}
          
          <p className="text-gray-600 mb-4">
            Hemos enviado tu link de acceso a:
          </p>
          
          {email ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <p className="font-semibold text-blue-900 break-all">
                📧 {email}
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
              <p className="text-gray-600 text-sm">
                Cargando detalles del email...
              </p>
            </div>
          )}
        </div>

        {/* Session Info - Simplified */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-green-900 mb-2 flex items-center">
            🔒 Sesión Configurada
          </h4>
          <div className="text-sm text-green-800">
            <p>
              <span className="font-medium">Duración:</span> 30 días
            </p>
            <p className="mt-1">
              ✅ Tu sesión se mantendrá activa por 30 días para que no tengas que autenticarte cada vez que estudies
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">
            📧 Próximos pasos:
          </h3>
          <ol className="text-sm text-blue-800 space-y-2 text-left">
            <li className="flex items-start">
              <span className="font-semibold mr-2">1.</span>
              <span>Revisa tu correo (incluyendo spam y promociones)</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">2.</span>
              <span>Busca el email de SpeakFuel</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">3.</span>
              <span>Haz clic en "Acceder al curso"</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">4.</span>
              <span>¡Comienza a aprender inglés!</span>
            </li>
          </ol>
        </div>

        {/* Email troubleshooting */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-yellow-900 mb-2">
            ⚠️ ¿No ves el email?
          </h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Revisa tu carpeta de spam/correo no deseado</li>
            <li>• Verifica la carpeta de promociones (Gmail)</li>
            <li>• Puede tomar hasta 5 minutos en llegar</li>
            <li>• Usa el botón de reenvío de abajo</li>
          </ul>
        </div>

        {/* Resend Button */}
        <div className="mb-6">
          <button
            onClick={resendMagicLink}
            disabled={loading || !email}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2"></div>
                Reenviando...
              </div>
            ) : (
              email ? `Reenviar link a ${email}` : 'Reenviar link si no te llegó'
            )}
          </button>
          
          {!email && (
            <p className="text-xs text-gray-500 mt-2">
              Esperando detalles de la compra...
            </p>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        {/* Support */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">
            ¿Problemas para acceder?
          </p>
          <div className="space-y-2">
            <a 
              href="/acceso" 
              className="block text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              Usar página de acceso
            </a>
            <p className="text-xs text-gray-400">
              o escríbenos a hola@speakfuel.com
            </p>
          </div>
        </div>

        {/* Purchase Details */}
        {sessionId && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              ID de compra: {sessionId.slice(0, 8)}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 