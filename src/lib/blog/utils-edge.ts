import { BlogPost, BlogPostMeta } from '@/types/blog';

// Simulación de datos para Edge Runtime
// En producción, estos datos vendrán de una fuente compatible con Edge
const MOCK_POSTS: BlogPost[] = [
  {
    slug: 'ejemplo-post',
    title: 'Post de Ejemplo',
    description: 'Este es un post de ejemplo para testing',
    date: '2024-01-01',
    author: 'David Contreras',
    category: 'Desarrollo',
    tags: ['nextjs', 'typescript'],
    image: '/images/blog/ejemplo.jpg',
    imageAlt: 'Imagen de ejemplo',
    published: true,
    featured: false,
    content: 'Contenido del post...',
    rawContent: 'Contenido del post...',
    excerpt: 'Este es un post de ejemplo...',
    readingTime: {
      text: '5 min de lectura',
      minutes: 5,
      time: 300000,
      words: 1000
    },
    toc: []
  }
];

/**
 * Obtiene un post por su slug - versión compatible con Edge Runtime
 */
export async function getPostBySlugEdge(slug: string): Promise<BlogPost | null> {
  try {
    // En un escenario real, esto vendría de una API o base de datos
    // Por ahora usamos datos simulados
    const post = MOCK_POSTS.find(p => p.slug === slug);
    return post || null;
  } catch (error) {
    console.error(`Error loading post ${slug} in edge runtime:`, error);
    return null;
  }
}

/**
 * Función para obtener datos estáticos de posts
 * Esta función debería ser reemplazada por una llamada a API en el futuro
 */
export function getStaticPostData(slug: string): BlogPost | null {
  // Para casos específicos conocidos, podemos devolver datos hardcodeados
  // Esto es temporal hasta que implementemos una solución más robusta
  
  const commonPosts: Record<string, Partial<BlogPost>> = {
    'introduccion-speakfuel': {
      title: 'Introducción a SpeakFuel',
      description: 'Descubre cómo SpeakFuel puede ayudarte a mejorar tu inglés de manera efectiva',
      date: '2024-09-21',
      author: 'David Contreras',
      category: 'Educación',
      tags: ['inglés', 'aprendizaje', 'speakfuel'],
      readingTime: {
        text: '5 min de lectura',
        minutes: 5,
        time: 300000,
        words: 1000
      }
    },
    'como-aprender-ingles-rapido': {
      title: 'Cómo Aprender Inglés Rápidamente',
      description: 'Estrategias probadas para acelerar tu aprendizaje del inglés',
      date: '2024-09-20',
      author: 'David Contreras',
      category: 'Metodología',
      tags: ['inglés', 'tips', 'aprendizaje rápido'],
      readingTime: {
        text: '7 min de lectura',
        minutes: 7,
        time: 420000,
        words: 1400
      }
    }
  };

  const postData = commonPosts[slug];
  if (!postData) {
    return null;
  }

  return {
    slug,
    title: postData.title!,
    description: postData.description!,
    date: postData.date!,
    author: postData.author!,
    category: postData.category!,
    tags: postData.tags!,
    image: postData.image || '/images/blog/default.jpg',
    imageAlt: postData.imageAlt || postData.title!,
    published: true,
    featured: false,
    content: '',
    rawContent: '',
    excerpt: postData.description!,
    readingTime: postData.readingTime!,
    toc: [],
    seo: undefined
  };
}
