import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, secret } = await request.json();

    // Verificar secret para debugging (desarrollo - siempre usar secret simple)
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
    const logs: string[] = [];

    try {
      // 1. Crear usuario en auth si no existe
      logs.push(`🔍 Intentando crear usuario: ${email}`);
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        email_confirm: true,
      });

      let userId = authData.user?.id;

      // Si ya existe, obtener su ID
      if (authError && authError.message.includes('already registered')) {
        logs.push('👤 Usuario ya existe, buscando ID...');
        const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
        
        if (listError) {
          logs.push(`❌ Error listando usuarios: ${listError.message}`);
        } else if (listData.users) {
          const existingUser = listData.users.find(user => user.email === email);
          if (existingUser) {
            userId = existingUser.id;
            logs.push(`✅ Usuario encontrado con ID: ${userId}`);
          } else {
            logs.push('❌ Usuario no encontrado en la lista');
          }
        }
      } else if (authError) {
        logs.push(`❌ Error creando usuario: ${authError.message}`);
      } else {
        logs.push(`✅ Usuario creado exitosamente con ID: ${userId}`);
      }

      if (!userId) {
        logs.push('❌ No se pudo obtener userId');
        return NextResponse.json({ error: 'User creation failed', logs });
      }

      // 2. Verificar si existe perfil de usuario
      logs.push('🔍 Verificando perfil de usuario...');
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        logs.push(`❌ Error consultando perfil: ${profileError.message}`);
      } else {
        logs.push(`✅ Perfil encontrado: ${JSON.stringify(profileData)}`);
      }

      // 3. Otorgar acceso pagado
      logs.push('💰 Otorgando acceso pagado...');
      const { data: accessData, error: accessError } = await supabase
        .rpc('grant_paid_access', { user_email: email });

      if (accessError) {
        logs.push(`❌ Error otorgando acceso: ${accessError.message}`);
        return NextResponse.json({ error: 'Access grant failed', logs });
      }

      logs.push(`✅ Acceso otorgado: ${JSON.stringify(accessData)}`);

      // 4. Verificar acceso pagado
      logs.push('🔍 Verificando acceso pagado...');
      const { data: checkData, error: checkError } = await supabase
        .rpc('check_user_paid_access', { user_email: email });

      if (checkError) {
        logs.push(`❌ Error verificando acceso: ${checkError.message}`);
      } else {
        logs.push(`✅ Verificación de acceso: ${JSON.stringify(checkData)}`);
      }

      // 5. Enviar Magic Link
      logs.push('📨 Enviando Magic Link...');
      const { error: magicLinkError } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
          shouldCreateUser: false,
        },
      });

      if (magicLinkError) {
        logs.push(`❌ Error enviando Magic Link: ${magicLinkError.message}`);
      } else {
        logs.push('✅ Magic Link enviado exitosamente');
      }

      return NextResponse.json({
        success: true,
        message: `Proceso completado para ${email}`,
        logs,
        user_id: userId
      });

    } catch (error: any) {
      logs.push(`❌ Error inesperado: ${error.message}`);
      return NextResponse.json({
        error: 'Processing failed',
        logs,
        details: error.message
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: 'Debug API failed', details: error.message },
      { status: 500 }
    );
  }
} 