import { stripe } from '@/lib/stripe/config';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  try {
    // Verificar webhook
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Procesar evento de pago exitoso
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_email || session.metadata?.customer_email;
      const rememberMe = session.metadata?.remember_me === 'true';
      const sessionDuration = parseInt(session.metadata?.session_duration || '259200'); // Default 3 days

      console.log('🎉 Processing successful payment for session:', session.id);
      console.log('📧 Customer email:', customerEmail);
      console.log(`🔒 Session preferences: Remember=${rememberMe}, Duration=${Math.floor(sessionDuration / (24 * 60 * 60))}days`);

      if (!customerEmail) {
        console.error('❌ No customer email found in session');
        return NextResponse.json({ error: 'No email found' }, { status: 400 });
      }

      try {
        const supabase = createClient();

        // 1. Crear usuario en auth si no existe
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: customerEmail,
          email_confirm: true,
        });

        let userId = authData.user?.id;

        // Si ya existe, obtener su ID usando listUsers
        if (authError && authError.message.includes('already registered')) {
          console.log('User already exists, fetching user ID...');
          const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
          
          if (listError) {
            console.error('Error listing users:', listError);
          } else if (listData.users) {
            const existingUser = listData.users.find(user => user.email === customerEmail);
            if (existingUser) {
              userId = existingUser.id;
              console.log('Found existing user ID:', userId);
            }
          }
        } else if (authError) {
          console.error('Error creating user:', authError);
        }

        if (!userId) {
          console.error('Could not create or find user for email:', customerEmail);
          return NextResponse.json({ error: 'User creation failed' }, { status: 500 });
        }

        console.log('Processing payment for user ID:', userId);

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
          // No fallar el webhook por esto, el usuario puede usar /acceso
        } else {
          console.log('✅ Magic link sent successfully');
        }

        console.log(`🎯 Payment processed successfully for ${customerEmail}`);
        return NextResponse.json({ received: true });
        
      } catch (error) {
        console.error('Error processing payment:', error);
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
} 