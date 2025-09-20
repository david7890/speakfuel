import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { MDXComponents } from '@/components/blog/MDXComponents';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/blog/utils';
import { generatePostMetadata, generatePostStructuredData } from '@/lib/blog/seo';
import { StructuredData } from '@/components/blog/StructuredData';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';


interface PageProps {
  params: { slug: string };
}

// Generar metadatos dinámicos
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Artículo no encontrado',
      description: 'El artículo que buscas no existe.',
    };
  }

  return generatePostMetadata(post);
}

// Generar rutas estáticas
export async function generateStaticParams() {
  const posts = await getAllPosts();
  
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Configuración para SSG con ISR
export const revalidate = 3600; // Revalidar cada hora

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post);
  const structuredData = generatePostStructuredData(post);

  return (
    <>
      <StructuredData data={structuredData} />
      
      <div className="max-w-4xl mx-auto">
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
              <span className="text-gray-900 font-medium truncate max-w-xs">
                {post.title}
              </span>
            </li>
          </ol>
        </nav>

        {/* Contenido principal */}
        <article>
            <header className="mb-8">
              {/* Imagen del post */}
              {post.image && (
                <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8">
                  <Image
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 66vw"
                  />
                </div>
              )}

              {/* Meta información */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  {post.category}
                </span>
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
                <span>Por {post.author}</span>
              </div>

              {/* Título */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Descripción */}
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                {post.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </header>

            {/* Contenido del post */}
            <div className="prose prose-lg max-w-none">
              <MDXRemote
                source={post.content}
                components={MDXComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      rehypeHighlight,
                      rehypeSlug,
                      [
                        rehypeAutolinkHeadings,
                        {
                          behavior: 'wrap',
                          properties: {
                            className: ['anchor'],
                          },
                        },
                      ],
                    ],
                  },
                }}
              />
            </div>

            {/* Call to Action Card */}
            <div className="mt-12">
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-center text-white relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">
                    ¿Te gustó este artículo?
                  </h3>
                  <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
                    Únete a miles de estudiantes que ya están mejorando su inglés con nuestro método interactivo
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                      href="/blog"
                      className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors duration-200 min-w-[160px]"
                    >
                      Ver más artículos
                    </Link>
                    <Link
                      href="/dashboard"
                      className="bg-green-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-600 transition-colors duration-200 min-w-[160px]"
                    >
                      Comenzar preparación
                    </Link>
                  </div>
                </div>
              </div>
            </div>
        </article>

        {/* Posts relacionados */}
        <RelatedPosts posts={relatedPosts} />
      </div>
    </>
  );
}
