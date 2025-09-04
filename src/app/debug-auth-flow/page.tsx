'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function DebugAuthFlow() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [testEmail, setTestEmail] = useState('');
  
  const supabase = createClient();

  useEffect(() => {
    analyzeAuthState();
  }, []);

  const analyzeAuthState = async () => {
    setLoading(true);
    const info: any = {};
    
    try {
      // 1. Verificar sesión actual
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      info.currentSession = {
        hasSession: !!sessionData.session,
        user: sessionData.session?.user || null,
        error: sessionError?.message || null
      };

      // 2. Verificar usuario actual
      const { data: userData, error: userError } = await supabase.auth.getUser();
      info.currentUser = {
        hasUser: !!userData.user,
        user: userData.user || null,
        error: userError?.message || null
      };

      // 3. Verificar localStorage
      const localStorageKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.includes('supabase') || key?.includes('auth')) {
          localStorageKeys.push({
            key,
            value: localStorage.getItem(key)
          });
        }
      }
      info.localStorage = localStorageKeys;

      // 4. Verificar cookies
      info.cookies = document.cookie;

    } catch (error) {
      info.error = error;
    }
    
    setDebugInfo(info);
    setLoading(false);
  };

  const clearAuthState = async () => {
    try {
      // Limpiar sesión de Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // Limpiar localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.includes('supabase') || key?.includes('auth')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Reanalizar
      await analyzeAuthState();
      
      alert('Estado de autenticación limpiado');
    } catch (error) {
      console.error('Error limpiando estado:', error);
    }
  };

  const testEmailRegistration = async () => {
    if (!testEmail) {
      alert('Ingresa un email para probar');
      return;
    }

    try {
      console.log('🧪 Probando registro con email:', testEmail);
      
      // Primero ver qué pasa con getUser()
      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log('📧 getUser() result:', { userData, userError });
      
      // Luego intentar el signup
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'test123456',
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      console.log('📝 Signup result:', { data, error });
      
      alert(`Resultado del signup:\nData: ${JSON.stringify(data, null, 2)}\nError: ${error?.message || 'Ninguno'}`);
      
    } catch (error) {
      console.error('Error en test:', error);
      alert(`Error: ${error}`);
    }
  };

  const testCompleteFlow = async () => {
    if (!testEmail) {
      alert('Ingresa un email para probar el flujo completo');
      return;
    }

    try {
      console.log('🧪 === INICIANDO TEST COMPLETO DE REGISTRO ===');
      
      // 1. Limpiar estado completamente
      console.log('🧹 Paso 1: Limpiando estado...');
      await supabase.auth.signOut({ scope: 'global' });
      
      // Limpiar localStorage manualmente
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.includes('supabase') || key?.includes('auth')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log('✅ Estado limpiado');
      
      // 2. Verificar que no hay sesión
      console.log('🔍 Paso 2: Verificando ausencia de sesión...');
      const { data: sessionCheck } = await supabase.auth.getSession();
      console.log('📱 Sesión después de limpieza:', sessionCheck.session ? 'ENCONTRADA' : 'AUSENTE');
      
      if (sessionCheck.session) {
        throw new Error('❌ Aún hay una sesión activa después de la limpieza');
      }
      
      // 3. Intentar registro
      console.log('📝 Paso 3: Intentando registro...');
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'test123456',
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      console.log('📊 Resultado del registro:');
      console.log('  - Data:', signupData);
      console.log('  - Error:', signupError);
      
      if (signupError) {
        console.log(`❌ Error en registro: ${signupError.message}`);
        alert(`❌ Error en registro: ${signupError.message}`);
      } else {
        console.log('✅ Registro exitoso!');
        console.log(`  - Usuario creado: ${signupData.user ? 'SÍ' : 'NO'}`);
        console.log(`  - Email: ${signupData.user?.email}`);
        console.log(`  - Sesión creada: ${signupData.session ? 'SÍ' : 'NO'}`);
        console.log(`  - Requiere confirmación: ${signupData.user && !signupData.session ? 'SÍ' : 'NO'}`);
        
        alert(`✅ Registro exitoso!\nUsuario: ${signupData.user?.email}\nSesión: ${signupData.session ? 'Creada' : 'Requiere confirmación por email'}`);
      }
      
      console.log('🧪 === TEST COMPLETO TERMINADO ===');
      
    } catch (error) {
      console.error('❌ Error en test completo:', error);
      alert(`❌ Error en test: ${error}`);
    }
  };

  const checkSupabaseConfig = async () => {
    try {
      console.log('🔍 === VERIFICANDO CONFIGURACIÓN DE SUPABASE ===');
      
      // 1. Verificar variables de entorno del cliente
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      console.log('🌐 Supabase URL:', supabaseUrl ? 'CONFIGURADA' : 'FALTANTE');
      console.log('🔑 Supabase Key:', supabaseKey ? 'CONFIGURADA' : 'FALTANTE');
      
      if (!supabaseUrl || !supabaseKey) {
        alert('❌ Variables de entorno faltantes');
        return;
      }
      
      // 2. Verificar conexión con auth
      console.log('🔗 Verificando conexión con Auth...');
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      console.log('📱 Sesión actual:', session ? 'ENCONTRADA' : 'NINGUNA');
      console.log('❌ Error de sesión:', sessionError ? sessionError.message : 'NINGUNO');
      
      // 3. Verificar configuración de Auth en Supabase
      console.log('⚙️ Verificando settings de Auth...');
      const authSettings = await supabase.auth.getSettings();
      console.log('🛠️ Auth Settings:', authSettings);
      
      // 4. Intentar signup con email falso para ver respuesta
      console.log('🧪 Probando signup con email falso...');
      const testEmail = `test-${Date.now()}@testing-domain-fake.com`;
      const { data: testData, error: testError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'test123456',
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      console.log('📊 Resultado del test signup:');
      console.log('  - Data:', testData);
      console.log('  - Error:', testError);
      
      let result = '✅ CONFIGURACIÓN DE SUPABASE:\n\n';
      result += `URL: ${supabaseUrl ? '✅ OK' : '❌ FALTANTE'}\n`;
      result += `Key: ${supabaseKey ? '✅ OK' : '❌ FALTANTE'}\n`;
      result += `Conexión: ${sessionError ? '❌ ERROR' : '✅ OK'}\n`;
      result += `Test Signup: ${testError ? '❌ ' + testError.message : '✅ OK'}\n`;
      
      if (testData.user) {
        result += `Test User: ✅ Usuario creado (${testData.user.id})\n`;
        result += `Test Session: ${testData.session ? '✅ Sesión creada' : '⚠️ Requiere confirmación'}\n`;
      }
      
      alert(result);
      
      console.log('🔍 === VERIFICACIÓN COMPLETADA ===');
      
    } catch (error) {
      console.error('❌ Error verificando Supabase:', error);
      alert(`❌ Error verificando Supabase: ${error}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Debug - Flujo de Autenticación</h1>
            <div className="space-x-3">
              <button 
                onClick={analyzeAuthState}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                🔄 Reanalizar
              </button>
              <button 
                onClick={clearAuthState}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                🗑️ Limpiar Estado
              </button>
            </div>
          </div>

          {/* Test de email */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3">🧪 Test de Registro</h3>
            <div className="flex space-x-3">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="email@test.com"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={testEmailRegistration}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Probar Registro
              </button>
              <button
                onClick={testCompleteFlow}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                🧪 Test Completo
              </button>
              <button
                onClick={checkSupabaseConfig}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                🔧 Verificar Supabase
              </button>
            </div>
          </div>

          {/* Información de debug */}
          <div className="space-y-6">
            
            {/* Sesión actual */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                📱 Sesión Actual
                <span className={`ml-2 px-2 py-1 text-xs rounded ${debugInfo.currentSession?.hasSession ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {debugInfo.currentSession?.hasSession ? 'ACTIVA' : 'INACTIVA'}
                </span>
              </h3>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(debugInfo.currentSession, null, 2)}
              </pre>
            </div>

            {/* Usuario actual */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                👤 Usuario Actual (getUser)
                <span className={`ml-2 px-2 py-1 text-xs rounded ${debugInfo.currentUser?.hasUser ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {debugInfo.currentUser?.hasUser ? 'PRESENTE' : 'AUSENTE'}
                </span>
              </h3>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(debugInfo.currentUser, null, 2)}
              </pre>
            </div>

            {/* LocalStorage */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">💾 LocalStorage (Auth Keys)</h3>
              {debugInfo.localStorage?.length > 0 ? (
                <div className="space-y-2">
                  {debugInfo.localStorage.map((item: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                      <div className="font-semibold text-gray-700">{item.key}</div>
                      <div className="text-gray-600 mt-1 break-all">{item.value}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No hay claves de autenticación en localStorage</p>
              )}
            </div>

            {/* Cookies */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">🍪 Cookies</h3>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                {debugInfo.cookies || 'No cookies found'}
              </pre>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link 
              href="/auth/register" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Volver a registro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 