import { stripe } from '@/lib/stripe/config';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { session_id } = await request.json();

    if (!session_id) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Obtener detalles de la sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    const customerEmail = session.customer_email || session.customer_details?.email;
    const rememberMe = session.metadata?.remember_me === 'true';
    const sessionDuration = parseInt(session.metadata?.session_duration || '259200'); // Default 3 days
    
    console.log(`🔒 Processing with session preferences: Remember=${rememberMe}, Duration=${Math.floor(sessionDuration / (24 * 60 * 60))}days`);

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'No customer email found' },
        { status: 400 }
      );
    }

    console.log('🎉 Processing payment for:', customerEmail);

    const supabase = createAdminClient();

          try {
        // 1. Crear usuario en auth si no existe
        console.log('🔧 Creating user in Supabase Auth...');
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: customerEmail,
          email_confirm: true,
        });

        console.log('Auth response:', { authData: authData?.user?.id, authError });

        let userId = authData?.user?.id;

        // Si ya existe, obtener su ID
        if (authError && (authError.message.includes('already been registered') || authError.code === 'email_exists')) {
          console.log('👤 User already exists, fetching user ID...');
          const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
          
          if (listError) {
            console.error('❌ Error listing users:', listError);
            return NextResponse.json({ 
              error: 'Failed to list users', 
              details: listError.message 
            }, { status: 500 });
          } else if (listData.users) {
            const existingUser = listData.users.find((user: any) => user.email === customerEmail);
            if (existingUser) {
              userId = existingUser.id;
              console.log('✅ Found existing user ID:', userId);
            } else {
              console.error('❌ User not found in list despite "already registered" error');
              return NextResponse.json({ 
                error: 'User inconsistency error' 
              }, { status: 500 });
            }
          }
        } else if (authError) {
          console.error('❌ Error creating user:', authError);
          return NextResponse.json({ 
            error: 'User creation failed', 
            details: authError.message 
          }, { status: 500 });
        }

        if (!userId) {
          console.error('❌ Could not create or find user for email:', customerEmail);
          return NextResponse.json({ 
            error: 'User creation failed - no user ID obtained' 
          }, { status: 500 });
        }

        console.log('✅ User processing successful, ID:', userId);

      // 2. Otorgar acceso pagado
      console.log('💰 Granting paid access...');
      const { data: accessData, error: accessError } = await supabase
        .rpc('grant_paid_access', { user_email: customerEmail });

      if (accessError) {
        console.error('❌ Error granting access:', accessError);
        return NextResponse.json({ error: 'Access grant failed' }, { status: 500 });
      }

      console.log('✅ Access granted:', accessData);

      // 3. Enviar Magic Link con configuración de sesión
      console.log('📨 Sending magic link with session preferences...');
      
      const redirectUrl = new URL('/auth/callback', process.env.NEXT_PUBLIC_SITE_URL!);
      // Agregar parámetros para configurar la sesión
      if (rememberMe) {
        redirectUrl.searchParams.set('remember', 'true');
        redirectUrl.searchParams.set('duration', sessionDuration.toString());
      }
      
      const { error: magicLinkError } = await supabase.auth.signInWithOtp({
        email: customerEmail,
        options: {
          emailRedirectTo: redirectUrl.toString(),
          shouldCreateUser: false,
          data: {
            remember_me: rememberMe,
            session_duration: sessionDuration
          }
        },
      });

      if (magicLinkError) {
        console.error('❌ Error sending magic link:', magicLinkError);
        return NextResponse.json({ 
          error: 'Magic link failed', 
          details: magicLinkError.message 
        }, { status: 500 });
      }

      console.log('✅ Magic link sent successfully');

      return NextResponse.json({
        success: true,
        message: 'Payment processed successfully',
        customer_email: customerEmail
      });

    } catch (error: any) {
      console.error('Error processing payment:', error);
      return NextResponse.json(
        { error: 'Processing failed', details: error.message },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'API failed', details: error.message },
      { status: 500 }
    );
  }
} 