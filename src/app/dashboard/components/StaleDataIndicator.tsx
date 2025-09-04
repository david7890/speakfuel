'use client';

interface StaleDataIndicatorProps {
  isStale: boolean;
  onRefresh: () => void;
}

export default function StaleDataIndicator({ isStale, onRefresh }: StaleDataIndicatorProps) {
  if (!isStale) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-amber-800">
            Datos sin actualizar
          </span>
        </div>
        <button
          onClick={onRefresh}
          className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded-md transition-colors font-medium"
        >
          🔄 Actualizar
        </button>
      </div>
      <p className="text-xs text-amber-700 mt-1">
        Tus datos pueden no estar completamente actualizados. Haz clic en "Actualizar" para obtener la información más reciente.
      </p>
    </div>
  );
}
