# 📊 Documentación Base de Datos - SpeakFuel

## 🏗️ Arquitectura General

**Base de Datos:** PostgreSQL (Supabase)  
**Autenticación:** Supabase Auth  
**ORM:** Funciones SQL nativas  
**Migraciones:** `supabase/migrations/`

---

## 📋 Esquema de Tablas

### 🔐 **auth.users** (Supabase Auth - Sistema)
Tabla gestionada por Supabase para autenticación.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Primary key único del usuario |
| `email` | VARCHAR | Email único del usuario |
| `email_confirmed_at` | TIMESTAMP | Fecha de confirmación de email |
| `raw_user_meta_data` | JSONB | Metadata adicional del usuario |

---

### 👤 **user_profiles** (Perfiles Extendidos)
Extiende `auth.users` con información específica de la aplicación.

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `id` | UUID | - | FK a `auth.users(id)` |
| `name` | VARCHAR(100) | - | Nombre del usuario |
| `current_streak` | INTEGER | 0 | Racha actual de días consecutivos |
| `longest_streak` | INTEGER | 0 | Racha más larga alcanzada |
| `last_activity_date` | DATE | NULL | Última fecha de actividad |
| `has_paid_access` | BOOLEAN | false | **🆕** Indica si tiene acceso pagado |
| `purchase_date` | TIMESTAMP | NULL | **🆕** Fecha de compra |
| `purchase_email` | VARCHAR(255) | NULL | **🆕** Email usado en la compra |
| `created_at` | TIMESTAMP | NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | NOW() | Última actualización |

**Índices:**
- `idx_user_profiles_has_paid_access`
- `idx_user_profiles_purchase_email`
- `idx_user_profiles_last_activity`

---

### 📚 **user_lesson_progress** (Progreso de Lecciones)
Rastrea el progreso individual de cada usuario en las lecciones.

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `id` | UUID | gen_random_uuid() | Primary key |
| `user_id` | UUID | - | FK a `auth.users(id)` |
| `lesson_id` | INTEGER | - | ID de la lección (1-8) |
| `status` | lesson_status | 'locked' | Estado de la lección |
| `repetitions_completed` | INTEGER | 0 | Número de repeticiones completadas |
| `questions_completed` | BOOLEAN | false | Si completó las preguntas |
| `first_completed_at` | TIMESTAMP | NULL | Primera vez completada |
| `last_completed_at` | TIMESTAMP | NULL | Última vez completada |
| `created_at` | TIMESTAMP | NOW() | Fecha de creación |
| `updated_at` | TIMESTAMP | NOW() | Última actualización |

**Constraints:**
- `UNIQUE(user_id, lesson_id)` - Un registro por usuario/lección

**Índices:**
- `idx_user_lesson_progress_user_id`
- `idx_user_lesson_progress_lesson_id`
- `idx_user_lesson_progress_status`

---

### 📅 **user_daily_activity** (Actividad Diaria)
Registra la actividad diaria para el sistema de rachas.

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `id` | UUID | gen_random_uuid() | Primary key |
| `user_id` | UUID | - | FK a `auth.users(id)` |
| `activity_date` | DATE | - | Fecha de la actividad |
| `lessons_completed` | INTEGER | 0 | Lecciones completadas ese día |
| `questions_answered` | INTEGER | 0 | Preguntas respondidas |
| `has_activity` | BOOLEAN | true | Si hubo actividad |
| `created_at` | TIMESTAMP | NOW() | Fecha de creación |

**Constraints:**
- `UNIQUE(user_id, activity_date)` - Un registro por usuario/día

**Índices:**
- `idx_user_daily_activity_user_date`

---

## 🎯 Tipos Personalizados

### **lesson_status** (ENUM)
Define los estados posibles de una lección:

- `'locked'` - Bloqueada, no accesible
- `'available'` - Disponible para comenzar
- `'in_progress'` - En progreso
- `'completed'` - Completada

