import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getPostsByTag, getAllTags } from '@/lib/blog/utils';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogPagination } from '@/components/blog/BlogPagination';

interface PageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tagName = resolvedParams.slug.replace(/-/g, ' ');
  const posts = await getPostsByTag(resolvedParams.slug);
  
  if (posts.length === 0) {
    return {
      title: 'Tag no encontrado',
      description: 'El tag que buscas no existe.',
    };
  }

  return {
    title: `#${tagName} - Blog SpeakFuel`,
    description: `Explora todos los artículos etiquetados con ${tagName}. ${posts.length} artículos disponibles.`,
    openGraph: {
      title: `#${tagName} - Blog SpeakFuel`,
      description: `Explora todos los artículos etiquetados con ${tagName}`,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  
  return tags.map((tag) => ({
    slug: tag.slug,
  }));
}

export const revalidate = 3600;

export default async function TagPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const posts = await getPostsByTag(resolvedParams.slug);
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const postsPerPage = 12;
  
  if (posts.length === 0) {
    notFound();
  }

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);
  
  const tagName = resolvedParams.slug.replace(/-/g, ' ');

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
              #{tagName}
            </span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          #{tagName}
        </h1>
        <p className="text-xl text-gray-600">
          {posts.length} artículo{posts.length !== 1 ? 's' : ''} con este tag
        </p>
      </div>

      {/* Posts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {currentPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      {/* Paginación */}
      <BlogPagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/blog/tag/${resolvedParams.slug}`}
      />
    </div>
  );
}
