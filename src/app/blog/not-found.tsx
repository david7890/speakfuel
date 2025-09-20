import Link from 'next/link';
import { getAllCategories, getRecentPosts } from '@/lib/blog/utils';
import { BlogCard } from '@/components/blog/BlogCard';

export default async function BlogNotFound() {
  const [categories, recentPosts] = await Promise.all([
    getAllCategories(),
    getRecentPosts(3)
  ]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Error 404 */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Artículo no encontrado
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Lo sentimos, el artículo que buscas no existe o ha sido movido. 
              Pero no te preocupes, tenemos mucho contenido interesante para ti.
            </p>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/blog"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Ver todos los artículos
            </Link>
            <Link
              href="/blog/search"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Buscar artículos
            </Link>
            <Link
              href="/"
              className="text-blue-600 px-8 py-3 rounded-lg font-medium hover:text-blue-700 transition-colors"
            >
              Ir al inicio
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Artículos recientes */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Artículos recientes
            </h3>
            {recentPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No hay artículos disponibles.</p>
              </div>
            )}
          </div>

          {/* Sidebar con categorías */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Explorar por categorías
            </h3>
            {categories.length > 0 ? (
              <div className="space-y-3">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/blog/category/${category.slug}`}
                    className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 group-hover:text-blue-700">
                        {category.name}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {category.count}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {category.description}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No hay categorías disponibles.</p>
              </div>
            )}

            {/* CTA */}
            <div className="mt-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
              <h4 className="text-lg font-bold mb-3">
                ¿Buscas aprender inglés?
              </h4>
              <p className="text-blue-100 mb-4">
                Únete a nuestro curso interactivo con lecciones personalizadas.
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