---

## ⚙️ Funciones SQL

### 🔥 **Sistema de Rachas**

#### `update_user_streak(user_uuid UUID) → INTEGER`
Actualiza la racha de actividad del usuario.

**Lógica:**
- Si es primera actividad → `current_streak = 1`
- Si actividad fue ayer → `current_streak += 1`
- Si actividad fue hoy → No cambiar
- Si hace más de 1 día → `current_streak = 1`
- Actualiza `longest_streak` si es necesario

**Retorna:** Nueva racha actual

---

#### `complete_lesson_section(user_uuid UUID, lesson_number INTEGER, section_name TEXT) → JSONB`
Procesa la finalización de una sección de lección.

**Parámetros:**
- `user_uuid`: ID del usuario
- `lesson_number`: Número de lección (1-8)
- `section_name`: Nombre de la sección

**Lógica:**
- Si `section_name = 'questions'`:
  - ✅ Marca lección como completada
  - ✅ Incrementa repeticiones
  - ✅ Registra actividad diaria
  - ✅ Actualiza racha
- Si otra sección:
  - ✅ Solo actualiza estado a 'in_progress'

**Retorna:** JSONB con resultado y nueva racha

---

### 💰 **Sistema de Pagos**

#### `check_user_paid_access(user_email TEXT) → JSONB`
**🆕** Verifica si un usuario tiene acceso pagado.

**Casos:**
- **Usuario no encontrado:**
  ```json
  {
    "has_access": false,
    "error": "user_not_found",
    "message": "No encontramos una cuenta con este correo."
  }
  ```

- **Sin acceso pagado:**
  ```json
  {
    "has_access": false,
    "error": "no_paid_access", 
    "message": "Esta cuenta no tiene acceso pagado al curso."
  }
  ```

- **Con acceso pagado:**
  ```json
  {
    "has_access": true,
    "user_id": "uuid",
    "name": "Nombre Usuario",
    "purchase_date": "2024-01-01T10:00:00Z"
  }
  ```

---

#### `grant_paid_access(user_email TEXT) → JSONB`
**🆕** Otorga acceso pagado a un usuario (uso administrativo).

**Parámetros:**
- `user_email`: Email del usuario

**Acciones:**
- ✅ Busca usuario por email
- ✅ Actualiza `has_paid_access = true`
- ✅ Establece `purchase_date = NOW()`
- ✅ Guarda `purchase_email`

**Retorna:**
- ✅ Éxito: `{"success": true, "message": "..."}`
- ❌ Error: `{"success": false, "error": "user_not_found", "message": "..."}`

---

## 🔄 Triggers

### **handle_new_user()**
Se ejecuta automáticamente al crear un usuario en `auth.users`.

**Acciones:**
1. ✅ Crea perfil en `user_profiles`
2. ✅ Usa `name` del metadata o email como nombre
3. ✅ Desbloquea la primera lección automáticamente

### **update_updated_at_column()**
Actualiza automáticamente `updated_at` en:
- `user_profiles`
- `user_lesson_progress`

---

## 🔐 Flujo de Autenticación

### **1. Registro de Usuario**
```sql
-- Supabase Auth crea usuario en auth.users
-- Trigger handle_new_user() ejecuta:
INSERT INTO user_profiles (id, name) VALUES (NEW.id, ...);
INSERT INTO user_lesson_progress (user_id, lesson_id, status) VALUES (NEW.id, 1, 'available');
```

### **2. Google OAuth + Email/Password Login**
```sql
-- Supabase Auth maneja automáticamente
-- Soporte para Google OAuth y email/password
-- RLS permite acceso basado en auth.uid()
```

### **3. Verificación de Acceso Pagado**
```sql
SELECT check_user_paid_access('user@email.com');
```

---

## 💳 Flujo de Pagos

