# 📧 Emails para Testing - SpeakFuel

## Gmail Aliases (Recomendado)
Si tienes Gmail `tu-email@gmail.com`, puedes usar:

```
tu-email+test1@gmail.com
tu-email+test2@gmail.com  
tu-email+test3@gmail.com
tu-email+usuario1@gmail.com
tu-email+usuario2@gmail.com
tu-email+compra1@gmail.com
tu-email+compra2@gmail.com
tu-email+dev1@gmail.com
tu-email+dev2@gmail.com
tu-email+cliente1@gmail.com
```

## Emails Temporales
- **10minutemail.com** - 10 minutos, perfecto para testing rápido
- **guerrillamail.com** - Temporal indefinido
- **tempmail.org** - Múltiples dominios disponibles
- **mailinator.com** - Email público, no privado pero útil para testing

## Testing sin Email Real
Usa `/debug-testing` para simular todo el flujo:

1. Ve a `http://localhost:3000/debug-testing`
2. Haz clic en "Simular Pago"
3. Usa Google OAuth o Email/Password
4. ¡Listo para probar!

## Emails de Desarrollo Sugeridos

Si quieres crear emails reales para desarrollo:

```
speakfuel.test1@gmail.com
speakfuel.test2@gmail.com
speakfuel.dev1@gmail.com
speakfuel.dev2@gmail.com
pruebas.speakfuel1@gmail.com
pruebas.speakfuel2@gmail.com
```

## Debug APIs Disponibles

### Otorgar acceso a cualquier email:
```bash
curl -X POST http://localhost:3000/api/debug/grant-test-access \
  -H "Content-Type: application/json" \
  -d '{"email": "cualquier-email@ejemplo.com", "secret": "debug-secret-123"}'
```

### Simular proceso de pago completo:
```bash
curl -X POST http://localhost:3000/api/debug/process-payment \
  -H "Content-Type: application/json" \
  -d '{"email": "cualquier-email@ejemplo.com", "secret": "debug-secret-123"}'
```

## Flujo de Testing Recomendado

1. **Primera vez**: Usa un alias de Gmail o email temporal
2. **Testing repetido**: Usa `/debug-testing` 
3. **Reset de usuario**: Usa `/debug-reset` para limpiar acceso
4. **Testing masivo**: Usa los APIs de debug con diferentes emails

## Notas Importantes

- ✅ Los aliases de Gmail (+test1, +test2) todos llegan a tu bandeja principal
- ✅ Los emails temporales son perfectos para testing único
- ✅ `/debug-testing` es la forma más rápida de probar sin emails reales
- ⚠️ No uses emails reales de clientes para testing
- ⚠️ Los emails temporales pueden expirar, úsalos solo para testing inmediato 