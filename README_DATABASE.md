# 🗃️ Base de Datos SpeakFuel - Guía Rápida

## 📖 Documentación Completa

- **[DATABASE_DOCUMENTATION.md](./DATABASE_DOCUMENTATION.md)** - Documentación completa de esquemas, funciones y flujos
- **[DATABASE_ERD.md](./DATABASE_ERD.md)** - Diagramas ERD, flujos visuales y queries de performance

## ⚡ Configuración Rápida

### **Variables de Entorno Requeridas**
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # 🔑 CRÍTICA para pagos
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### **Migraciones**
```bash
# Aplicar migraciones en orden:
1. supabase/migrations/001_initial_schema.sql      # Esquema base + sistema de rachas
2. supabase/migrations/005_add_paid_access.sql     # Sistema de pagos
```

## 🏗️ Arquitectura en 30 Segundos

```
📊 CORE TABLES
├── auth.users (Supabase Auth)
├── user_profiles (Extiende auth + has_paid_access)
├── user_lesson_progress (Progreso 1-8 lecciones)
└── user_daily_activity (Rachas y actividad)

💰 PAYMENT FLOW
checkout → verify existing access → stripe → process-payment → grant access → magic link

🔐 AUTHENTICATION
magic link → supabase auth → RLS protects data → dashboard access
```

## 🎯 Funciones SQL Clave

| Función | Propósito | Uso |
|---------|-----------|-----|
| `check_user_paid_access(email)` | Verificar acceso pagado | APIs de checkout/acceso |
| `grant_paid_access(email)` | Otorgar acceso post-pago | Procesamiento de pagos |
| `complete_lesson_section(uuid, lesson, section)` | Progreso de lecciones | Dashboard de usuario |
| `update_user_streak(uuid)` | Sistema de rachas | Actividad diaria |

## 🚨 Puntos Críticos de Seguridad

### ✅ **Implementado**
- Row Level Security (RLS) en todas las tablas
- SUPABASE_SERVICE_ROLE_KEY para operaciones admin
- Funciones con SECURITY DEFINER
- Prevención de pagos duplicados

### ⚠️ **Para Producción**
- Rotar claves regularmente
- Monitoreo de transacciones fallidas
- Backup automático diario
- Rate limiting en APIs

## 📊 Métricas Importantes

### **Queries de Monitoreo Rápido**
```sql
-- Usuarios con acceso pagado
SELECT COUNT(*) FROM user_profiles WHERE has_paid_access = true;

-- Revenue del mes
SELECT COUNT(*) * 29 as revenue_usd FROM user_profiles 
WHERE has_paid_access = true 
AND purchase_date >= date_trunc('month', CURRENT_DATE);

-- Usuarios activos (última semana)
SELECT COUNT(DISTINCT user_id) FROM user_daily_activity 
WHERE activity_date >= CURRENT_DATE - INTERVAL '7 days';
```

## 🔧 Testing y Debug

### **APIs de Debug**
- `GET /api/debug/check-config` - Verificar configuración completa
- `GET /api/debug/test-payment-flow` - Simular flujo de pago completo

### **Testing con Stripe**
```javascript
// Tarjetas de prueba
4242424242424242  // Visa exitosa
4000000000000002  // Tarjeta declinada
4000000000009995  // Fondos insuficientes
```

## 🆕 Cambios Recientes (v2.0)

### **Sistema de Pagos Agregado**
- ✅ Campo `has_paid_access` en user_profiles
- ✅ Verificación previa en checkout (evita pagos duplicados)
- ✅ Procesamiento automático post-Stripe
- ✅ Magic Link automático con acceso inmediato

### **Flujo Sin Webhooks**
- ✅ Procesamiento directo en página `/gracias`
- ✅ Manejo robusto de errores
- ✅ Logs detallados para debugging

### **Seguridad Mejorada**
- ✅ Cliente administrativo separado (`createAdminClient`)
- ✅ Validaciones de email mejoradas
- ✅ Manejo de usuarios existentes optimizado

## 🎯 Próximos Pasos Sugeridos

### **Inmediato (Lanzamiento)**
1. **Monitoreo** - Configurar Sentry/LogRocket
2. **Backups** - Estrategia automatizada
3. **Analytics** - Dashboard básico de métricas

### **Corto Plazo (1-2 meses)**
4. **Admin Panel** - Interface para gestionar usuarios
5. **Email Templates** - Diseños profesionales
6. **Refunds** - Proceso automatizado

### **Largo Plazo (3+ meses)**
7. **Multi-currency** - Soporte internacional
8. **A/B Testing** - Optimización de conversión
9. **Advanced Analytics** - Insights profundos

## 🆘 Troubleshooting Común

### **"User creation failed"**
- ✅ Verificar `SUPABASE_SERVICE_ROLE_KEY` en `.env.local`
- ✅ Comprobar que todas las migraciones estén aplicadas

### **"No recibo Magic Link"**
- ✅ Revisar logs del servidor (`npm run dev`)
- ✅ Verificar que `NEXT_PUBLIC_SITE_URL` sea correcto
- ✅ Comprobar spam en email

### **"Ya tienes acceso" pero no puedo entrar**
- ✅ Verificar que el email sea exactamente el mismo
- ✅ Usar `/acceso` en lugar de intentar pagar de nuevo

---

## 📞 Soporte

Para dudas específicas:
1. **Revisar logs** en consola del servidor
2. **Usar APIs de debug** para diagnóstico
3. **Consultar documentación completa** en los archivos referenciados arriba

**¡Tu base de datos está lista para producción! 🚀** 