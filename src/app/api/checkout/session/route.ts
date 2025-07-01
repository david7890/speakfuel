import { stripe } from '@/lib/stripe/config';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Obtener detalles de la sesión
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      customer_email: session.customer_email || session.customer_details?.email,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
    });
  } catch (error) {
    console.error('Error retrieving session:', error);
    return NextResponse.json(
      { error: 'Error retrieving session details' },
      { status: 500 }
    );
  }
} 