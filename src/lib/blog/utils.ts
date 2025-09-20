import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { BlogPost, BlogPostMeta, RelatedPost, BlogCategory, BlogTag } from '@/types/blog';

const POSTS_DIRECTORY = path.join(process.cwd(), 'src/data/blog/posts');

// Cache para posts en desarrollo
let postsCache: BlogPost[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutos en desarrollo

/**
 * Obtiene todos los archivos MDX del directorio de posts
 */
function getPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    return [];
  }
  return fs.readdirSync(POSTS_DIRECTORY).filter(file => file.endsWith('.mdx'));
}

/**
 * Valida los metadatos requeridos de un post
 */
function validatePostMeta(meta: any, slug: string): BlogPostMeta {
  const requiredFields = ['title', 'description', 'date', 'author', 'tags', 'category'];
  
  for (const field of requiredFields) {
    if (!meta[field]) {
      throw new Error(`Post ${slug} is missing required field: ${field}`);
    }
  }

  if (!Array.isArray(meta.tags)) {
    throw new Error(`Post ${slug} tags must be an array`);
  }

  if (new Date(meta.date).toString() === 'Invalid Date') {
    throw new Error(`Post ${slug} has invalid date format`);
  }

  return {
    title: meta.title,
    description: meta.description,
    date: meta.date,
    author: meta.author,
    tags: meta.tags,
    category: meta.category,
    image: meta.image,
    imageAlt: meta.imageAlt || meta.title,
    slug,
    published: meta.published !== false,
    featured: meta.featured || false,
    excerpt: meta.excerpt,
    seo: meta.seo,
  };
}

/**
 * Genera un excerpt automático del contenido
 */
function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remover markdown básico
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1') // Italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/`(.*?)`/g, '$1') // Inline code
    .replace(/\n\s*\n/g, ' ') // Multiple line breaks
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  const excerpt = plainText.substring(0, maxLength);
  const lastSpace = excerpt.lastIndexOf(' ');
  
  return excerpt.substring(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
}

/**
 * Extrae tabla de contenidos del contenido markdown
 */
function extractTableOfContents(content: string) {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const toc = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    toc.push({
      id,
      title,
      level: level - 1, // Ajustar para que h2 = nivel 1
    });
  }

  return toc;
}

/**
 * Procesa un archivo MDX y retorna el post completo
 */
function processPost(filename: string): BlogPost {
  const slug = filename.replace(/\.mdx$/, '');
  const fullPath = path.join(POSTS_DIRECTORY, filename);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  const { data: meta, content } = matter(fileContents);
  
  // Validar metadatos
  const validatedMeta = validatePostMeta(meta, slug);
  
  // Calcular tiempo de lectura
  const readingTimeData = readingTime(content);
  
  // Generar excerpt si no existe
  const excerpt = validatedMeta.excerpt || generateExcerpt(content);
  
  // Extraer tabla de contenidos
  const toc = extractTableOfContents(content);

  return {
    ...validatedMeta,
    content,
    rawContent: content,
    excerpt,
    readingTime: readingTimeData,
    toc,
  };
}

/**
 * Obtiene todos los posts del blog
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  // Usar cache en desarrollo para mejor performance
  if (process.env.NODE_ENV === 'development' && postsCache && Date.now() - lastCacheTime < CACHE_DURATION) {
    return postsCache;
  }

  const files = getPostFiles();
  const posts = files
    .map(processPost)
    .filter(post => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Actualizar cache
  if (process.env.NODE_ENV === 'development') {
    postsCache = posts;
    lastCacheTime = Date.now();
  }

  return posts;
}

/**
 * Obtiene un post por su slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const filename = `${slug}.mdx`;
    const fullPath = path.join(POSTS_DIRECTORY, filename);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    return processPost(filename);
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}

/**
 * Obtiene posts relacionados basados en tags compartidos
 */
export async function getRelatedPosts(currentPost: BlogPost, limit: number = 3): Promise<RelatedPost[]> {
  const allPosts = await getAllPosts();
  
  const relatedPosts = allPosts
    .filter(post => post.slug !== currentPost.slug)
    .map(post => {
      const sharedTags = post.tags.filter(tag => currentPost.tags.includes(tag));
      return {
        post,
        score: sharedTags.length,
      };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      // Ordenar por score de tags compartidos, luego por fecha
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    })
    .slice(0, limit)
    .map(({ post }) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      tags: post.tags,
      readingTime: post.readingTime?.text,
    }));

  return relatedPosts;
}

/**
 * Obtiene todas las categorías con conteo de posts
 */
export async function getAllCategories(): Promise<BlogCategory[]> {
  const posts = await getAllPosts();
  const categoryMap = new Map<string, number>();

  posts.forEach(post => {
    const count = categoryMap.get(post.category) || 0;
    categoryMap.set(post.category, count + 1);
  });

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description: `Posts sobre ${name}`,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Obtiene todos los tags con conteo de posts
 */
export async function getAllTags(): Promise<BlogTag[]> {
  const posts = await getAllPosts();
  const tagMap = new Map<string, number>();

  posts.forEach(post => {
    post.tags.forEach(tag => {
      const count = tagMap.get(tag) || 0;
      tagMap.set(tag, count + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Obtiene posts por categoría
 */
export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  const category = categorySlug.replace(/-/g, ' ');
  
  return posts.filter(post => 
    post.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Obtiene posts por tag
 */
export async function getPostsByTag(tagSlug: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  const tag = tagSlug.replace(/-/g, ' ');
  
  return posts.filter(post => 
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Busca posts por query
 */
export async function searchPosts(query: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  const searchTerm = query.toLowerCase();
  
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.description.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
}

/**
 * Obtiene posts paginados
 */
export async function getPaginatedPosts(page: number = 1, limit: number = 10) {
  const posts = await getAllPosts();
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    posts: posts.slice(startIndex, endIndex),
    totalPages,
    currentPage: page,
    totalPosts,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Obtiene posts destacados
 */
export async function getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter(post => post.featured).slice(0, limit);
}

/**
 * Obtiene posts recientes
 */
export async function getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.slice(0, limit);
}
