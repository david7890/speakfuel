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
          
          {/* Contact */}
          <div className="text-center md:text-right">
            <p className="text-gray-400 mb-2">¿Necesitas ayuda?</p>
            <a href="mailto:hola@speakfuel.com" className="text-blue-400 hover:text-blue-300 transition-colors">
              hola@speakfuel.com
            </a>
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
              <a href="/acceso" className="hover:text-white transition-colors">
                Acceso estudiantes
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 