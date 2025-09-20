import { Metadata } from 'next';
import Link from 'next/link';
import { HomeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { generateBlogMetadata, generateBlogStructuredData } from '@/lib/blog/seo';
import { StructuredData } from '@/components/blog/StructuredData';

export const metadata: Metadata = generateBlogMetadata();

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = generateBlogStructuredData();

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header Navigation */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  S
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SpeakFuel
                </div>
              </Link>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/blog" className="text-blue-600 font-medium flex items-center space-x-2">
                  <DocumentTextIcon className="w-5 h-5" />
                  <span>Blog</span>
                </Link>
                <Link 
                  href="/dashboard" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Empezar curso gratis
                </Link>
              </nav>
            </div>
          </div>
        </header>


        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </>
  );
}
