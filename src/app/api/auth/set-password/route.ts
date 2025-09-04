import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

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

    const supabaseAdmin = createAdminClient();

    // 1. Buscar el usuario en auth.users
    console.log('🔍 Buscando usuario:', email);
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error listando usuarios:', listError);
      return NextResponse.json({ error: 'Error verificando usuario' }, { status: 500 });
    }

    const existingUser = listData.users.find(user => user.email === email);
    
    if (!existingUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    console.log('✅ Usuario encontrado:', existingUser.id);

    // 2. Verificar que el usuario tiene acceso pagado
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('has_paid_access')
      .eq('id', existingUser.id)
      .single();

    if (profileError || !profile?.has_paid_access) {
      console.error('❌ Usuario sin acceso pagado:', profileError);
      return NextResponse.json({ 
        error: 'Este usuario no tiene acceso pagado al curso' 
      }, { status: 403 });
    }

    console.log('✅ Usuario tiene acceso pagado');

    // 3. Establecer la contraseña y confirmar el email
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      existingUser.id,
      {
        password: password,
        email_confirm: true, // Confirmar el email automáticamente
      }
    );

    if (updateError) {
      console.error('❌ Error actualizando contraseña:', updateError);
      return NextResponse.json({ 
        error: 'Error estableciendo contraseña' 
      }, { status: 500 });
    }

    console.log('✅ Contraseña establecida exitosamente');

    // Devolver éxito para que el frontend maneje el login
    return NextResponse.json({
      success: true,
      message: 'Contraseña establecida exitosamente',
      needsLogin: true
    });

  } catch (error: any) {
    console.error('❌ Error en set-password API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 