### **1. Checkout - Verificación Previa**
```sql
-- API /api/checkout verifica:
SELECT check_user_paid_access(email);
-- Si has_access = true → Rechaza pago duplicado
-- Si has_access = false → Procede con Stripe
```

### **2. Stripe Payment Success**
```sql
-- API /api/process-payment ejecuta:

-- a) Crear/encontrar usuario
supabase.auth.admin.createUser({email, email_confirm: true})

-- b) Otorgar acceso pagado
SELECT grant_paid_access(email);

-- c) Redirigir a /auth/signup con session_id y email
-- Para autenticación inmediata con Google OAuth o email/password
```

### **3. Dashboard Access**
```sql
-- Middleware verifica:
SELECT has_paid_access FROM user_profiles WHERE id = auth.uid();
```

---

## 🛡️ Row Level Security (RLS)

### **user_profiles**
```sql
-- Los usuarios solo pueden ver/editar su propio perfil
auth.uid() = id
```

### **user_lesson_progress**
```sql
-- Los usuarios solo pueden ver/editar su propio progreso
auth.uid() = user_id
```

### **user_daily_activity**
```sql
-- Los usuarios solo pueden ver su propia actividad
auth.uid() = user_id
```

---

## 📊 Flujo de Datos Típico

### **Usuario Completa Lección**
```mermaid
graph TD
    A[Usuario completa questions] --> B[complete_lesson_section()]
    B --> C[Actualizar user_lesson_progress]
    B --> D[Registrar user_daily_activity]
    B --> E[update_user_streak()]
    E --> F[Actualizar current_streak en user_profiles]
    F --> G[Retornar nueva racha]
```

### **Proceso de Pago**
```mermaid
graph TD
    A[Usuario en /checkout] --> B[Verificar acceso existente]
    B -->|Ya tiene acceso| C[Redirigir a /auth/login]
    B -->|No tiene acceso| D[Crear sesión Stripe]
    D --> E[Pago exitoso]
    E --> F[Crear/encontrar usuario en auth]
    F --> G[grant_paid_access()]
    G --> H[Redirigir a /auth/signup]
    H --> I[Google OAuth o Email/Password]
    I --> J[Usuario accede al dashboard]
```

---

## 🔧 Comandos Útiles

### **Ver usuarios con acceso pagado**
```sql
SELECT 
    up.name, 
    au.email, 
    up.has_paid_access, 
    up.purchase_date,
    up.current_streak
FROM auth.users au
JOIN user_profiles up ON au.id = up.id
WHERE up.has_paid_access = true
ORDER BY up.purchase_date DESC;
```

### **Estadísticas de progreso**
```sql
SELECT 
    lesson_id,
    COUNT(*) as total_users,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_users,
    AVG(repetitions_completed) as avg_repetitions
FROM user_lesson_progress
GROUP BY lesson_id
ORDER BY lesson_id;
```

### **Usuarios activos por día**
```sql
SELECT 
    activity_date,
    COUNT(DISTINCT user_id) as active_users,
    SUM(lessons_completed) as total_lessons_completed
FROM user_daily_activity
WHERE activity_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY activity_date
ORDER BY activity_date DESC;
```

---

## 📝 Notas de Desarrollo

### **Cambios Recientes (v2.0)**
- ✅ Agregado sistema de acceso pagado
- ✅ Funciones para verificar y otorgar acceso
- ✅ Prevención de pagos duplicados
- ✅ Integración con Stripe
- ✅ Magic Link automático post-compra

### **Seguridad**
- ✅ RLS habilitado en todas las tablas
- ✅ Funciones con `SECURITY DEFINER`
- ✅ Validación de email en APIs
- ✅ SUPABASE_SERVICE_ROLE_KEY para operaciones admin

### **Performance**
- ✅ Índices en campos de búsqueda frecuente
- ✅ Constraints únicos para evitar duplicados
- ✅ Triggers optimizados para operaciones comunes 