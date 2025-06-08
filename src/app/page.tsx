import { Metadata } from 'next';
import Header from './components/Header';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';

// Configuración SEO avanzada
export const metadata: Metadata = {
  title: 'SpeakFuel - Aprende Inglés con Historias Interactivas | Curso de Inglés Online',
  description: 'Domina el inglés de forma natural con historias inmersivas, audio nativo y ejercicios interactivos. Método diseñado especialmente para hispanohablantes. ¡Empieza gratis!',
  keywords: [
    'aprender inglés',
    'curso de inglés online', 
    'inglés para hispanohablantes',
    'historias en inglés',
    'inglés conversacional',
    'pronunciación en inglés',
    'vocabulario inglés',
    'SpeakFuel',
    'inglés natural',
    'método inmersivo inglés'
  ],
  authors: [{ name: 'SpeakFuel Team' }],
  creator: 'SpeakFuel',
  publisher: 'SpeakFuel',
  openGraph: {
    title: 'SpeakFuel - Aprende Inglés con Historias Interactivas',
    description: 'Método revolucionario para aprender inglés de forma natural. Historias inmersivas + Audio nativo + Ejercicios interactivos.',
    url: 'https://speakfuel.com',
    siteName: 'SpeakFuel',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SpeakFuel - Aprende Inglés con Historias Interactivas',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpeakFuel - Aprende Inglés con Historias Interactivas',
    description: 'Método revolucionario para aprender inglés de forma natural con historias inmersivas.',
    images: ['/og-image.jpg'],
    creator: '@speakfuel',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://speakfuel.com',
  },
  category: 'education',
};

// Forzar SSG - Página completamente estática
export const dynamic = 'force-static';
export const revalidate = false;

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Benefits />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
