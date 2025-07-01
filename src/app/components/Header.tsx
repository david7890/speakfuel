'use client';

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">SpeakFuel</span>
          </div>

          {/* Login discreto */}
          <div>
            <a
              href="/acceso"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Acceder
            </a>
          </div>
        </div>
      </div>
    </header>
  );
} 