import Image from 'next/image';
import Link from 'next/link';

// Componentes personalizados para MDX
export const MDXComponents = {
  // Headings con estilos personalizados y IDs para enlaces
  h1: (props: any) => (
    <h1 
      className="text-4xl font-bold text-gray-900 mb-6 mt-8 scroll-mt-20" 
      {...props} 
    />
  ),
  h2: (props: any) => (
    <h2 
      className="text-3xl font-bold text-gray-900 mb-4 mt-8 scroll-mt-20" 
      {...props} 
    />
  ),
  h3: (props: any) => (
    <h3 
      className="text-2xl font-bold text-gray-900 mb-3 mt-6 scroll-mt-20" 
      {...props} 
    />
  ),
  h4: (props: any) => (
    <h4 
      className="text-xl font-bold text-gray-900 mb-2 mt-4 scroll-mt-20" 
      {...props} 
    />
  ),
  h5: (props: any) => (
    <h5 
      className="text-lg font-bold text-gray-900 mb-2 mt-4 scroll-mt-20" 
      {...props} 
    />
  ),
  h6: (props: any) => (
    <h6 
      className="text-base font-bold text-gray-900 mb-2 mt-4 scroll-mt-20" 
      {...props} 
    />
  ),

  // Párrafos con espaciado mejorado
  p: (props: any) => (
    <p className="text-gray-700 leading-relaxed mb-4 text-lg" {...props} />
  ),

  // Listas con mejor espaciado
  ul: (props: any) => (
    <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2 ml-4" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-inside mb-6 text-gray-700 space-y-2 ml-4" {...props} />
  ),
  li: (props: any) => (
    <li className="leading-relaxed text-lg" {...props} />
  ),

  // Blockquotes con estilo destacado
  blockquote: (props: any) => (
    <blockquote 
      className="border-l-4 border-blue-500 pl-6 py-4 my-6 bg-blue-50 italic text-gray-700 rounded-r-lg" 
      {...props} 
    />
  ),

  // Código inline y bloques
  code: (props: any) => {
    // Si tiene className, es un bloque de código
    if (props.className) {
      return <code {...props} />;
    }
    // Si no, es código inline
    return (
      <code 
        className="bg-gray-100 border border-gray-200 rounded px-2 py-1 text-sm font-mono text-red-600" 
        {...props} 
      />
    );
  },
  pre: (props: any) => (
    <pre 
      className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-6 border border-gray-700" 
      {...props} 
    />
  ),

  // Enlaces con estilos mejorados
  a: (props: any) => {
    // Enlaces internos
    if (props.href?.startsWith('/')) {
      return (
        <Link 
          href={props.href}
          className="text-blue-600 hover:text-blue-800 underline underline-offset-2 decoration-2 hover:decoration-blue-800 transition-colors"
          {...props}
        />
      );
    }
    // Enlaces externos
    return (
      <a 
        className="text-blue-600 hover:text-blue-800 underline underline-offset-2 decoration-2 hover:decoration-blue-800 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    );
  },

  // Imágenes con Next.js Image optimization
  img: (props: any) => {
    // Si tiene dimensiones específicas, usar Image de Next.js
    if (props.width && props.height) {
      return (
        <div className="my-8 rounded-lg overflow-hidden">
          <Image
            {...props}
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>
      );
    }
    // Si no, usar img normal con estilos
    return (
      <img 
        className="rounded-lg my-8 max-w-full h-auto mx-auto shadow-lg" 
        {...props} 
      />
    );
  },

  // Líneas horizontales
  hr: (props: any) => (
    <hr className="my-8 border-gray-300 border-t-2" {...props} />
  ),

  // Tablas con estilos responsivos
  table: (props: any) => (
    <div className="overflow-x-auto my-8 rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200" {...props} />
    </div>
  ),
  thead: (props: any) => (
    <thead className="bg-gray-50" {...props} />
  ),
  tbody: (props: any) => (
    <tbody className="bg-white divide-y divide-gray-200" {...props} />
  ),
  th: (props: any) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
      {...props} 
    />
  ),
  td: (props: any) => (
    <td 
      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200"
      {...props} 
    />
  ),
  tr: (props: any) => (
    <tr className="hover:bg-gray-50 transition-colors" {...props} />
  ),

  // Componentes personalizados
  
  // Caja de advertencia
  Warning: ({ children }: { children: React.ReactNode }) => (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <div className="text-yellow-700">{children}</div>
        </div>
      </div>
    </div>
  ),

  // Caja de información
  Info: ({ children }: { children: React.ReactNode }) => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <div className="text-blue-700">{children}</div>
        </div>
      </div>
    </div>
  ),

  // Caja de éxito
  Success: ({ children }: { children: React.ReactNode }) => (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <div className="text-green-700">{children}</div>
        </div>
      </div>
    </div>
  ),

  // Caja de error
  Error: ({ children }: { children: React.ReactNode }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <div className="text-red-700">{children}</div>
        </div>
      </div>
    </div>
  ),

  // Botón CTA
  CTA: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <div className="text-center my-8">
      <Link
        href={href}
        className="inline-block bg-blue-600 text-white font-bold px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        {children}
      </Link>
    </div>
  ),

  // Video embed responsivo
  Video: ({ src, title }: { src: string; title?: string }) => (
    <div className="relative aspect-video my-8 rounded-lg overflow-hidden shadow-lg">
      <iframe
        src={src}
        title={title || 'Video'}
        className="absolute inset-0 w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  ),
};
