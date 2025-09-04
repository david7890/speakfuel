import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Esta API solo funciona en desarrollo' }, { status: 403 });
  }

  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    const supabase = createAdminClient();
    
    // 1. Crear/encontrar usuario
    let user;
    try {
      // Intentar crear usuario
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: 'testing123', // Contraseña estándar para testing
        email_confirm: true,
        user_metadata: {
          name: `Test User ${email.split('@')[0]}`
        }
      });
      
      if (createError && createError.message.includes('already registered')) {
        // Si ya existe, obtenerlo
        const { data: existingUser, error: getUserError } = await supabase.auth.admin.getUserById(
          createError.message.includes('User already registered') ? 
            await getUserByEmail(supabase, email) : 
            ''
        );
        
        if (getUserError || !existingUser) {
          // Intentar con listUsers
          const { data: users } = await supabase.auth.admin.listUsers();
          const foundUser = users.users.find(u => u.email === email);
          
          if (foundUser) {
            user = foundUser;
          } else {
            return NextResponse.json({ error: 'Usuario ya existe pero no se pudo encontrar' }, { status: 400 });
          }
        } else {
          user = existingUser.user;
        }
      } else if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 400 });
      } else {
        user = newUser.user;
      }
    } catch (error) {
      // Fallback: buscar usuario existente
      const { data: users } = await supabase.auth.admin.listUsers();
      const foundUser = users.users.find(u => u.email === email);
      
      if (foundUser) {
        user = foundUser;
      } else {
        return NextResponse.json({ error: 'Error creando usuario' }, { status: 500 });
      }
    }
    
    if (!user) {
      return NextResponse.json({ error: 'No se pudo crear o encontrar el usuario' }, { status: 500 });
    }

    // 2. Otorgar acceso pagado usando la función SQL
    const { data: accessResult, error: accessError } = await supabase
      .rpc('grant_paid_access', { user_email: email });

    if (accessError) {
      return NextResponse.json({ error: accessError.message }, { status: 500 });
    }

    // 3. Verificar que el perfil fue creado correctamente
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: 'Error verificando perfil' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Acceso de prueba otorgado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        has_paid_access: profile.has_paid_access,
        created_at: user.created_at
      },
      credentials: {
        email,
        password: 'testing123'
      },
      next_steps: [
        'Puedes usar Google OAuth desde cualquier cuenta',
        'O usar email/password con las credenciales mostradas',
        'Accede a /auth/login o /auth/signup para probar'
      ]
    });

  } catch (error) {
    console.error('Error en grant-test-access:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

// Función auxiliar para buscar usuario por email
async function getUserByEmail(supabase: any, email: string) {
  const { data: users } = await supabase.auth.admin.listUsers();
  const user = users.users.find((u: any) => u.email === email);
  return user?.id || null;
} 