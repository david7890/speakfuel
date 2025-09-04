'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

interface EmailAuthFormProps {
  mode: 'login' | 'signup';
  prefillEmail?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onInfo?: (info: string) => void; // Para mensajes informativos
}

export default function EmailAuthForm({ 
  mode, 
  prefillEmail = '', 
  onSuccess, 
  onError,
  onInfo
}: EmailAuthFormProps) {
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [actualMode, setActualMode] = useState(mode);
  const [showModeSwitch, setShowModeSwitch] = useState(false);
  const [passwordWasSet, setPasswordWasSet] = useState(false);
  
  // Memorizar el cliente de Supabase para evitar múltiples instancias
  const supabase = useMemo(() => createClient(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Starting form submission...');
    console.log('📧 Email:', email);
    console.log('🔐 Password length:', password.length);
    console.log('📝 Mode:', actualMode);
    
    if (actualMode === 'signup' && password !== confirmPassword) {
      onError?.('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      onError?.('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Limpiar mensajes previos
    onError?.('');
    onInfo?.('');
    
    console.log('✅ All validations passed, starting authentication...');
    setLoading(true);

    try {
      if (actualMode === 'signup') {
        console.log('🔄 Attempting signup for:', email);
        
        // Usar nuestra API personalizada para signup con confirmación automática
        const response = await fetch('/api/auth/signup-direct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            name: email.split('@')[0] // Usar parte del email como nombre por defecto
          }),
        });

        const responseData = await response.json();
        
        console.log('📝 Signup response status:', response.status);
        console.log('📝 Signup response data:', responseData);
        
        if (!response.ok) {
          console.error('❌ Signup error from API:', responseData.error);
          
          if (response.status === 409) {
            console.log('📧 Email already registered, suggesting login');
            setShowModeSwitch(true);
            onError?.('Este email ya está registrado. Intenta iniciar sesión.');
          } else {
            onError?.(responseData.error || 'Error en el registro');
          }
        } else {
          console.log('✅ Signup successful via API!');
          console.log('  - User ID:', responseData.user?.id);
          console.log('  - User email:', responseData.user?.email);
          
          // Ahora hacer login en client-side para establecer la sesión en el browser
          console.log('🔄 Now signing in with client-side to establish browser session...');
          
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (signInError) {
            console.error('❌ Client-side login error after signup:', signInError);
            onError?.('Usuario creado pero error iniciando sesión. Ve al login.');
          } else {
            console.log('✅ Client-side login successful after signup:', signInData);
            
            // Limpiar el formulario después de un registro exitoso
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            
            // Llamar onSuccess ahora que el usuario tiene sesión en el browser
            console.log('✅ Calling onSuccess - user now has browser session');
            onSuccess?.();
          }
        }
      } else {
        // Login
        console.log('🔄 Attempting login for:', email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        console.log('🔑 Login response data:', data);
        console.log('🔑 Login response error:', error);
        
        if (error) {
          console.error('❌ Login error:', error);
          
          if (error.message.includes('Invalid login credentials')) {
            onError?.('Email o contraseña incorrectos');
          } else if (error.message.includes('Email not confirmed')) {
            onError?.('Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.');
          } else {
            onError?.(error.message);
          }
        } else {
          console.log('✅ Login successful:', data);
          onSuccess?.();
        }
      }
    } catch (error) {
      console.error('❌ Unexpected auth error:', error);
      onError?.('Error inesperado. Inténtalo de nuevo.');
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  };

  const switchMode = () => {
    setActualMode(actualMode === 'signup' ? 'login' : 'signup');
    setShowModeSwitch(false);
    onError?.(''); // Limpiar errores
    onInfo?.(''); // Limpiar mensajes informativos
  };

  return (
    <div className="space-y-4">
      {/* Switch de modo cuando es necesario */}
      {showModeSwitch && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
          <p className="text-yellow-800 mb-2">
            Este email ya tiene una cuenta. 
          </p>
          <button
            type="button"
            onClick={switchMode}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {actualMode === 'signup' ? 'Cambiar a iniciar sesión' : 'Cambiar a crear cuenta'}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="tu@email.com"
            required
            disabled={loading}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              // Limpiar mensajes al cambiar contraseña
              if (e.target.value !== '') {
                onInfo?.('');
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="••••••••"
            required
            minLength={6}
            disabled={loading}
          />
          {actualMode === 'signup' && (
            <p className="text-xs text-gray-500 mt-1">
              Mínimo 6 caracteres
            </p>
          )}
        </div>

        {actualMode === 'signup' && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              required
              minLength={6}
              disabled={loading}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !email.trim() || !password.trim() || (actualMode === 'signup' && !confirmPassword.trim())}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              {actualMode === 'signup' ? 'Creando cuenta...' : 'Iniciando sesión...'}
            </div>
          ) : (
            actualMode === 'signup' ? 'Crear mi cuenta' : 'Iniciar sesión'
          )}
        </button>
      </form>
    </div>
  );
} 