export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 px-4 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          {/* Brand */}
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="ml-2 text-xl font-bold">SpeakFuel</span>
          </div>
          
          {/* Student Access Button */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
            <a 
              href="/auth/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Acceso Estudiantes
            </a>
            
            {/* Contact */}
            <div className="text-center md:text-right">
              <p className="text-gray-400 mb-2">¿Necesitas ayuda?</p>
              <a href="mailto:hola@speakfuel.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                hola@speakfuel.com
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-4 md:mb-0">
              © {currentYear} SpeakFuel. Todos los derechos reservados.
            </div>
            
            <div className="flex flex-wrap gap-6">
              <a href="/terms" className="hover:text-white transition-colors">
                Términos
              </a>
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 