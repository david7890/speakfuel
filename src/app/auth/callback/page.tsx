'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Processing OAuth callback...');
        
        // ✅ NUEVO: Obtener email del pago de los parámetros si existe
        const paymentEmail = searchParams.get('payment_email');
        console.log('💳 Payment email from params:', paymentEmail);
        
        // Verificar si hay un error en los parámetros
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          console.error('❌ OAuth error:', error, errorDescription);
          router.push('/auth/signup?error=' + encodeURIComponent(errorDescription || 'Authentication failed'));
          return;
        }
        
        // Obtener sesión actual
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          router.push('/auth/signup?error=' + encodeURIComponent('Session verification failed'));
          return;
        }

        if (session) {
          console.log('✅ OAuth authentication successful!');
          console.log('👤 User:', session.user.id);
          console.log('📧 User email:', session.user.email);
          
          // ✅ NUEVO: Validación crítica - Email debe coincidir con el pago (solo si viene de pago)
          if (paymentEmail && session.user.email) {
            if (session.user.email.toLowerCase().trim() !== paymentEmail.toLowerCase().trim()) {
              console.error('❌ Email mismatch!', {
                userEmail: session.user.email,
                paymentEmail: paymentEmail
              });
              
              // Cerrar sesión para evitar acceso no autorizado
              await supabase.auth.signOut();
              
              const errorMsg = `Debes autenticarte con el email del pago: ${paymentEmail}. Usaste: ${session.user.email}`;
              router.push('/auth/signup?error=' + encodeURIComponent(errorMsg));
              return;
            } else {
              console.log('✅ Email validation passed - user authenticated with payment email');
            }
          }
          
          // Redirigir directamente al dashboard - todos tienen acceso ahora
          console.log('✅ User authenticated, redirecting to dashboard');
          router.push('/dashboard');
          
          return;
        }

        // Si no hay sesión, redirigir a signup
        console.log('❌ No session found');
        router.push('/auth/signup?error=' + encodeURIComponent('Authentication failed'));

      } catch (error) {
        console.error('❌ Unexpected error in auth callback:', error);
        router.push('/auth/signup?error=' + encodeURIComponent('Something went wrong'));
      }
    };

    // Escuchar cambios de auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      console.log('🔄 Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in via state change');
        // Dar tiempo a que se procese antes de redirigir
        setTimeout(() => {
          handleAuthCallback();
        }, 100);
      }
    });

    // Procesar callback inmediatamente
    handleAuthCallback();

    return () => subscription.unsubscribe();
  }, [router, searchParams, supabase]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completando autenticación...</p>
        <p className="text-sm text-gray-400 mt-2">Procesando Google OAuth...</p>
        
        {/* Debug info */}
        <div className="mt-4 text-xs text-gray-400">
          <p>Si esto tarda más de 10 segundos, revisa la consola del navegador</p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
      <AuthCallbackContent />
    </Suspense>
  );
} 