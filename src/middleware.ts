import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // Permitir callback y auth sin restricciones
  if (pathname.startsWith('/auth/')) {
    return res;
  }
  
  // Permitir URLs con fragments de auth
  if (req.nextUrl.hash || req.nextUrl.search.includes('access_token')) {
    return res;
  }

  // Permitir rutas públicas y dashboard (dashboard tiene su propia verificación)
  if (pathname === '/' || pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.startsWith('/dashboard')) {
    console.log('🔒 MIDDLEWARE: Allowing access to:', pathname);
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
    // Obtener sesión actual
    const { data: { session } } = await supabase.auth.getSession();
    
    // Dashboard protection is now handled by the dashboard component itself
    // No middleware protection needed for /dashboard routes

    return res;
  } catch (error) {
    console.error('🔒 MIDDLEWARE: ❌ Error:', error);
    // En caso de error, permitir continuar
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