import { Metadata } from 'next';
import { BlogPost } from '@/types/blog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://speakfuel.com';
const SITE_NAME = 'SpeakFuel';

/**
 * Genera metadatos completos para un post del blog
 */
export function generatePostMetadata(post: BlogPost): Metadata {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = post.image ? `${SITE_URL}${post.image}` : `${SITE_URL}/api/og/blog/${post.slug}`;
  
  // SEO personalizado del post o valores por defecto
  const seoTitle = post.seo?.title || post.title;
  const seoDescription = post.seo?.description || post.description;
  const seoKeywords = post.seo?.keywords || [...post.tags, post.category, 'SpeakFuel', 'inglés'];

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    authors: [{ name: post.author }],
    creator: post.author,
    publisher: SITE_NAME,
    
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'article',
      url,
      siteName: SITE_NAME,
      locale: 'es_ES',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.imageAlt || post.title,
          type: 'image/png',
        },
      ],
      authors: [post.author],
      publishedTime: post.date,
      modifiedTime: post.date,
      section: post.category,
      tags: post.tags,
    },
    
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      creator: '@speakfuel',
      site: '@speakfuel',
      images: [imageUrl],
    },
    
    alternates: {
      canonical: url,
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    other: {
      'article:author': post.author,
      'article:published_time': post.date,
      'article:modified_time': post.date,
      'article:section': post.category,
      'article:tag': post.tags.join(', '),
    },
  };
}

/**
 * Genera metadatos para la página principal del blog
 */
export function generateBlogMetadata(): Metadata {
  const url = `${SITE_URL}/blog`;
  
  return {
    title: 'Blog - Aprende Inglés con SpeakFuel',
    description: 'Descubre consejos, estrategias y recursos para dominar el inglés. Artículos sobre aprendizaje de idiomas, gramática, vocabulario y más.',
    keywords: ['blog inglés', 'aprender inglés', 'consejos inglés', 'gramática inglesa', 'vocabulario inglés'],
    
    openGraph: {
      title: 'Blog SpeakFuel - Aprende Inglés',
      description: 'Descubre consejos y estrategias para dominar el inglés.',
      type: 'website',
      url,
      siteName: SITE_NAME,
      locale: 'es_ES',
      images: [
        {
          url: `${SITE_URL}/api/og/blog`,
          width: 1200,
          height: 630,
          alt: 'Blog SpeakFuel',
        },
      ],
    },
    
    twitter: {
      card: 'summary_large_image',
      title: 'Blog SpeakFuel - Aprende Inglés',
      description: 'Descubre consejos y estrategias para dominar el inglés.',
      creator: '@speakfuel',
      site: '@speakfuel',
    },
    
    alternates: {
      canonical: url,
      types: {
        'application/rss+xml': [
          {
            url: `${SITE_URL}/blog/rss.xml`,
            title: 'RSS Feed - Blog SpeakFuel',
          },
        ],
      },
    },
  };
}

/**
 * Genera datos estructurados JSON-LD para un post
 */
export function generatePostStructuredData(post: BlogPost) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = post.image ? `${SITE_URL}${post.image}` : `${SITE_URL}/api/og/blog/${post.slug}`;
  
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: post.title,
        description: post.description,
        image: {
          '@type': 'ImageObject',
          '@id': `${imageUrl}#image`,
          url: imageUrl,
          width: 1200,
          height: 630,
          caption: post.imageAlt || post.title,
        },
        datePublished: post.date,
        dateModified: post.date,
        author: {
          '@type': 'Person',
          '@id': `${SITE_URL}#author-${post.author.toLowerCase().replace(/\s+/g, '-')}`,
          name: post.author,
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${SITE_URL}#organization`,
          name: SITE_NAME,
          logo: {
            '@type': 'ImageObject',
            '@id': `${SITE_URL}/icon-192x192.svg#logo`,
            url: `${SITE_URL}/icon-192x192.svg`,
            width: 192,
            height: 192,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        articleSection: post.category,
        keywords: post.tags.join(', '),
        wordCount: post.readingTime?.words || 0,
        timeRequired: `PT${post.readingTime?.minutes || 1}M`,
        inLanguage: 'es-ES',
        about: post.tags.map(tag => ({
          '@type': 'Thing',
          name: tag,
        })),
      },
      {
        '@type': 'WebPage',
        '@id': url,
        url,
        name: post.title,
        description: post.description,
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${SITE_URL}#website`,
        },
        primaryImageOfPage: {
          '@id': `${imageUrl}#image`,
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          '@id': `${url}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Inicio',
              item: SITE_URL,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Blog',
              item: `${SITE_URL}/blog`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: post.title,
              item: url,
            },
          ],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: 'Aprende inglés de forma natural con historias interactivas',
        inLanguage: 'es-ES',
        publisher: {
          '@id': `${SITE_URL}#organization`,
        },
      },
    ],
  };
}

/**
 * Genera datos estructurados para la página principal del blog
 */
export function generateBlogStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog#blog`,
    url: `${SITE_URL}/blog`,
    name: 'Blog SpeakFuel',
    description: 'Consejos y estrategias para aprender inglés',
    inLanguage: 'es-ES',
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon-192x192.svg`,
        width: 192,
        height: 192,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog`,
    },
  };
}

/**
 * Genera el script JSON-LD como string para insertar en el head
 */
export function generateStructuredDataScript(data: object): string {
  return `<script type="application/ld+json">${JSON.stringify(data, null, 2)}</script>`;
}
