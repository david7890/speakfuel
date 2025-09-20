import Link from 'next/link';
import { RelatedPost } from '@/types/blog';

interface RelatedPostsProps {
  posts: RelatedPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Artículos relacionados
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <Link href={`/blog/${post.slug}`} className="block p-6">
              {/* Meta información */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('es-ES', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </time>
                {post.readingTime && (
                  <>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                  </>
                )}
              </div>

              {/* Título */}
              <h3 className="font-bold text-gray-900 hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                {post.title}
              </h3>

              {/* Descripción */}
              <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                {post.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 2 && (
                  <span className="text-gray-500 text-xs">
                    +{post.tags.length - 2}
                  </span>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
