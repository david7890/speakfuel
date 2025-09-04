'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { getRememberMePreference, clearRememberMePreference } from '@/lib/auth-helpers';

export interface UserProfile {
  id: string;
  name: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

export interface LessonProgress {
  lesson_id: number;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  repetitions_completed: number;
  questions_completed: boolean;
  last_completed_at: string | null;
}

interface AuthState {
  user: any | null;
  profile: UserProfile | null;
  lessonProgress: LessonProgress[];
  isLoading: boolean;
  error: string | null;
}

// Función para crear timeout con promesas
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    lessonProgress: [],
    isLoading: true,
    error: null
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const router = useRouter();
  const supabase = createClient();

  // Función para verificar y renovar sesión si es necesario
  const checkAndRefreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Error checking session:', error);
        return null;
      }
      
      if (session) {
        const expiresAt = new Date(session.expires_at! * 1000);
        const now = new Date();
        const timeUntilExpiry = expiresAt.getTime() - now.getTime();
        
        // Si el token expira en menos de 10 minutos, intentar renovar
        if (timeUntilExpiry < 10 * 60 * 1000) {
          console.log('🔄 Token expires soon, attempting refresh...');
          
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error('❌ Error refreshing session:', refreshError);
            // Si no se puede renovar, limpiar preferencias y sesión
            clearRememberMePreference();
            return null;
          }
          
          if (refreshData.session) {
            console.log('✅ Session refreshed successfully');
            return refreshData.session;
          }
        }
        
        return session;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Unexpected error checking session:', error);
      return null;
    }
  }, [supabase]);

  // Función para verificar sesión periódicamente
  useEffect(() => {
    if (!authState.user) return;

    const preferences = getRememberMePreference();
    if (!preferences.rememberMe) return; // Solo para sesiones extendidas
    
    // Verificar sesión cada 30 minutos
    const interval = setInterval(() => {
      checkAndRefreshSession();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [authState.user, checkAndRefreshSession]);

  const fetchUserData = async (user: any, timeout: number = 5000): Promise<{ profile: UserProfile | null; progress: LessonProgress[] }> => {
    try {
      
      // Envolver toda la operación en un timeout
      const result = await withTimeout((async () => {
        // Fetch user profile - ya no verificamos acceso pagado
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // Profile no existe, crear uno nuevo
            let userName = 'Usuario';
            
            // Obtener nombre desde diferentes fuentes
            if (typeof window !== 'undefined') {
              const pendingName = localStorage.getItem('pending_user_name');
              if (pendingName) {
                userName = pendingName;
                localStorage.removeItem('pending_user_name');
              }
            }
            
            if (userName === 'Usuario' && user.user_metadata?.name) {
              userName = user.user_metadata.name;
            }
            
            if (userName === 'Usuario') {
              userName = user.email?.split('@')[0] || 'Usuario';
            }
            
            const { data: newProfile, error: createError } = await supabase
              .from('user_profiles')
              .insert({
                id: user.id,
                name: userName,
                current_streak: 0,
                longest_streak: 0,
                has_paid_access: true // ✅ Acceso automático para todos
              })
              .select()
              .single();
              
            if (createError) {
              if (createError.code === '23505') {
                // Profile ya existe, obtenerlo y actualizar acceso
                const { data: existingProfile, error: updateError } = await supabase
                  .from('user_profiles')
                  .update({ has_paid_access: true }) // ✅ Otorgar acceso automático
                  .eq('id', user.id)
                  .select()
                  .single();
                
                if (existingProfile && !updateError) {
                  // Fetch progress en paralelo
                  const { data: progress } = await supabase
                    .from('user_lesson_progress')
                    .select('lesson_id, status, repetitions_completed, questions_completed, last_completed_at')
                    .eq('user_id', user.id)
                    .order('lesson_id');
                  
                  return { profile: existingProfile, progress: progress || [] };
                }
              }
              throw new Error('Error creating profile');
            }
            
            // Crear progreso inicial para lección 1
            await supabase
              .from('user_lesson_progress')
              .upsert({
                user_id: user.id,
                lesson_id: 1,
                status: 'available',
                repetitions_completed: 0,
                questions_completed: false
              });
              
            return { profile: newProfile, progress: [{ lesson_id: 1, status: 'available', repetitions_completed: 0, questions_completed: false, last_completed_at: null }] };
          }
          
          throw new Error('Error fetching profile');
        }

        // ✅ Otorgar acceso automático si no lo tiene
        if (!profile.has_paid_access) {
          const { data: updatedProfile } = await supabase
            .from('user_profiles')
            .update({ has_paid_access: true })
            .eq('id', user.id)
            .select()
            .single();
          
          if (updatedProfile) {
            profile.has_paid_access = true;
          }
        }

        // Fetch lesson progress en paralelo
        const { data: progress, error: progressError } = await supabase
          .from('user_lesson_progress')
          .select('lesson_id, status, repetitions_completed, questions_completed, last_completed_at')
          .eq('user_id', user.id)
          .order('lesson_id');

        if (progressError) {
          return { profile, progress: [] };
        }

        return { profile, progress: progress || [] };
      })(), timeout);

      return result;
      
    } catch (error) {
      if (error instanceof Error && error.message.includes('timed out')) {
        throw new Error('Conexión lenta. Por favor, intenta recargar la página.');
      }
      throw error;
    }
  };

  // Función de reintentos con backoff exponencial
  const fetchUserDataWithRetry = async (user: any, maxRetries: number = 3): Promise<{ profile: UserProfile | null; progress: LessonProgress[] }> => {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Timeouts optimizados: 5s, 8s, 10s
        const timeout = Math.min(5000 + (attempt - 1) * 2500, 10000);
        
        const result = await fetchUserData(user, timeout);
        setRetryCount(0); // Reset retry count on success
        return result;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s (más rápido)
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // Si todos los reintentos fallan, establecer error pero mantener usuario logueado
    setRetryCount(prev => prev + 1);
    
    // En lugar de devolver datos falsos, lanzar error para que se maneje apropiadamente
    throw new Error('Error de conexión. Por favor, intenta recargar la página.');
  };

  useEffect(() => {
    if (isInitialized) return;
    
    const initializeAuth = async () => {
      try {
        // Timeout para la inicialización completa (optimizado)
        const initTimeout = setTimeout(() => {
          setAuthState({
            user: null,
            profile: null,
            lessonProgress: [],
            isLoading: false,
            error: 'Error de conexión. Por favor, verifica tu conexión e intenta recargar la página.'
          });
          setIsInitialized(true);
        }, 15000); // 15 segundos máximo para inicialización
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          try {
            const { profile, progress } = await fetchUserDataWithRetry(session.user);
            
            clearTimeout(initTimeout);
            setAuthState({
              user: session.user,
              profile,
              lessonProgress: progress,
              isLoading: false,
              error: null
            });
          } catch (error) {
            console.error('❌ Failed to fetch user data during init:', error);
            clearTimeout(initTimeout);
            
            setAuthState({
              user: session.user,
              profile: null,
              lessonProgress: [],
              isLoading: false,
              error: error instanceof Error ? error.message : 'Error cargando datos de usuario'
            });
          }
        } else {
          clearTimeout(initTimeout);
          setAuthState({
            user: null,
            profile: null,
            lessonProgress: [],
            isLoading: false,
            error: null
          });
        }
        setIsInitialized(true);
      } catch (error) {
        setAuthState({
          user: null,
          profile: null,
          lessonProgress: [],
          isLoading: false,
          error: error instanceof Error ? error.message : 'Error de inicialización'
        });
        setIsInitialized(true);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { profile, progress } = await fetchUserDataWithRetry(session.user);
          setAuthState({
            user: session.user,
            profile,
            lessonProgress: progress,
            isLoading: false,
            error: null
          });
        } catch (error) {
          setAuthState(prev => ({
            ...prev,
            user: session.user,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Error cargando datos'
          }));
        }
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        // Mantener datos existentes, solo actualizar sesión
        setAuthState(prev => ({
          ...prev,
          user: session.user
        }));
      } else if (event === 'SIGNED_OUT') {
        clearRememberMePreference();
        setAuthState({
          user: null,
          profile: null,
          lessonProgress: [],
          isLoading: false,
          error: null
        });
        router.push('/auth/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const signOut = async () => {
    // Limpiar preferencias de remember me
    clearRememberMePreference();
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Sign out error:', error);
    }
  };

  const refreshUserData = async (): Promise<boolean> => {
    if (!authState.user) {
      return false;
    }
    
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { profile, progress } = await fetchUserDataWithRetry(authState.user);
      
      setAuthState(prev => ({
        ...prev,
        profile,
        lessonProgress: progress,
        isLoading: false,
        error: null
      }));
      
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error actualizando datos'
      }));
      return false;
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  // Función para forzar re-fetch si el usuario está atrapado
  const forceRefresh = async () => {
    if (authState.user) {
      await refreshUserData();
    } else {
      // Si no hay usuario, intentar re-inicializar
      setIsInitialized(false);
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    }
  };

  return {
    ...authState,
    signOut,
    refreshUserData,
    clearError,
    forceRefresh,
    retryCount
  };
} 