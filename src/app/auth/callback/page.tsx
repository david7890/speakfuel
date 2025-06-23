'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Processing auth callback...');
        console.log('📍 Full URL:', window.location.href);
        console.log('📍 Hash:', window.location.hash);
        console.log('📍 Search:', window.location.search);
        
        // Método 1: Verificar query parameters (token_hash)
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');
        
        if (tokenHash && type === 'magiclink') {
          console.log('🎫 Token hash found, verifying...');
          
          try {
            const { data, error } = await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: 'magiclink'
            });
            
            if (error) {
              console.error('❌ Verify OTP error:', error);
              router.push('/auth/signin?error=' + encodeURIComponent('Invalid or expired magic link'));
              return;
            }
            
            if (data.session) {
              console.log('✅ Authentication successful via token hash!');
              console.log('👤 User:', data.session.user.id);
              router.push('/dashboard');
              return;
            }
          } catch (verifyError) {
            console.error('❌ Token verification error:', verifyError);
          }
        }
        
        // Método 2: Procesar hash fragment manualmente
        if (window.location.hash) {
          console.log('🔑 Processing hash fragment...');
          
          // Parsear hash fragment
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const expiresIn = hashParams.get('expires_in');
          const tokenType = hashParams.get('token_type');
          const hashType = hashParams.get('type');
          
          console.log('🎫 Tokens found:', {
            accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : 'null',
            refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : 'null',
            expiresIn,
            tokenType,
            type: hashType
          });
          
          if (accessToken && hashType === 'magiclink') {
            try {
              // Establecer la sesión manualmente
              console.log('📝 Setting session manually...');
              
              const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || '',
              });
              
              if (error) {
                console.error('❌ Error setting session:', error);
                
                // Intentar método alternativo - usando recovery
                if (hashType === 'magiclink') {
                  console.log('🔄 Trying alternative method...');
                  const { error: verifyError } = await supabase.auth.verifyOtp({
                    token_hash: accessToken,
                    type: 'magiclink'
                  });
                  
                  if (verifyError) {
                    console.error('❌ Verify OTP error:', verifyError);
                    router.push('/auth/signin?error=' + encodeURIComponent('Invalid magic link'));
                    return;
                  }
                }
              }
              
              // Verificar que la sesión se estableció correctamente
              const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
              
              if (sessionError) {
                console.error('❌ Session verification error:', sessionError);
                router.push('/auth/signin?error=' + encodeURIComponent('Session verification failed'));
                return;
              }
              
              if (sessionData.session) {
                console.log('✅ Session established successfully!');
                console.log('👤 User:', sessionData.session.user.id);
                
                // Limpiar URL y redirigir
                window.history.replaceState({}, document.title, window.location.pathname);
                router.push('/dashboard');
                return;
              } else {
                console.log('❌ No session after setting tokens');
              }
              
            } catch (sessionError) {
              console.error('❌ Session error:', sessionError);
            }
          } else {
            console.log('❌ Invalid or missing tokens in hash');
            console.log('Access token present:', !!accessToken);
            console.log('Type:', hashType);
          }
        }
        
        // Método 3: Verificar sesión existente
        console.log('🔍 Checking existing session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session check error:', sessionError);
          router.push('/auth/signin?error=' + encodeURIComponent('Session check failed'));
          return;
        }

        if (session) {
          console.log('✅ Existing session found, redirecting...');
          router.push('/dashboard');
          return;
        }

        // Si llegamos aquí, no hay sesión válida
        console.log('❌ No valid session found');
        router.push('/auth/signin?error=' + encodeURIComponent('Authentication failed'));

      } catch (error) {
        console.error('❌ Unexpected error in auth callback:', error);
        router.push('/auth/signin?error=' + encodeURIComponent('Something went wrong'));
      }
    };

    // Escuchar cambios de auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in via state change, redirecting...');
        // Limpiar URL y redirigir
        window.history.replaceState({}, document.title, window.location.pathname);
        router.push('/dashboard');
      }
    });

    // Dar tiempo a que Supabase procese automáticamente primero
    setTimeout(handleAuthCallback, 500);

    return () => subscription.unsubscribe();
  }, [router, searchParams, supabase]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completando autenticación...</p>
        <p className="text-sm text-gray-400 mt-2">Procesando Magic Link...</p>
        
        {/* Debug info */}
        <div className="mt-4 text-xs text-gray-400">
          <p>Si esto tarda más de 10 segundos, revisa la consola del navegador</p>
        </div>
      </div>
    </div>
  );
} 