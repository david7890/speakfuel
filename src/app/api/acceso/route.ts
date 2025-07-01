import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Verificar si el usuario tiene acceso pagado
    const { data: accessData, error: accessError } = await supabase
      .rpc('check_user_paid_access', { user_email: email });

    if (accessError) {
      console.error('Error checking paid access:', accessError);
      return NextResponse.json(
        { error: 'Error verificando acceso. Inténtalo de nuevo.' },
        { status: 500 }
      );
    }

    // Si no tiene acceso pagado
    if (!accessData.has_access) {
      return NextResponse.json(
        { 
          error: accessData.message || 'No tienes acceso al curso.',
          errorType: accessData.error
        },
        { status: 403 }
      );
    }

    // Si tiene acceso, enviar Magic Link
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        shouldCreateUser: false, // No crear usuario, debe existir
      },
    });

    if (signInError) {
      console.error('Error sending magic link:', signInError);
      return NextResponse.json(
        { error: 'Error enviando el enlace. Inténtalo de nuevo.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '📩 Revisa tu correo. Te enviamos tu link de acceso.'
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Error inesperado. Inténtalo de nuevo.' },
      { status: 500 }
    );
  }
} 