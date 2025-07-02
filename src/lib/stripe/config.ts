import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
});

export const STRIPE_CONFIG = {
  PRODUCT_PRICE: 2900, // $29.00 en centavos
  CURRENCY: 'usd',
  PRODUCT_NAME: 'SpeakFuel - Curso Completo de Inglés',
  PRODUCT_DESCRIPTION: 'Método auditivo para hablar inglés con fluidez. 8 lecciones + 30 audios + acceso de por vida.',
} as const; 