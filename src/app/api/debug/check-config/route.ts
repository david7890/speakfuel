import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const logs: string[] = [];

    // 1. Verificar variables de entorno
    logs.push('🔍 Checking environment variables...');
    
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      NEXT_PUBLIC_SITE_URL: !!process.env.NEXT_PUBLIC_SITE_URL,
    };

    logs.push(`Environment variables: ${JSON.stringify(envCheck)}`);

    // Verificar si faltan variables críticas
    const missingVars = Object.entries(envCheck)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      logs.push(`❌ Missing variables: ${missingVars.join(', ')}`);
      return NextResponse.json({ 
        error: 'Missing environment variables', 
        missing: missingVars,
        logs 
      });
    }

    logs.push('✅ All environment variables present');

    // 2. Intentar conectar con Supabase
    logs.push('🔍 Testing Supabase connection...');
    
    try {
      const supabase = createAdminClient();
      
      // Test básico: obtener configuración
      const { data: authConfig, error: configError } = await supabase.auth.admin.listUsers();
      
      if (configError) {
        logs.push(`❌ Supabase connection failed: ${configError.message}`);
        return NextResponse.json({ 
          error: 'Supabase connection failed', 
          details: configError.message,
          logs 
        });
      }
      
      logs.push(`✅ Supabase connected successfully. Found ${authConfig.users.length} users`);
      
      // 3. Verificar funciones SQL
      logs.push('🔍 Testing SQL functions...');
      
      const { data: testData, error: functionError } = await supabase
        .rpc('check_user_paid_access', { user_email: 'test@example.com' });
      
      if (functionError) {
        logs.push(`❌ SQL function failed: ${functionError.message}`);
        return NextResponse.json({ 
          error: 'SQL function test failed', 
          details: functionError.message,
          logs 
        });
      }
      
      logs.push('✅ SQL functions working correctly');
      
      return NextResponse.json({
        success: true,
        message: 'All configurations are working correctly',
        logs,
        stats: {
          total_users: authConfig.users.length,
          env_vars_ok: true,
          supabase_ok: true,
          sql_functions_ok: true
        }
      });
      
    } catch (supabaseError: any) {
      logs.push(`❌ Supabase setup error: ${supabaseError.message}`);
      return NextResponse.json({ 
        error: 'Supabase setup error', 
        details: supabaseError.message,
        logs 
      });
    }

  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Debug check failed', 
        details: error.message 
      },
      { status: 500 }
    );
  }
} 