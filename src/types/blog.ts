export interface BlogPostMeta {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  category: string;
  image?: string;
  imageAlt?: string;
  slug: string;
  published: boolean;
  featured?: boolean;
  excerpt?: string;
  readingTime?: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
}

export interface BlogPost extends BlogPostMeta {
  content: string;
  rawContent: string;
  toc?: TableOfContentsItem[];
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

export interface BlogCategory {
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface BlogTag {
  name: string;
  slug: string;
  count: number;
}

export interface RelatedPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime?: string;
}

export interface BlogPageProps {
  posts: BlogPost[];
  totalPages: number;
  currentPage: number;
  categories: BlogCategory[];
  tags: BlogTag[];
}

export interface BlogSearchResult {
  posts: BlogPost[];
  query: string;
  totalResults: number;
}
