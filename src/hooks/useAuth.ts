'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

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
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    lessonProgress: [],
    isLoading: true
  });
  const [isInitialized, setIsInitialized] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const fetchUserData = async (user: any): Promise<{ profile: UserProfile | null; progress: LessonProgress[] }> => {
    try {
      console.log('🔍 Fetching user data for:', user.id);
      
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
      
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      return { profile: null, progress: [] };
    }
  };

  useEffect(() => {
    if (isInitialized) return;
    
    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing auth...');
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('👤 User found in session');
          const { profile, progress } = await fetchUserData(session.user);
          
          setAuthState({
            user: session.user,
            profile,
            lessonProgress: progress,
            isLoading: false
          });
        } else {
          console.log('❌ No user session found');
          setAuthState({
            user: null,
            profile: null,
            lessonProgress: [],
            isLoading: false
          });
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        setAuthState({
          user: null,
          profile: null,
          lessonProgress: [],
          isLoading: false
        });
        setIsInitialized(true);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      console.log('🔄 Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        const { profile, progress } = await fetchUserData(session.user);
        setAuthState({
          user: session.user,
          profile,
          lessonProgress: progress,
          isLoading: false
        });
      } else if (event === 'SIGNED_OUT') {
        setAuthState({
          user: null,
          profile: null,
          lessonProgress: [],
          isLoading: false
        });
        router.push('/auth/signin');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
  };

  const refreshUserData = async () => {
    if (authState.user) {
      const { profile, progress } = await fetchUserData(authState.user);
      setAuthState(prev => ({
        ...prev,
        profile,
        lessonProgress: progress
      }));
    }
  };

  return {
    ...authState,
    signOut,
    refreshUserData
  };
} 