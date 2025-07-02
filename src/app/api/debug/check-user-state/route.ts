import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Solo funciona en desarrollo
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Only available in development' }, { status: 403 });
    }

    const { email, secret } = await request.json();

    // Verificar secret simple para desarrollo
    if (secret !== 'debug_reset_2024') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email válido requerido' }, { status: 400 });
    }

    console.log('🔍 Checking user state for:', email);

    const supabase = createAdminClient();

    // 1. Buscar usuario en auth.users
    const { data: users, error: searchError } = await supabase.auth.admin.listUsers();
    
    if (searchError) {
      console.error('❌ Error searching users:', searchError);
      return NextResponse.json({ error: 'Error searching users' }, { status: 500 });
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json({ 
        found: false,
        message: 'Usuario no encontrado en auth.users',
        email
      });
    }

    console.log('👤 Found user in auth.users:', user.id);

    // 2. Buscar perfil en user_profiles
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('❌ Error getting profile:', profileError);
      return NextResponse.json({ error: 'Error getting profile' }, { status: 500 });
    }

    console.log('📊 User profile:', profile);

    // 3. Probar función check_user_paid_access
    let checkResult = null;
    try {
      const { data: funcResult, error: funcError } = await supabase
        .rpc('check_user_paid_access', { user_email: email });

      if (funcError) {
        console.error('❌ Function error:', funcError);
        checkResult = { error: funcError.message };
      } else {
        checkResult = funcResult;
      }
    } catch (funcException: any) {
      console.error('❌ Function exception:', funcException);
      checkResult = { error: funcException.message };
    }

    console.log('🔍 Function result:', checkResult);

    return NextResponse.json({ 
      found: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      profile: profile,
      function_result: checkResult,
      raw_has_paid_access: profile?.has_paid_access,
      debug_info: {
        has_paid_access_type: typeof profile?.has_paid_access,
        has_paid_access_value: profile?.has_paid_access,
        is_exactly_true: profile?.has_paid_access === true,
        is_exactly_false: profile?.has_paid_access === false,
        is_null: profile?.has_paid_access === null,
        is_not_true: profile?.has_paid_access !== true
      }
    });

  } catch (error: any) {
    console.error('❌ Check user state error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 