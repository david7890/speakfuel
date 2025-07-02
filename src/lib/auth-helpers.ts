// Gestión de preferencias de autenticación

const REMEMBER_ME_KEY = 'speakfuel-remember-me';
const SESSION_DURATION_KEY = 'speakfuel-session-duration';

export interface SessionPreferences {
  rememberMe: boolean;
  sessionDuration: number; // en segundos
}

export const SessionDurations = {
  SHORT: 3 * 24 * 60 * 60,    // 3 días en segundos
  EXTENDED: 30 * 24 * 60 * 60  // 30 días en segundos
} as const;

/**
 * Guardar preferencias de remember me
 */
export function saveRememberMePreference(rememberMe: boolean): void {
  if (typeof window === 'undefined') return;
  
  const preferences: SessionPreferences = {
    rememberMe,
    sessionDuration: rememberMe ? SessionDurations.EXTENDED : SessionDurations.SHORT
  };
  
  localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(preferences));
  localStorage.setItem(SESSION_DURATION_KEY, preferences.sessionDuration.toString());
  
  console.log(`💾 Session preferences saved: ${rememberMe ? '30 días' : '3 días'}`);
}

/**
 * Obtener preferencias de remember me
 */
export function getRememberMePreference(): SessionPreferences {
  if (typeof window === 'undefined') {
    return { rememberMe: false, sessionDuration: SessionDurations.SHORT };
  }
  
  try {
    const stored = localStorage.getItem(REMEMBER_ME_KEY);
    if (stored) {
      const preferences = JSON.parse(stored);
      return {
        rememberMe: preferences.rememberMe || false,
        sessionDuration: preferences.sessionDuration || SessionDurations.SHORT
      };
    }
  } catch (error) {
    console.error('Error reading remember me preference:', error);
  }
  
  return { rememberMe: false, sessionDuration: SessionDurations.SHORT };
}

/**
 * Limpiar preferencias de remember me
 */
export function clearRememberMePreference(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(REMEMBER_ME_KEY);
  localStorage.removeItem(SESSION_DURATION_KEY);
  console.log('🗑️ Session preferences cleared');
}

/**
 * Verificar si una sesión debería persistir
 */
export function shouldPersistSession(): boolean {
  const preferences = getRememberMePreference();
  return preferences.rememberMe;
}

/**
 * Obtener duración de sesión actual
 */
export function getSessionDuration(): number {
  const preferences = getRememberMePreference();
  return preferences.sessionDuration;
}

/**
 * Formatear duración para mostrar al usuario
 */
export function formatSessionDuration(seconds: number): string {
  const days = Math.floor(seconds / (24 * 60 * 60));
  if (days === 1) return '1 día';
  if (days < 30) return `${days} días`;
  if (days === 30) return '1 mes';
  return `${Math.floor(days / 30)} meses`;
} 