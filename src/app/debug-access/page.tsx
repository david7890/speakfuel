'use client';

import { useState } from 'react';

export default function DebugAccess() {
  const [email, setEmail] = useState('davidcoarg@gmail.com');
  const [loading, setLoading] = useState(false);
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostic = async () => {
    setLoading(true);
    setError(null);
    setDiagnostics(null);

    try {
      const response = await fetch('/api/debug/check-user-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          secret: 'debug-secret-123'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error en la petición');
        return;
      }

      setDiagnostics(data.diagnostics);
    } catch (err: any) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const grantAccess = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/grant-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          secret: 'debug-secret-123'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Error otorgando acceso');
        return;
      }

      alert('✅ Acceso otorgado correctamente');
      // Ejecutar diagnóstico de nuevo para verificar
      await runDiagnostic();
    } catch (err: any) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔧 Debug de Acceso de Usuario</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuración</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email del usuario:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="usuario@ejemplo.com"
              />
            </div>
            <button
              onClick={runDiagnostic}
              disabled={loading || !email}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Diagnosticando...' : 'Diagnosticar'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">❌ {error}</p>
          </div>
        )}

        {diagnostics && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">📊 Resultados del Diagnóstico</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold">👤 Usuario en auth.users</h3>
                <p className={diagnostics.auth_user_exists ? 'text-green-600' : 'text-red-600'}>
                  {diagnostics.auth_user_exists ? '✅ Existe' : '❌ No existe'}
                </p>
                {diagnostics.auth_user_id && (
                  <p className="text-sm text-gray-600">ID: {diagnostics.auth_user_id}</p>
                )}
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold">📝 Perfil en user_profiles</h3>
                <p className={diagnostics.profile_exists ? 'text-green-600' : 'text-red-600'}>
                  {diagnostics.profile_exists ? '✅ Existe' : '❌ No existe'}
                </p>
                {diagnostics.profile_exists && diagnostics.profile_data && (
                  <div className="text-sm text-gray-600 mt-2">
                    <p>Acceso pagado: <span className={diagnostics.profile_data.has_paid_access ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {diagnostics.profile_data.has_paid_access ? '✅ SÍ' : '❌ NO'}
                    </span></p>
                    <p>Fecha de compra: {diagnostics.profile_data.purchase_date || 'No registrada'}</p>
                    <p>Email de compra: {diagnostics.profile_data.purchase_email || 'No registrado'}</p>
                  </div>
                )}
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold">🔐 Función check_user_paid_access</h3>
                {diagnostics.check_access_result && (
                  <div>
                    <p className={diagnostics.check_access_result.has_access ? 'text-green-600' : 'text-red-600'}>
                      Tiene acceso: {diagnostics.check_access_result.has_access ? '✅ SÍ' : '❌ NO'}
                    </p>
                    {!diagnostics.check_access_result.has_access && (
                      <div className="text-sm text-gray-600 mt-1">
                        <p>Error: {diagnostics.check_access_result.error}</p>
                        <p>Mensaje: {diagnostics.check_access_result.message}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold">📊 Estadísticas</h3>
                <p className="text-sm text-gray-600">
                  Total usuarios con acceso pagado: {diagnostics.total_paid_users || 0}
                </p>
                <p className="text-sm text-gray-600">
                  Otros perfiles con este email: {diagnostics.other_profiles?.length || 0}
                </p>
              </div>
            </div>

            {diagnostics.check_access_result && !diagnostics.check_access_result.has_access && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">🔧 Corrección Automática</h3>
                <p className="text-sm text-yellow-700 mb-3">
                  El usuario no tiene acceso pagado. Puedes otorgarlo automáticamente:
                </p>
                <button
                  onClick={grantAccess}
                  disabled={loading}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400"
                >
                  {loading ? 'Otorgando...' : '💰 Otorgar Acceso Pagado'}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-2">ℹ️ Información</h3>
          <p className="text-sm text-gray-600">
            Esta herramienta te permite diagnosticar problemas de acceso y corregirlos. 
            Usa el email con el que probaste el acceso anteriormente.
          </p>
        </div>
      </div>
    </div>
  );
} 