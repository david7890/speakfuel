import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // Permitir callback y signin sin restricciones
  if (pathname.startsWith('/auth/')) {
    return res;
  }
  
  // Permitir URLs con fragments de auth
  if (req.nextUrl.hash || req.nextUrl.search.includes('access_token')) {
    return res;
  }

  // Permitir rutas públicas
  if (pathname === '/' || pathname === '/checkout' || pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return res;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  try {
    // Obtener sesión y renovar automáticamente si es necesario
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.warn('Session error in middleware:', sessionError);
    }
    
    // Log de debug en desarrollo
    if (process.env.NODE_ENV === 'development' && session) {
      const expiresAt = new Date(session.expires_at! * 1000);
      const now = new Date();
      const timeUntilExpiry = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60));
      
      console.log(`🔐 Session active for user ${session.user.id}, expires in ${timeUntilExpiry}min`);
      
      // Advertir si el token expira pronto
      if (timeUntilExpiry < 10) {
        console.log('⚠️ Token expires soon, Supabase should auto-refresh');
      }
    }
    
    // Proteger dashboard - requiere autenticación
    if (pathname.startsWith('/dashboard')) {
      if (!session) {
        console.log('🚫 No session found, redirecting to signin');
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
      
      // Verificar que el usuario tenga acceso pagado (opcional - ya se verifica en useAuth)
      // Esta verificación adicional es por seguridad
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // En caso de error, permitir continuar pero log del error
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 