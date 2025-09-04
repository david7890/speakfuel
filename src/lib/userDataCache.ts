// Cache inteligente para datos del usuario
// Implementa Stale-While-Revalidate para mejor UX

import type { UserProfile, LessonProgress } from '@/hooks/useAuth';

interface CachedUserData {
  profile: UserProfile | null;
  lessonProgress: LessonProgress[];
  timestamp: number;
  isStale: boolean;
}

const CACHE_KEY = 'speakfuel-user-data';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const userDataCache = {
  // Guardar datos exitosos en cache
  set(profile: UserProfile | null, lessonProgress: LessonProgress[]) {
    if (typeof window === 'undefined') return;
    
    const cacheData: CachedUserData = {
      profile,
      lessonProgress,
      timestamp: Date.now(),
      isStale: false
    };
    
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log('💾 User data cached successfully');
    } catch (error) {
      console.warn('⚠️ Failed to cache user data:', error);
    }
  },

  // Obtener datos del cache
  get(): CachedUserData | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;
      
      const data: CachedUserData = JSON.parse(cached);
      const age = Date.now() - data.timestamp;
      
      // Marcar como stale si es muy viejo, pero aún retornarlo
      if (age > CACHE_DURATION) {
        data.isStale = true;
      }
      
      return data;
    } catch (error) {
      console.warn('⚠️ Failed to read cached user data:', error);
      return null;
    }
  },

  // Marcar cache como stale (desactualizado pero usable)
  markStale() {
    if (typeof window === 'undefined') return;
    
    const cached = this.get();
    if (cached) {
      cached.isStale = true;
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
      } catch (error) {
        console.warn('⚠️ Failed to mark cache as stale:', error);
      }
    }
  },

  // Limpiar cache completamente
  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(CACHE_KEY);
    console.log('🗑️ User data cache cleared');
  },

  // Actualizar progreso específico sin perder otros datos
  updateProgress(lessonId: number, updates: Partial<LessonProgress>) {
    if (typeof window === 'undefined') return;
    
    const cached = this.get();
    if (!cached) return;
    
    // Encontrar y actualizar la lección específica
    const updatedProgress = cached.lessonProgress.map(progress => 
      progress.lesson_id === lessonId 
        ? { ...progress, ...updates }
        : progress
    );
    
    // Si no existe, agregar nueva entrada
    const exists = cached.lessonProgress.find(p => p.lesson_id === lessonId);
    if (!exists) {
      updatedProgress.push({
        lesson_id: lessonId,
        status: 'available',
        repetitions_completed: 0,
        questions_completed: false,
        last_completed_at: null,
        ...updates
      } as LessonProgress);
    }
    
    this.set(cached.profile, updatedProgress);
    console.log(`📝 Updated progress for lesson ${lessonId} in cache`);
  },

  // Verificar si hay datos válidos en cache
  hasValidData(): boolean {
    const cached = this.get();
    return !!cached && (cached.profile !== null || cached.lessonProgress.length > 0);
  }
};
