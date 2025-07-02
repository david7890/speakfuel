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

    console.log('🧹 Resetting user for testing:', email);

    const supabase = createAdminClient();

    // 1. Buscar usuario por email
    const { data: users, error: searchError } = await supabase.auth.admin.listUsers();
    
    if (searchError) {
      console.error('❌ Error searching users:', searchError);
      return NextResponse.json({ error: 'Error searching users' }, { status: 500 });
    }

    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json({ 
        message: 'Usuario no encontrado (ya limpio)',
        details: `No existe usuario con email: ${email}`
      });
    }

    console.log('👤 Found user:', user.id);

    // 2. Resetear acceso pagado en user_profiles (método más seguro)
    console.log('🔄 Updating user profile with explicit values...');
    
    const { data: updateData, error: profileError } = await supabase
      .from('user_profiles')
      .update({ 
        has_paid_access: false,
        purchase_date: null,
        purchase_email: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select('has_paid_access, purchase_date, purchase_email, updated_at');

    if (profileError) {
      console.error('❌ Error resetting paid access:', profileError);
      return NextResponse.json({ error: 'Error resetting paid access' }, { status: 500 });
    }

    console.log('✅ Paid access reset, updated data:', updateData);

    // 2.1. Verificar que el reset funcionó
    const { data: verifyData, error: verifyError } = await supabase
      .from('user_profiles')
      .select('has_paid_access, purchase_date, purchase_email')
      .eq('id', user.id)
      .single();

    if (verifyError) {
      console.error('❌ Error verifying reset:', verifyError);
    } else {
      console.log('🔍 User profile after reset:', verifyData);
    }

    // 2.2. Probar función check_user_paid_access
    let checkResult = null;
    try {
      const { data: funcResult, error: checkError } = await supabase
        .rpc('check_user_paid_access', { user_email: email });

      if (checkError) {
        console.error('❌ Error checking paid access:', checkError);
        checkResult = { error: checkError.message };
      } else {
        console.log('🔍 check_user_paid_access result:', funcResult);
        checkResult = funcResult;
      }
    } catch (checkFuncError: any) {
      console.error('❌ check_user_paid_access function error:', checkFuncError);
      checkResult = { error: checkFuncError.message };
    }

    // 3. Opcional: Resetear progreso de lecciones
    const { error: progressError } = await supabase
      .from('user_lesson_progress')
      .delete()
      .eq('user_id', user.id);

    if (progressError) {
      console.log('⚠️ Progress deletion error:', progressError);
    } else {
      console.log('✅ Lesson progress reset');
    }

    // 4. Opcional: Resetear actividad diaria
    const { error: activityError } = await supabase
      .from('user_daily_activity')
      .delete()
      .eq('user_id', user.id);

    if (activityError) {
      console.log('⚠️ Activity deletion error:', activityError);
    } else {
      console.log('✅ Daily activity reset');
    }

    console.log('✅ User access completely reset (user preserved)');

    return NextResponse.json({ 
      success: true,
      message: 'Acceso pagado reseteado exitosamente',
      details: {
        email,
        userId: user.id,
        paidAccessReset: true,
        progressReset: !progressError,
        activityReset: !activityError,
        userPreserved: true,
        updatedProfile: updateData?.[0] || null,
        verificationResult: verifyData,
        functionCheckResult: checkResult
      }
    });

  } catch (error: any) {
    console.error('❌ Reset user error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 