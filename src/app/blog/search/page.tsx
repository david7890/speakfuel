import { Metadata } from 'next';
import Link from 'next/link';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { searchPosts } from '@/lib/blog/utils';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogSearch } from '@/components/blog/BlogSearch';

interface PageProps {
  searchParams: { q?: string; page?: string };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  
  return {
    title: query ? `Búsqueda: "${query}" - Blog SpeakFuel` : 'Buscar - Blog SpeakFuel',
    description: query 
      ? `Resultados de búsqueda para "${query}" en el blog de SpeakFuel`
      : 'Busca artículos en el blog de SpeakFuel',
    robots: {
      index: false, // No indexar páginas de búsqueda
      follow: true,
    },
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const postsPerPage = 12;
  
  const allResults = query ? await searchPosts(query) : [];
  const totalPages = Math.ceil(allResults.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const results = allResults.slice(startIndex, endIndex);

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-blue-600 transition-colors flex items-center space-x-1">
              <HomeIcon className="w-4 h-4" />
              <span>Inicio</span>
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />
            <Link href="/blog" className="hover:text-blue-600 transition-colors">
              Blog
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-400" />
            <span className="text-gray-900 font-medium">
              Buscar
            </span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Buscar en el blog
        </h1>
        
        {/* Barra de búsqueda */}
        <div className="max-w-2xl">
          <BlogSearch placeholder="¿Qué quieres aprender?" />
        </div>
      </div>

      {/* Resultados */}
      {query && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            {allResults.length > 0 ? (
              <>
                {allResults.length} resultado{allResults.length !== 1 ? 's' : ''} para &quot;{query}&quot;
              </>
            ) : (
              <>No se encontraron resultados para &quot;{query}&quot;</>
            )}
          </h2>
          
          {allResults.length === 0 && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No encontramos lo que buscas
              </h3>
              <p className="text-gray-600 mb-6">
                Intenta con términos diferentes o navega por nuestras categorías.
              </p>
              <Link
                href="/blog"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver todos los artículos
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Grid de resultados */}
      {results.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {results.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                {currentPage > 1 && (
                  <Link
                    href={`/blog/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}`}
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
                  >
                    Anterior
                  </Link>
                )}
                
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                
                {currentPage < totalPages && (
                  <Link
                    href={`/blog/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
                  >
                    Siguiente
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Sugerencias si no hay query */}
      {!query && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { term: 'gramática', emoji: '📚' },
            { term: 'vocabulario', emoji: '📝' },
            { term: 'pronunciación', emoji: '🗣️' },
            { term: 'listening', emoji: '👂' },
            { term: 'speaking', emoji: '💬' },
            { term: 'consejos', emoji: '💡' },
          ].map((suggestion) => (
            <Link
              key={suggestion.term}
              href={`/blog/search?q=${suggestion.term}`}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-center group"
            >
              <div className="text-4xl mb-3">{suggestion.emoji}</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 capitalize">
                {suggestion.term}
              </h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
