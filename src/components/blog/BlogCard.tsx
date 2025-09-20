import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const cardSizeClass = featured 
    ? 'md:col-span-2 lg:col-span-3' 
    : 'col-span-1';

  const imageSizeClass = featured 
    ? 'h-64 md:h-80' 
    : 'h-48';

  return (
    <article className={`group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${cardSizeClass}`}>
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Imagen */}
        <div className={`relative ${imageSizeClass} bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden`}>
          {post.image ? (
            <Image
              src={post.image}
              alt={post.imageAlt || post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes={featured ? "(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 75vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl text-blue-200">📝</div>
            </div>
          )}
          
          {/* Badge de categoría */}
          <div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>
          
          {/* Badge de featured */}
          {post.featured && (
            <div className="absolute top-4 right-4">
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                ⭐ Destacado
              </span>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Meta información */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {post.readingTime && (
              <>
                <span>•</span>
                <span>{post.readingTime.text}</span>
              </>
            )}
            <span>•</span>
            <span>{post.author}</span>
          </div>

          {/* Título */}
          <h2 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2 ${
            featured ? 'text-2xl md:text-3xl' : 'text-xl'
          }`}>
            {post.title}
          </h2>

          {/* Descripción */}
          <p className={`text-gray-600 line-clamp-3 mb-4 ${
            featured ? 'text-lg' : 'text-base'
          }`}>
            {post.excerpt || post.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-gray-500 text-sm">
                +{post.tags.length - 3} más
              </span>
            )}
          </div>

          {/* Call to action */}
          <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
            Leer artículo
            <svg 
              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
}
