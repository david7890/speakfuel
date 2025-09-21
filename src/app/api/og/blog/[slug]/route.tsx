import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getStaticPostData } from '@/lib/blog/utils-edge';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = getStaticPostData(params.slug);
    
    if (!post) {
      return new Response('Post not found', { status: 404 });
    }

    // Truncar título si es muy largo
    const truncatedTitle = post.title.length > 60 
      ? post.title.substring(0, 57) + '...' 
      : post.title;

    // Truncar descripción
    const truncatedDescription = post.description.length > 120 
      ? post.description.substring(0, 117) + '...' 
      : post.description;

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            fontFamily: 'Inter',
            position: 'relative',
          }}
        >
          {/* Header gradient */}
          <div
            style={{
              height: '200px',
              width: '100%',
              backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 60px',
              position: 'relative',
            }}
          >
            {/* Background pattern */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'url("data:image/svg+xml,%3csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cg fill=\'none\' fill-rule=\'evenodd\'%3e%3cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3e%3ccircle cx=\'20\' cy=\'20\' r=\'1\'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")',
              }}
            />
            
            {/* Brand */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <span style={{ fontSize: '32px', marginRight: '12px' }}>🚀</span>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>SpeakFuel</div>
                <div style={{ fontSize: '18px', opacity: 0.9 }}>Blog</div>
              </div>
            </div>
            
            {/* Category badge */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '12px 20px',
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {post.category}
            </div>
          </div>
          
          {/* Content */}
          <div
            style={{
              flex: 1,
              padding: '60px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* Title */}
            <h1
              style={{
                fontSize: '56px',
                fontWeight: 'bold',
                color: '#1f2937',
                lineHeight: 1.1,
                marginBottom: '24px',
                margin: 0,
              }}
            >
              {truncatedTitle}
            </h1>
            
            {/* Description */}
            <p
              style={{
                fontSize: '24px',
                color: '#6b7280',
                lineHeight: 1.4,
                marginBottom: '32px',
                margin: 0,
              }}
            >
              {truncatedDescription}
            </p>
            
            {/* Meta info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                fontSize: '18px',
                color: '#9ca3af',
              }}
            >
              <span>Por {post.author}</span>
              <span>•</span>
              <span>
                {new Date(post.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              {post.readingTime && (
                <>
                  <span>•</span>
                  <span>{post.readingTime.text}</span>
                </>
              )}
            </div>
          </div>
          
          {/* Tags */}
          <div
            style={{
              padding: '0 60px 40px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {post.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: '500',
                }}
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 4 && (
              <span
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: '500',
                }}
              >
                +{post.tags.length - 4} más
              </span>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating post OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
