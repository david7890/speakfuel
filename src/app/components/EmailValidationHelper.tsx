'use client';

import { useState, useEffect } from 'react';

interface EmailValidationHelperProps {
  email: string;
  onEmailChange: (email: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

interface EmailSuggestion {
  suggestion: string;
  reason: string;
}

export default function EmailValidationHelper({ 
  email, 
  onEmailChange, 
  onValidationChange 
}: EmailValidationHelperProps) {
  const [suggestion, setSuggestion] = useState<EmailSuggestion | null>(null);
  const [isValid, setIsValid] = useState(true);

  // Dominios comunes y sus typos frecuentes
  const commonDomains = {
    'gmail.com': ['gmai.com', 'gmial.com', 'gmil.com', 'gmail.co', 'gmal.com'],
    'yahoo.com': ['yaho.com', 'yahoo.co', 'yhoo.com'],
    'hotmail.com': ['hotmai.com', 'hotmal.com', 'hotmial.com', 'hotmil.com'],
    'outlook.com': ['outlook.co', 'outlok.com', 'otlook.com'],
    'icloud.com': ['iclou.com', 'icloud.co', 'icoud.com']
  };

  const validateEmail = (emailToValidate: string) => {
    // Validación básica de formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const basicValid = emailRegex.test(emailToValidate);

    if (!basicValid) {
      setIsValid(false);
      onValidationChange(false);
      setSuggestion(null);
      return;
    }

    const domain = emailToValidate.split('@')[1]?.toLowerCase();
    
    if (!domain) {
      setIsValid(false);
      onValidationChange(false);
      return;
    }

    // Buscar typos en dominios comunes
    for (const [correctDomain, typos] of Object.entries(commonDomains)) {
      if (typos.includes(domain)) {
        const correctedEmail = emailToValidate.replace(domain, correctDomain);
        setSuggestion({
          suggestion: correctedEmail,
          reason: `¿Quisiste decir "${correctDomain}"?`
        });
        setIsValid(false);
        onValidationChange(false);
        return;
      }
    }

    // Validaciones adicionales
    if (domain.includes('..') || domain.startsWith('.') || domain.endsWith('.')) {
      setSuggestion({
        suggestion: emailToValidate.replace(/\.+/g, '.').replace(/^\./, '').replace(/\.$/, ''),
        reason: 'Puntos consecutivos detectados'
      });
      setIsValid(false);
      onValidationChange(false);
      return;
    }

    // Email válido
    setIsValid(true);
    onValidationChange(true);
    setSuggestion(null);
  };

  useEffect(() => {
    if (email) {
      validateEmail(email);
    }
  }, [email]);

  const acceptSuggestion = () => {
    if (suggestion) {
      onEmailChange(suggestion.suggestion);
      setSuggestion(null);
    }
  };

  return (
    <div className="space-y-2">
      {/* Indicador de validación */}
      <div className="flex items-center space-x-2">
        {email && (
          <div className={`w-3 h-3 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
        )}
        <span className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
          {email && (isValid ? 'Email válido' : 'Email necesita revisión')}
        </span>
      </div>

      {/* Sugerencia de corrección */}
      {suggestion && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="text-yellow-600 mt-0.5">⚠️</div>
            <div className="flex-1">
              <p className="text-sm text-yellow-800">
                {suggestion.reason}
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <code className="bg-yellow-100 px-2 py-1 rounded text-sm text-yellow-900">
                  {suggestion.suggestion}
                </code>
                <button
                  onClick={acceptSuggestion}
                  className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                >
                  Usar esta dirección
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consejos adicionales */}
      {!isValid && !suggestion && email && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="text-blue-600 mt-0.5">💡</div>
            <div className="flex-1">
              <p className="text-sm text-blue-800">
                Consejos para un email válido:
              </p>
              <ul className="text-xs text-blue-700 mt-1 space-y-1">
                <li>• Verifica que no falten letras en el dominio</li>
                <li>• Asegúrate de incluir el @ y un dominio válido</li>
                <li>• Revisa que no haya espacios o caracteres especiales</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 