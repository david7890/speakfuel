'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { getRememberMePreference, clearRememberMePreference } from '@/lib/auth-helpers';
import { userDataCache } from '@/lib/userDataCache';

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
  isStale?: boolean; // Indica si los datos pueden estar desactualizados
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
  // Intentar cargar datos del cache al inicializar
  const getCachedDataForInit = () => {
    const cached = userDataCache.get();
    if (cached) {
      return {
        profile: cached.profile,
        lessonProgress: cached.lessonProgress,
        isStale: cached.isStale
      };
    }
    return { profile: null, lessonProgress: [], isStale: false };
  };

  const [authState, setAuthState] = useState<AuthState>(() => {
    const cachedData = getCachedDataForInit();
    return {
      user: null,
      profile: cachedData.profile,
      lessonProgress: cachedData.lessonProgress,
      isLoading: true,
      error: null,
      isStale: cachedData.isStale
    };
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const router = useRouter();
  const supabase = createClient();

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
    
    // Si todos los reintentos fallan, devolver datos por defecto en lugar de error
    setRetryCount(prev => prev + 1);
    console.warn('⚠️ Failed to fetch user data after retries, using defaults');
    
    // Devolver datos por defecto para que la app funcione
    return {
      profile: null, // Se creará automáticamente si es necesario
      progress: [] // Sin progreso inicial
    };
  };

  useEffect(() => {
    if (isInitialized) return;
    
    console.log('🔧 Initializing auth hook...');
    
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          try {
            const { profile, progress } = await fetchUserDataWithRetry(session.user);
            
            // ✅ Guardar datos exitosos en cache
            userDataCache.set(profile, progress);
            
            setAuthState({
              user: session.user,
              profile,
              lessonProgress: progress,
              isLoading: false,
              error: null,
              isStale: false // Datos frescos
            });
          } catch (error) {
            console.error('❌ Failed to fetch user data during init:', error);
            
            // ✅ Usar cache como fallback en lugar de datos vacíos
            const cached = userDataCache.get();
            
            setAuthState({
              user: session.user,
              profile: cached?.profile || null,
              lessonProgress: cached?.lessonProgress || [],
              isLoading: false,
              error: null,
              isStale: !!cached?.isStale // Marcar como stale si viene del cache
            });
          }
        } else {
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
        console.error('❌ Error during auth initialization:', error);
        // No establecer error por problemas de inicialización
        setAuthState({
          user: null,
          profile: null,
          lessonProgress: [],
          isLoading: false,
          error: null
        });
        setIsInitialized(true);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('🔄 SIGNED_IN event detected for user:', session.user.id);
        
        // ✅ Solo fetch datos si no tenemos usuario o es diferente usuario
        const shouldFetchData = !authState.user || authState.user.id !== session.user.id;
        
        console.log('🔍 Should fetch data?', shouldFetchData, {
          hasAuthUser: !!authState.user,
          authUserId: authState.user?.id,
          sessionUserId: session.user.id
        });
        
        if (shouldFetchData) {
          console.log('📥 Fetching user data for new/different user');
          try {
            const { profile, progress } = await fetchUserDataWithRetry(session.user);
            
            // ✅ Guardar datos exitosos en cache
            userDataCache.set(profile, progress);
            
            setAuthState({
              user: session.user,
              profile,
              lessonProgress: progress,
              isLoading: false,
              error: null,
              isStale: false // Datos frescos
            });
          } catch (error) {
            console.error('❌ Failed to fetch user data on sign in:', error);
            
            // ✅ Usar cache como fallback
            const cached = userDataCache.get();
            
            setAuthState({
              user: session.user,
              profile: cached?.profile || null,
              lessonProgress: cached?.lessonProgress || [],
              isLoading: false,
              error: null,
              isStale: !!cached?.isStale
            });
          }
        } else {
          console.log('✅ Same user, updating session only (no data fetch)');
          // ✅ Solo actualizar la session, mantener datos existentes
          setAuthState(prev => ({
            ...prev,
            user: session.user,
            isLoading: false,
            error: null
          }));
        }
      } else if (event === 'SIGNED_OUT') {
        clearRememberMePreference();
        // ✅ Limpiar cache al cerrar sesión
        userDataCache.clear();
        
        setAuthState({
          user: null,
          profile: null,
          lessonProgress: [],
          isLoading: false,
          error: null,
          isStale: false
        });
        router.push('/auth/login');
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription...');
      subscription.unsubscribe();
    };
  }, [supabase, router, isInitialized]);

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
      
      // ✅ Guardar datos exitosos en cache
      userDataCache.set(profile, progress);
      
      setAuthState(prev => ({
        ...prev,
        profile,
        lessonProgress: progress,
        isLoading: false,
        error: null,
        isStale: false // Datos frescos
      }));
      
      return true;
    } catch (error) {
      console.error('❌ Error refreshing user data:', error);
      
      // ✅ Marcar cache como stale pero mantener datos existentes
      userDataCache.markStale();
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        isStale: true // Marcar como desactualizado
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