import { stripe } from '@/lib/stripe/config';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, rememberMe = true, sessionDuration = 30 * 24 * 60 * 60 } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email válido requerido' }, { status: 400 });
    }

    console.log(`🛒 Checkout request for: ${email} (Remember: ${rememberMe ? 'Yes' : 'No'})`);

    // **NUEVA VERIFICACIÓN: Comprobar si ya tiene acceso pagado**
    const supabase = createAdminClient();
    
    try {
      const { data: accessData, error: checkError } = await supabase
        .rpc('check_user_paid_access', { user_email: email });

      if (checkError) {
        console.error('❌ Error checking paid access:', checkError);
        // Continuar con el checkout en caso de error de verificación
      } else if (accessData && accessData.has_access) {
        console.log('🚫 User already has paid access:', email);
        return NextResponse.json({ 
          error: 'Ya tienes acceso al curso', 
          details: 'Tu email ya tiene acceso pagado. Ve a la página de acceso para ingresar.',
          redirect: '/acceso',
          type: 'already_paid'
        }, { status: 400 });
      }
    } catch (verificationError) {
      console.error('❌ Access verification failed:', verificationError);
      // Continuar con el checkout en caso de error
    }

    console.log('✅ User can proceed with payment');

    // **FIX: Detectar URL base automáticamente**
    const getBaseUrl = () => {
      // En producción/preview, usar la variable de entorno
      if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')) {
        return process.env.NEXT_PUBLIC_SITE_URL;
      }
      
      // Para Vercel, usar VERCEL_URL si está disponible
      if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
      }
      
      // Fallback a localhost para desarrollo
      return 'http://localhost:3000';
    };

    const baseUrl = getBaseUrl();
    console.log('🔗 Using base URL:', baseUrl);

    // Crear sesión de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Curso de Inglés - SpeakFuel',
              description: 'Acceso completo al método auditivo para hablar inglés con fluidez',
            },
            unit_amount: 2900, // $29.00 USD
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      success_url: `${baseUrl}/gracias?session_id={CHECKOUT_SESSION_ID}&remember=${rememberMe}&duration=${sessionDuration}`,
      cancel_url: `${baseUrl}/checkout?canceled=true`,
      metadata: {
        customer_email: email,
        remember_me: rememberMe.toString(),
        session_duration: sessionDuration.toString(),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('❌ Checkout error:', error);
    return NextResponse.json(
      { error: 'Error al crear sesión de pago' },
      { status: 500 }
    );
  }
} 