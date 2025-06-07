import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SpeakFuel - Aprende Inglés con Historias Interactivas",
  description: "Domina el inglés de forma natural con nuestro método revolucionario de historias interactivas. Audio, ejercicios y mini-historias diseñadas para hispanohablantes.",
  keywords: "aprender inglés, inglés para hispanohablantes, historias interactivas, inglés conversacional, curso de inglés online",
  authors: [{ name: "SpeakFuel" }],
  creator: "SpeakFuel",
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
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
