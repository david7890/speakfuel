import { Suspense } from 'react';
import { getAllPosts, getFeaturedPosts, getAllCategories, getAllTags } from '@/lib/blog/utils';
import { BlogSearch } from '@/components/blog/BlogSearch';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ClockIcon, 
  UserIcon, 
  CalendarDaysIcon, 
  TagIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  ArrowRightIcon,
  HomeIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Componente de carga
function PostsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6">
            <div className="h-4 bg-gray-200 rounded mb-3"></div>
            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Configuración para SSG con ISR
export const revalidate = 3600; // Revalidar cada hora

async function BlogContent() {
  const [allPosts, featuredPosts, categories, tags] = await Promise.all([
    getAllPosts(),
    getFeaturedPosts(3),
    getAllCategories(),
    getAllTags()
  ]);

  const recentPosts = allPosts.slice(0, 6);

  return (
    <div className="space-y-12">
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
            <span className="text-gray-900 font-medium">Blog</span>
          </li>
        </ol>
      </nav>

      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Blog SpeakFuel
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Descubre consejos, estrategias y recursos para dominar el inglés
        </p>
        
        {/* Barra de búsqueda */}
        <div className="max-w-lg mx-auto">
          <BlogSearch placeholder="Buscar artículos..." />
        </div>
      </div>

      {/* Posts destacados en un diseño similar a la imagen */}
      {featuredPosts.length > 0 && (
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Post principal (izquierda) */}
            {featuredPosts[0] && (
              <div className="lg:col-span-1">
                <Link href={`/blog/${featuredPosts[0].slug}`} className="group block">
                  <article className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
                      {featuredPosts[0].image ? (
                        <Image
                          src={featuredPosts[0].image}
                          alt={featuredPosts[0].imageAlt || featuredPosts[0].title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpenIcon className="w-16 h-16 text-blue-300" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {featuredPosts[0].category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                        <div className="flex items-center space-x-1">
                          <CalendarDaysIcon className="w-4 h-4" />
                          <time dateTime={featuredPosts[0].date}>
                            {new Date(featuredPosts[0].date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </time>
                        </div>
                        {featuredPosts[0].readingTime && (
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{featuredPosts[0].readingTime.text}</span>
                          </div>
                        )}
                        {featuredPosts[0].author && (
                          <div className="flex items-center space-x-1">
                            <UserIcon className="w-4 h-4" />
                            <span>{featuredPosts[0].author}</span>
                          </div>
                        )}
                      </div>
                      
                      <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {featuredPosts[0].title}
                      </h2>
                      
                      <p className="text-gray-600 line-clamp-3 mb-4">
                        {featuredPosts[0].description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {featuredPosts[0].tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-4 text-blue-600 font-medium text-sm flex items-center space-x-1">
                        <span>Leer artículo</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            )}

            {/* Posts secundarios (centro y derecha) */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPosts.slice(1, 3).map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <article className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
                    <div className="relative h-40 bg-gradient-to-br from-purple-100 to-purple-200">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.imageAlt || post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <AcademicCapIcon className="w-12 h-12 text-purple-300" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-center text-xs text-gray-500 mb-2 space-x-3">
                        <div className="flex items-center space-x-1">
                          <CalendarDaysIcon className="w-3 h-3" />
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </time>
                        </div>
                        {post.readingTime && (
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="w-3 h-3" />
                            <span>{post.readingTime.text}</span>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {post.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Artículos recientes en grid limpio */}
      {recentPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Artículos recientes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-200">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.imageAlt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center text-xs text-gray-500 mb-2 space-x-3">
                      <div className="flex items-center space-x-1">
                        <CalendarDaysIcon className="w-3 h-3" />
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </time>
                      </div>
                      {post.readingTime && (
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-3 h-3" />
                          <span>{post.readingTime.text}</span>
                        </div>
                      )}
                      {post.author && (
                        <div className="flex items-center space-x-1">
                          <UserIcon className="w-3 h-3" />
                          <span>{post.author}</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {post.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-blue-600 font-medium text-sm flex items-center space-x-1">
                      <span>Leer artículo</span>
                      <ArrowRightIcon className="w-3 h-3" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA bottom */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">
          ¿Quieres aprender inglés más rápido?
        </h2>
        <p className="text-lg mb-6 opacity-90">
          Únete a nuestro curso interactivo con historias, ejercicios y contenido personalizado.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          Empezar ahora gratis
        </Link>
      </section>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<PostsSkeleton />}>
      <BlogContent />
    </Suspense>
  );
}
