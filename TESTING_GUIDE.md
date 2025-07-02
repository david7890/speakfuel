# 🧪 GUÍA DE TESTING - SpeakFuel

## 📧 Estrategia 1: Emails de Prueba (Más Simple)

### Usa variaciones del mismo email:
```
tu@email.com          ← Ya usado
tu+test1@email.com     ← Nuevo test
tu+test2@email.com     ← Otro test 
tu+checkout@email.com  ← Específico para checkout
tu+acceso@email.com    ← Específico para acceso
```

**Ventaja:** Gmail/Outlook ignoran el `+texto` pero Supabase los trata como emails diferentes.

---

## 📮 Estrategia 2: Emails Temporales

### Servicios de email temporal:
- https://10minutemail.com
- https://temp-mail.org  
- https://guerrillamail.com

**Ventaja:** Emails reales que se autodestruyen, no afectan tu inbox principal.

---

## 🔧 Estrategia 3: Reset de Acceso (RECOMENDADA)

### Herramienta Web:
1. Ve a: `http://localhost:3000/debug-reset`
2. Introduce tu email
3. **IMPORTANTE:** Haz clic en "🔍 Verificar Estado" primero
4. Si muestra `has_paid_access: true`, haz clic en "🔄 Resetear Acceso"
5. Verifica de nuevo para confirmar que cambió a `false`
6. Ahora puedes probar el flujo de checkout de nuevo

### Herramienta API (alternativa):
```bash
curl -X POST http://localhost:3000/api/debug/reset-user \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.com","secret":"debug_reset_2024"}'
```

### ✅ Ventajas del método de reset:
- **Preserva el usuario:** No elimina la cuenta de email
- **Resetea acceso:** Pone `has_paid_access = false`
- **Limpia progreso:** Elimina progreso de lecciones y actividad  
- **Seguro:** No hay riesgo de perder datos importantes

### 🔍 Lo que hace exactamente:
```sql
-- Resetea campos de acceso pagado
UPDATE user_profiles SET 
  has_paid_access = false,
  purchase_date = null,
  purchase_email = null
WHERE id = user_id;

-- Limpia progreso de lecciones
DELETE FROM user_lesson_progress WHERE user_id = user_id;

-- Limpia actividad diaria  
DELETE FROM user_daily_activity WHERE user_id = user_id;
```

### 🚨 Si el reset no funciona:

1. **Usa "🔍 Verificar Estado"** para ver exactamente qué está pasando
2. **Revisa los logs** en la consola del servidor
3. **Compara antes y después** del reset:
   - `has_paid_access` debe cambiar de `true` a `false`
   - `function_result.has_access` debe ser `false`

### 📊 API de verificación directa:
```bash
curl -X POST http://localhost:3000/api/debug/check-user-state \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.com","secret":"debug_reset_2024"}'
```

---

## 💳 Estrategia 4: Verificar Modo Testing

### CRÍTICO: Asegúrate de usar Stripe en modo TEST

En tu archivo `.env.local`, verifica:
```env
# ✅ CORRECTO (modo test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51XXXXXX
STRIPE_SECRET_KEY=sk_test_51XXXXXX

# ❌ PELIGROSO (modo producción - cobros reales)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51XXXXXX
STRIPE_SECRET_KEY=sk_live_51XXXXXX
```

### Tarjetas de prueba de Stripe:
```
Éxito: 4242 4242 4242 4242
Falla: 4000 0000 0000 0002
CVV: 123
Fecha: cualquier fecha futura
```

---

## 🌍 Estrategia 5: Entorno Separado

### Opción A: Base de datos de testing
1. Crea proyecto Supabase separado para testing
2. Cambia las URLs en `.env.local`
3. Prueba sin afectar datos reales

### Opción B: Branch de testing  
```bash
git checkout -b testing-flow
# Modifica configuración para testing
# Haz todas las pruebas necesarias
git checkout main
```

---

## 🚀 FLUJO DE TESTING RECOMENDADO

### Para Testing Completo:

1. **ANTES DE EMPEZAR:**
   ```bash
   # Verificar que estás en modo development
   echo $NODE_ENV  # debe mostrar "development"
   ```

2. **RESETEAR ACCESO:**
   - Ve a `http://localhost:3000/debug-reset`
   - Introduce tu email de prueba
   - Haz clic en "🔍 Verificar Estado" (ver estado actual)
   - Si tiene `has_paid_access: true`, haz clic en "🔄 Resetear Acceso"
   - Verifica de nuevo para confirmar el cambio

3. **PROBAR CHECKOUT:**
   - Ve a `http://localhost:3000/checkout`
   - Usa email de prueba
   - Usa tarjeta de Stripe test: `4242 4242 4242 4242`
   - Verifica que llega magic link

4. **PROBAR MAGIC LINK:**
   - Haz clic en el enlace del email
   - Verifica redirección a `/dashboard`
   - Verifica sesión de 30 días

5. **PROBAR ACCESO EXISTENTE:**
   - Ve a `http://localhost:3000/acceso`  
   - Usa el mismo email
   - Verifica que detecta acceso pagado

6. **PROBAR CHECKOUT CON USUARIO EXISTENTE:**
   - Ve a `http://localhost:3000/checkout`
   - Usa el mismo email  
   - Verifica redirección a `/acceso`

### Para Testing Rápido:

1. **Usar email+variaciones:**
   ```
   tu+test1@email.com  ← Primera prueba
   tu+test2@email.com  ← Segunda prueba
   tu+test3@email.com  ← Tercera prueba
   ```

2. **Usar emails temporales**
3. **Verificar logs en consola del navegador**

---

## 🔍 DEBUG Y MONITOREO

### Logs importantes a verificar:

**En la consola del navegador:**
```
🛒 Checkout request for: email (Remember: Yes)
💾 Using default 30-day session duration  
✅ Authentication successful via token hash!
🔐 Session active for user xxx, expires in 59min
```

**En la terminal del servidor:**
```
🎉 Processing successful payment for session: xxx
📧 Customer email: xxx
🔒 Session preferences: Remember=true, Duration=30days
📨 Sending magic link with session preferences...
```

### Verificar en Stripe Dashboard:
1. Ve a https://dashboard.stripe.com/test/payments
2. Verifica que los pagos aparecen como "Test"
3. Revisa metadata de las sesiones

---

## ⚠️ IMPORTANTE PARA PRODUCCIÓN

### NUNCA hagas en producción:
- ❌ Usar endpoint `/api/debug/reset-user`  
- ❌ Usar página `/debug-reset`
- ❌ Resetear acceso de clientes reales
- ❌ Probar con emails de clientes reales

### Estas herramientas:
- ✅ Solo funcionan con `NODE_ENV=development`
- ✅ Están protegidas con secret
- ✅ No afectan producción

---

## 🎯 CASOS DE USO POR ESTRATEGIA

| Situación | Estrategia Recomendada |
|-----------|----------------------|
| Testing una vez | Email+variaciones |
| Testing múltiple | Reset de acceso |
| Testing de equipo | Emails temporales |
| Testing automatizado | Base de datos separada |
| Testing de performance | Entorno completo separado | 