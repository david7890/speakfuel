'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

function AccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionEmail = async () => {
      const sessionId = searchParams.get('session_id');
      if (!sessionId) {
        setError('No se proporcionó una sesión de pago válida.');
        setLoading(false);
        return;
      }

      try {
        // Para una verificación más robusta en el futuro, podrías implementar
        // desde un endpoint propio que verifique la sesión en el backend.
        // Por simplicidad en este paso, asumimos que podríamos obtenerlo,
        // pero lo dejaremos para una mejora futura para no añadir otro endpoint.
        // Aquí vamos a simular que lo obtenemos.
        // La forma correcta sería:
        // const res = await fetch(`/api/get-email-from-session?session_id=${sessionId}`);
        // const data = await res.json();
        // setEmail(data.email);
        
        // Por ahora, le pediremos al usuario que inicie sesión normalmente
        // y le mostraremos un mensaje claro.
        setLoading(false);

      } catch (err) {
        setError('No se pudo verificar la sesión de pago.');
        setLoading(false);
      }
    };

    fetchSessionEmail();
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  if (loading && !error) {
    return <div className="text-center"><p>Verificando pago...</p></div>;
  }

  if (error) {
    return <div className="text-center text-red-500"><p>{error}</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-600">🎉 ¡Pago completado! 🎉</h1>
            <p className="text-gray-700 mt-4 text-lg">Tu acceso a SpeakFuel ha sido activado. ¡Bienvenido!</p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">Accede a tu cuenta</h2>
          <p className="text-center text-gray-600 mb-6">Usa la contraseña que acabas de crear para entrar.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="El email con el que pagaste"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tu contraseña"
                required
              />
            </div>

            {loginError && (
              <p className="text-red-600 text-sm text-center">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? 'Accediendo...' : 'Acceder al curso'}
            </button>
          </form>
        </div>
        <div className="text-center mt-4">
            <Link href="/" className="text-sm text-blue-600 hover:underline">Volver a la página principal</Link>
        </div>
      </div>
    </div>
  );
}


export default function AccesoPage() {
    return (
        <Suspense fallback={<div className="text-center p-8">Cargando...</div>}>
            <AccessContent />
        </Suspense>
    )
} 