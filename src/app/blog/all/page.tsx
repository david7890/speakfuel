import { Metadata } from 'next';
import Link from 'next/link';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getPaginatedPosts, getAllCategories, getAllTags } from '@/lib/blog/utils';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogPagination } from '@/components/blog/BlogPagination';
import { BlogSearch } from '@/components/blog/BlogSearch';

interface PageProps {
  searchParams: { page?: string; category?: string; tag?: string };
}

export const metadata: Metadata = {
  title: 'Todos los Artículos - Blog SpeakFuel',
  description: 'Explora todos nuestros artículos sobre aprendizaje de inglés, gramática, vocabulario, pronunciación y más.',
  openGraph: {
    title: 'Todos los Artículos - Blog SpeakFuel',
    description: 'Explora todos nuestros artículos sobre aprendizaje de inglés',
    type: 'website',
  },
};

export const revalidate = 3600;

export default async function AllPostsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const postsPerPage = 12;
  
  const [paginatedData, categories, tags] = await Promise.all([
    getPaginatedPosts(currentPage, postsPerPage),
    getAllCategories(),
    getAllTags()
  ]);

  const { posts, totalPages, totalPosts, hasNextPage, hasPrevPage } = paginatedData;

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
              Todos los artículos
            </span>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Contenido principal */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Todos los Artículos
            </h1>
            <p className="text-xl text-gray-600">
              {totalPosts} artículo{totalPosts !== 1 ? 's' : ''} sobre aprendizaje de inglés
            </p>
          </div>

          {/* Barra de búsqueda */}
          <div className="mb-8">
            <BlogSearch placeholder="Buscar en todos los artículos..." />
          </div>

          {/* Grid de posts */}
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>

              {/* Paginación */}
              <BlogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/blog/all"
              />
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay artículos disponibles
              </h3>
              <p className="text-gray-600">
                Vuelve pronto para ver nuevo contenido.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-8">
            {/* Categorías */}
            {categories.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Categorías
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/blog/category/${category.slug}`}
                      className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-700 hover:text-blue-600">
                        {category.name}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {category.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tags populares */}
            {tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Tags Populares
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 15).map((tag) => (
                    <Link
                      key={tag.slug}
                      href={`/blog/tag/${tag.slug}`}
                      className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-3 py-1 rounded-full text-sm transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Newsletter CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-3">
                ¿Te gusta nuestro contenido?
              </h3>
              <p className="text-blue-100 mb-4">
                Únete a nuestro curso interactivo y lleva tu inglés al siguiente nivel.
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-white text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Empezar gratis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
