import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://speakfuel.com'),
  title: {
    default: 'SpeakFuel - Aprende Inglés con Historias Interactivas',
    template: '%s | SpeakFuel'
  },
  description: "Domina el inglés de forma natural con nuestro método revolucionario de historias interactivas. Audio, ejercicios y mini-historias diseñadas para hispanohablantes.",
  applicationName: 'SpeakFuel',
  referrer: 'origin-when-cross-origin',
  keywords: ['aprender inglés', 'curso inglés online', 'inglés hispanohablantes', 'historias inglés'],
  authors: [{ name: 'SpeakFuel Team' }],
  creator: 'SpeakFuel',
  publisher: 'SpeakFuel',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',

  openGraph: {
    title: "SpeakFuel - Aprende Inglés con Historias Interactivas",
    description: "Domina el inglés de forma natural con nuestro método revolucionario de historias interactivas.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeakFuel - Aprende Inglés con Historias Interactivas",
    description: "Domina el inglés de forma natural con nuestro método revolucionario de historias interactivas.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} ${nunito.variable} font-nunito antialiased`}>
        {children}
      </body>
    </html>
  );
}
