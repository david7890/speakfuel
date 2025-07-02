import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, secret } = await request.json();

    // Verificar secret para admin (desarrollo - siempre usar secret simple)
    const adminSecret = 'debug-secret-123';
    if (secret !== adminSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Otorgar acceso pagado
    const { data, error } = await supabase
      .rpc('grant_paid_access', { user_email: email });

    if (error) {
      console.error('Error granting access:', error);
      return NextResponse.json(
        { error: 'Error otorgando acceso' },
        { status: 500 }
      );
    }

    if (!data.success) {
      return NextResponse.json(
        { error: data.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Acceso pagado otorgado a ${email}`
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Error inesperado' },
      { status: 500 }
    );
  }
} 