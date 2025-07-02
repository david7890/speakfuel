import { createAdminClient } from '@/lib/supabase/admin';
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

    const supabase = createAdminClient();
    const diagnostics: any = {};

    try {
      // 1. Verificar si existe en auth.users
      diagnostics.step1 = 'Verificando existencia en auth.users';
      const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        diagnostics.auth_users_error = listError.message;
      } else {
        const authUser = listData.users.find(user => user.email === email);
        diagnostics.auth_user_exists = !!authUser;
        diagnostics.auth_user_id = authUser?.id || null;
        diagnostics.auth_user_created_at = authUser?.created_at || null;
      }

      // 2. Verificar perfil en user_profiles si existe el usuario
      if (diagnostics.auth_user_id) {
        diagnostics.step2 = 'Verificando perfil en user_profiles';
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', diagnostics.auth_user_id)
          .single();

        if (profileError) {
          diagnostics.profile_error = profileError.message;
          diagnostics.profile_exists = false;
        } else {
          diagnostics.profile_exists = true;
          diagnostics.profile_data = {
            has_paid_access: profileData.has_paid_access,
            purchase_date: profileData.purchase_date,
            purchase_email: profileData.purchase_email,
            created_at: profileData.created_at,
            updated_at: profileData.updated_at
          };
        }
      }

      // 3. Probar función check_user_paid_access
      diagnostics.step3 = 'Ejecutando check_user_paid_access';
      const { data: checkData, error: checkError } = await supabase
        .rpc('check_user_paid_access', { user_email: email });

      if (checkError) {
        diagnostics.check_access_error = checkError.message;
      } else {
        diagnostics.check_access_result = checkData;
      }

      // 4. Buscar otros perfiles con el mismo email
      diagnostics.step4 = 'Buscando otros perfiles con el mismo email';
      const { data: otherProfiles, error: otherError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('purchase_email', email);

      if (otherError) {
        diagnostics.other_profiles_error = otherError.message;
      } else {
        diagnostics.other_profiles = otherProfiles;
      }

      // 5. Contar total de usuarios con acceso pagado
      diagnostics.step5 = 'Contando usuarios con acceso pagado';
      const { count, error: countError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('has_paid_access', true);

      if (countError) {
        diagnostics.count_error = countError.message;
      } else {
        diagnostics.total_paid_users = count;
      }

      return NextResponse.json({
        success: true,
        email,
        diagnostics,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      return NextResponse.json({
        error: 'Diagnostic failed',
        details: error.message,
        partial_diagnostics: diagnostics
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