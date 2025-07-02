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

  const fetchUserData = async (user: any, timeout: number = 10000): Promise<{ profile: UserProfile | null; progress: LessonProgress[] }> => {
    try {
      console.log('🔍 Fetching user data for:', user.id);
      
      // Envolver toda la operación en un timeout
      const result = await withTimeout((async () => {
        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('❌ Error fetching profile:', profileError);
          
          // Si el perfil no existe, crear uno nuevo
          if (profileError.code === 'PGRST116') {
            console.log('📝 Creating new user profile...');
            
            // Intentar obtener el nombre del checkout (localStorage) o metadatos
            let userName = 'Usuario';
            
            // 1. Primero intentar desde localStorage (checkout)
            if (typeof window !== 'undefined') {
              const pendingName = localStorage.getItem('pending_user_name');
              if (pendingName) {
                userName = pendingName;
                localStorage.removeItem('pending_user_name'); // Limpiar después de usar
                console.log('📝 Using name from checkout:', userName);
              }
            }
            
            // 2. Si no hay nombre del checkout, usar metadatos del usuario
            if (userName === 'Usuario' && user.user_metadata?.name) {
              userName = user.user_metadata.name;
              console.log('📝 Using name from user metadata:', userName);
            }
            
            // 3. Fallback al email
            if (userName === 'Usuario') {
              userName = user.email?.split('@')[0] || 'Usuario';
              console.log('📝 Using name from email:', userName);
            }
            
            const { data: newProfile, error: createError } = await supabase
              .from('user_profiles')
              .insert({
                id: user.id,
                name: userName,
                current_streak: 0,
                longest_streak: 0
              })
              .select()
              .single();
              
            if (createError) {
              // Si ya existe (error de clave duplicada), intentar obtenerlo
              if (createError.code === '23505') {
                console.log('👤 Profile already exists, fetching...');
                const { data: existingProfile } = await supabase
                  .from('user_profiles')
                  .select('*')
                  .eq('id', user.id)
                  .single();
                if (existingProfile) {
                  // Continuar con el perfil existente
                  const { data: progress } = await supabase
                    .from('user_lesson_progress')
                    .select('lesson_id, status, repetitions_completed, questions_completed, last_completed_at')
                    .eq('user_id', user.id)
                    .order('lesson_id');
                  return { profile: existingProfile, progress: progress || [] };
                }
              }
              console.error('❌ Error creating profile:', createError);
              return { profile: null, progress: [] };
            }
            
            // Crear progreso inicial para lección 1 solo si el perfil es nuevo
            await supabase
              .from('user_lesson_progress')
              .upsert({
                user_id: user.id,
                lesson_id: 1,
                status: 'available',
                repetitions_completed: 0,
                questions_completed: false
              });
              
            console.log('✅ Profile created successfully');
            return { profile: newProfile, progress: [{ lesson_id: 1, status: 'available', repetitions_completed: 0, questions_completed: false, last_completed_at: null }] };
          }
          
          return { profile: null, progress: [] };
        }

        // Fetch lesson progress
        const { data: progress, error: progressError } = await supabase
          .from('user_lesson_progress')
          .select('lesson_id, status, repetitions_completed, questions_completed, last_completed_at')
          .eq('user_id', user.id)
          .order('lesson_id');

        if (progressError) {
          console.error('❌ Error fetching progress:', progressError);
          return { profile, progress: [] };
        }

        console.log('✅ User data fetched successfully');
        return { profile, progress: progress || [] };
      })(), timeout);

      return result;
      
    } catch (error) {
      if (error instanceof Error && error.message.includes('timed out')) {
        console.error('⏰ Fetch user data timed out after', timeout, 'ms');
        throw new Error('La carga está tardando más de lo esperado. Por favor, intenta recargar la página.');
      }
      console.error('❌ Unexpected error:', error);
      throw error;
    }
  };

  // Función de reintentos con backoff exponencial
  const fetchUserDataWithRetry = async (user: any, maxRetries: number = 3): Promise<{ profile: UserProfile | null; progress: LessonProgress[] }> => {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const timeout = Math.min(5000 * attempt, 15000); // 5s, 10s, 15s
        console.log(`🔄 Attempt ${attempt}/${maxRetries} to fetch user data (timeout: ${timeout}ms)`);
        
        const result = await fetchUserData(user, timeout);
        setRetryCount(0); // Reset retry count on success
        return result;
      } catch (error) {
        lastError = error as Error;
        console.error(`❌ Attempt ${attempt}/${maxRetries} failed:`, error);
        
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // Si todos los reintentos fallan, devolver datos mínimos para evitar trapping
    console.error('💥 All retry attempts failed, returning minimal data to prevent trapping user');
    setRetryCount(prev => prev + 1);
    
    return {
      profile: {
        id: user.id,
        name: user.email?.split('@')[0] || 'Usuario',
        current_streak: 0,
        longest_streak: 0,
        last_activity_date: null
      },
      progress: [{ lesson_id: 1, status: 'available', repetitions_completed: 0, questions_completed: false, last_completed_at: null }]
    };
  };

  useEffect(() => {
    if (isInitialized) return;
    
    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing auth...');
        
        // Timeout para la inicialización completa
        const initTimeout = setTimeout(() => {
          console.error('⏰ Auth initialization timed out, forcing completion');
          setAuthState({
            user: null,
            profile: null,
            lessonProgress: [],
            isLoading: false,
            error: 'La inicialización tardó más de lo esperado. Por favor, recarga la página.'
          });
          setIsInitialized(true);
        }, 20000); // 20 segundos máximo para inicialización
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('👤 User found in session');
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
          console.log('❌ No user session found');
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
        console.error('❌ Auth initialization error:', error);
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
      console.log('🔄 Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('✅ User signed in, fetching user data...');
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
          console.error('❌ Failed to fetch user data on sign in:', error);
          setAuthState(prev => ({
            ...prev,
            user: session.user,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Error cargando datos'
          }));
        }
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        console.log('🔄 Token refreshed successfully');
        // Mantener datos existentes, solo actualizar sesión
        setAuthState(prev => ({
          ...prev,
          user: session.user
        }));
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        clearRememberMePreference();
        setAuthState({
          user: null,
          profile: null,
          lessonProgress: [],
          isLoading: false,
          error: null
        });
        router.push('/auth/signin');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const signOut = async () => {
    console.log('👋 Signing out user...');
    
    // Limpiar preferencias de remember me
    clearRememberMePreference();
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Sign out error:', error);
    } else {
      console.log('✅ User signed out successfully');
    }
  };

  const refreshUserData = async (): Promise<boolean> => {
    if (!authState.user) {
      console.log('⚠️ No user to refresh data for');
      return false;
    }
    
    try {
      console.log('🔄 Refreshing user data...');
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { profile, progress } = await fetchUserDataWithRetry(authState.user);
      
      setAuthState(prev => ({
        ...prev,
        profile,
        lessonProgress: progress,
        isLoading: false,
        error: null
      }));
      
      console.log('✅ User data refreshed successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to refresh user data:', error);
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
      console.log('🔄 Forcing data refresh...');
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