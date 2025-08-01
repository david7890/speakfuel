import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: true,        // Renovar tokens automáticamente
        persistSession: true,          // Persistir sesión en localStorage  
        detectSessionInUrl: true,      // Detectar sesión en callback URLs
        flowType: 'pkce',             // Usar PKCE para seguridad
        debug: process.env.NODE_ENV === 'development', // Debug en desarrollo
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: 'speakfuel-auth-token', // Clave personalizada
      },
      global: {
        headers: {
          'X-Client-Info': 'speakfuel-web'
        }
      }
    }
  )
} 