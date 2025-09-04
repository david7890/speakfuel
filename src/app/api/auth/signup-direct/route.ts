import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Usar admin client para crear usuario con confirmación automática
    const supabaseAdmin = createAdminClient();
    
    console.log('🔄 Creating user with admin client:', email);
    
    // Crear usuario con email confirmado automáticamente
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // ✅ Confirmar email automáticamente
      user_metadata: {
        name: name || email.split('@')[0]
      }
    });

    if (authError) {
      console.error('❌ Error creating user:', authError);
      
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'Este email ya está registrado' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Error creando usuario' },
        { status: 500 }
      );
    }

    console.log('✅ User created successfully:', authData.user.id);

    // Solo retornar éxito, el login se hará en client-side
    return NextResponse.json({
      success: true,
      message: 'Usuario creado exitosamente',
      user: {
        id: authData.user.id,
        email: authData.user.email
      }
    });

  } catch (error: any) {
    console.error('❌ Unexpected error in signup-direct:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 