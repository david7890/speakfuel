import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/blog/utils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://speakfuel.com';
const SITE_NAME = 'SpeakFuel';
const SITE_DESCRIPTION = 'Aprende inglés de forma natural con historias interactivas';

export async function GET() {
  try {
    const posts = await getAllPosts();
    
    const rssItems = posts.map((post) => {
      const postUrl = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = new Date(post.date).toUTCString();
      
      return `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <description><![CDATA[${post.description}]]></description>
          <link>${postUrl}</link>
          <guid isPermaLink="true">${postUrl}</guid>
          <pubDate>${pubDate}</pubDate>
          <author>noreply@speakfuel.com (${post.author})</author>
          <category><![CDATA[${post.category}]]></category>
          ${post.tags.map(tag => `<category><![CDATA[${tag}]]></category>`).join('')}
          ${post.image ? `<enclosure url="${SITE_URL}${post.image}" type="image/jpeg" />` : ''}
          <content:encoded><![CDATA[
            ${post.image ? `<img src="${SITE_URL}${post.image}" alt="${post.imageAlt || post.title}" style="max-width: 100%; height: auto; margin-bottom: 20px;" />` : ''}
            <p><strong>${post.description}</strong></p>
            <p>Lee el artículo completo en: <a href="${postUrl}">${postUrl}</a></p>
            <hr />
            <p>Autor: ${post.author}</p>
            <p>Categoría: ${post.category}</p>
            <p>Tags: ${post.tags.join(', ')}</p>
            ${post.readingTime ? `<p>Tiempo de lectura: ${post.readingTime.text}</p>` : ''}
          ]]></content:encoded>
        </item>
      `.trim();
    }).join('\n');

    const lastBuildDate = posts.length > 0 
      ? new Date(posts[0].date).toUTCString()
      : new Date().toUTCString();

    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/">
  <channel>
    <title><![CDATA[${SITE_NAME} - Blog]]></title>
    <description><![CDATA[${SITE_DESCRIPTION}. Consejos, estrategias y recursos para aprender inglés.]]></description>
    <link>${SITE_URL}/blog</link>
    <language>es-ES</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <managingEditor>noreply@speakfuel.com (${SITE_NAME} Team)</managingEditor>
    <webMaster>noreply@speakfuel.com (${SITE_NAME} Team)</webMaster>
    <copyright>© ${new Date().getFullYear()} ${SITE_NAME}. Todos los derechos reservados.</copyright>
    <category><![CDATA[Educación]]></category>
    <category><![CDATA[Idiomas]]></category>
    <category><![CDATA[Inglés]]></category>
    <generator>Next.js Blog System</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <ttl>60</ttl>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/icon-192x192.svg</url>
      <title><![CDATA[${SITE_NAME}]]></title>
      <link>${SITE_URL}</link>
      <width>192</width>
      <height>192</height>
      <description><![CDATA[${SITE_NAME} Logo]]></description>
    </image>
    ${rssItems}
  </channel>
</rss>`.trim();

    return new NextResponse(rssContent, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}
