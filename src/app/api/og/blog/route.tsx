import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Blog SpeakFuel';
    const subtitle = searchParams.get('subtitle') || 'Aprende inglés con artículos y consejos';
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'Inter',
            position: 'relative',
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url("data:image/svg+xml,%3csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cg fill=\'none\' fill-rule=\'evenodd\'%3e%3cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3e%3ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")',
            }}
          />
          
          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '40px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ marginRight: '16px' }}>🚀</span>
              SpeakFuel
            </div>
            
            {/* Title */}
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.1,
                marginBottom: '24px',
                maxWidth: '1000px',
                textAlign: 'center',
              }}
            >
              {title}
            </h1>
            
            {/* Subtitle */}
            <p
              style={{
                fontSize: '32px',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.3,
                maxWidth: '800px',
                textAlign: 'center',
              }}
            >
              {subtitle}
            </p>
          </div>
          
          {/* Bottom badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              padding: '16px 24px',
              color: 'white',
              fontSize: '20px',
              fontWeight: '600',
            }}
          >
            Blog
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
