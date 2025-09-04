# 🗂️ Entity Relationship Diagram - SpeakFuel Database

## 📊 Diagrama Principal

```mermaid
erDiagram
    AUTH_USERS {
        uuid id PK
        varchar email UK
        timestamp email_confirmed_at
        jsonb raw_user_meta_data
        timestamp created_at
        timestamp updated_at
    }
    
    USER_PROFILES {
        uuid id PK, FK
        varchar name
        integer current_streak
        integer longest_streak
        date last_activity_date
        boolean has_paid_access
        timestamp purchase_date
        varchar purchase_email
        timestamp created_at
        timestamp updated_at
    }
    
    USER_LESSON_PROGRESS {
        uuid id PK
        uuid user_id FK
        integer lesson_id
        lesson_status status
        integer repetitions_completed
        boolean questions_completed
        timestamp first_completed_at
        timestamp last_completed_at
        timestamp created_at
        timestamp updated_at
    }
    
    USER_DAILY_ACTIVITY {
        uuid id PK
        uuid user_id FK
        date activity_date
        integer lessons_completed
        integer questions_answered
        boolean has_activity
        timestamp created_at
    }
    
    AUTH_USERS ||--|| USER_PROFILES : "extends"
    AUTH_USERS ||--o{ USER_LESSON_PROGRESS : "has progress in"
    AUTH_USERS ||--o{ USER_DAILY_ACTIVITY : "has activity"
```

## 🔐 Diagrama de Autenticación y Pagos

```mermaid
graph TB
    subgraph "Supabase Auth"
        AU[auth.users]
        AU --> |email| EMAIL[Email único]
        AU --> |id| UUID[UUID único]
    end
    
    subgraph "Sistema de Pagos"
        UP[user_profiles]
        UP --> |has_paid_access| PAID[Acceso Pagado]
        UP --> |purchase_date| PDATE[Fecha Compra]
        UP --> |purchase_email| PEMAIL[Email Compra]
    end
    
    subgraph "Progreso de Usuario"
        ULP[user_lesson_progress]
        UDA[user_daily_activity]
        
        ULP --> |status| STATUS[locked/available/in_progress/completed]
        ULP --> |repetitions_completed| REPS[Repeticiones]
        UDA --> |activity_date| ADATE[Fecha Actividad]
        UDA --> |lessons_completed| LESSONS[Lecciones del Día]
    end
    
    AU --> |1:1| UP
    AU --> |1:N| ULP
    AU --> |1:N| UDA
    
    style AU fill:#e1f5fe
    style UP fill:#f3e5f5
    style ULP fill:#e8f5e8
    style UDA fill:#fff3e0
```

## 🎯 Estados de Lecciones

```mermaid
stateDiagram-v2
    [*] --> locked : Usuario creado
    locked --> available : Lección anterior completada
    available --> in_progress : Usuario empieza lección
    in_progress --> completed : Completa questions
    completed --> completed : Puede repetir
    
    note right of locked
        Lección bloqueada
        No accesible
    end note
    
    note right of available
        Lección disponible
        Puede comenzar
    end note
    
    note right of in_progress
        Lección iniciada
        En progreso
    end note
    
    note right of completed
        Lección terminada
        Puede repetir
    end note
```

## 💰 Flujo de Sistema de Pagos

```mermaid
sequenceDiagram
    participant U as Usuario
    participant C as /checkout API
    participant S as Stripe
    participant P as /process-payment API
    participant DB as Supabase
    participant E as Email Service
    
            U->>C: POST /api/checkout {email}
        C->>DB: check_user_paid_access(email)
        
        alt Usuario ya tiene acceso
            DB-->>C: {has_access: true}
            C-->>U: Error: Ya tienes acceso
            C->>U: Redirige a /auth/login
    else Usuario nuevo
        DB-->>C: {has_access: false}
        C->>S: Crear sesión checkout
        S-->>C: session_id
        C-->>U: Redirige a Stripe
        
        U->>S: Completa pago
        S->>U: Redirige a /auth/signup?session_id=xxx&email=xxx
        
        U->>P: GET /auth/signup (automático)
        P->>S: Verificar sesión
        S-->>P: customer_email
        
        P->>DB: Crear/encontrar usuario
        P->>DB: grant_paid_access(email)
        P-->>U: Página de signup con opciones auth
        U->>P: Google OAuth o Email/Password
        P-->>U: Acceso inmediato al dashboard
    end
```

## 🔄 Flujo de Progreso de Lecciones

```mermaid
graph TD
    A[Usuario accede a lección] --> B{¿Lección disponible?}
    B -->|No| C[Mostrar bloqueado]
    B -->|Sí| D[Cargar contenido]
    
    D --> E[Usuario completa sección]
    E --> F{¿Es 'questions'?}
    
    F -->|No| G[complete_lesson_section]
    G --> H[Actualizar estado a 'in_progress']
    
    F -->|Sí| I[complete_lesson_section]
    I --> J[Marcar como 'completed']
    I --> K[Incrementar repetitions_completed]
    I --> L[Registrar user_daily_activity]
    I --> M[update_user_streak]
    M --> N[Actualizar current_streak]
    
    N --> O{¿Nueva racha récord?}
    O -->|Sí| P[Actualizar longest_streak]
    O -->|No| Q[Mantener longest_streak]
    
    P --> R[Desbloquear siguiente lección]
    Q --> R
    
    style A fill:#e3f2fd
    style I fill:#e8f5e8
    style M fill:#fff3e0
    style R fill:#f3e5f5
```

## 🏗️ Índices y Constraints

```mermaid
graph LR
    subgraph "user_profiles"
        UP1[id - PRIMARY KEY]
        UP2[has_paid_access - INDEX]
        UP3[purchase_email - INDEX]
        UP4[last_activity_date - INDEX]
    end
    
    subgraph "user_lesson_progress"
        ULP1[id - PRIMARY KEY]
        ULP2[user_id, lesson_id - UNIQUE]
        ULP3[user_id - INDEX]
        ULP4[lesson_id - INDEX]
        ULP5[status - INDEX]
    end
    
    subgraph "user_daily_activity"
        UDA1[id - PRIMARY KEY]
        UDA2[user_id, activity_date - UNIQUE]
        UDA3[user_id, activity_date - INDEX]
    end
    
    style UP2 fill:#ffebee
    style UP3 fill:#ffebee
    style ULP2 fill:#e8f5e8
    style UDA2 fill:#e8f5e8
```

## 📈 Queries de Performance

### **Query Plan: Verificar Acceso Pagado**
```sql
-- Optimizada con índice en purchase_email
EXPLAIN ANALYZE
SELECT au.id, up.has_paid_access 
FROM auth.users au
JOIN user_profiles up ON au.id = up.id
WHERE au.email = 'user@example.com'
  AND up.has_paid_access = true;

-- Index Scan on user_profiles (cost=0.15..8.17)
-- Index Condition: (has_paid_access = true)
```

### **Query Plan: Progreso de Usuario**
```sql
-- Optimizada con índice en user_id
EXPLAIN ANALYZE
SELECT lesson_id, status, repetitions_completed
FROM user_lesson_progress
WHERE user_id = 'user-uuid'
ORDER BY lesson_id;

-- Index Scan on user_lesson_progress (cost=0.15..25.88)
-- Index Condition: (user_id = 'user-uuid')
```

### **Query Plan: Actividad Reciente**
```sql
-- Optimizada con índice compuesto
EXPLAIN ANALYZE
SELECT activity_date, lessons_completed
FROM user_daily_activity
WHERE user_id = 'user-uuid'
  AND activity_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY activity_date DESC;

-- Index Scan on user_daily_activity (cost=0.15..15.45)
-- Index Condition: (user_id = 'user-uuid' AND activity_date >= ...)
```

## 🛡️ Seguridad RLS

```mermaid
graph TB
    subgraph "Row Level Security"
        RLS1[user_profiles: auth.uid() = id]
        RLS2[user_lesson_progress: auth.uid() = user_id]
        RLS3[user_daily_activity: auth.uid() = user_id]
    end
    
    subgraph "Security Functions"
        SF1[SECURITY DEFINER]
        SF2[check_user_paid_access]
        SF3[grant_paid_access]
        SF4[complete_lesson_section]
        SF5[update_user_streak]
    end
    
    RLS1 --> |Protege| PROF[Datos de perfil]
    RLS2 --> |Protege| PROG[Progreso de lecciones]
    RLS3 --> |Protege| ACT[Actividad diaria]
    
    SF1 --> SF2
    SF1 --> SF3
    SF1 --> SF4
    SF1 --> SF5
    
    style RLS1 fill:#ffebee
    style RLS2 fill:#ffebee
    style RLS3 fill:#ffebee
    style SF1 fill:#e8f5e8
```

## 📊 Métricas y Analytics

### **Dashboard de Métricas Sugeridas**

```mermaid
graph TD
    subgraph "Métricas de Negocio"
        M1[Usuarios Registrados Total]
        M2[Usuarios con Acceso Pagado]
        M3[Tasa de Conversión]
        M4[Revenue Total]
        M5[Revenue por Mes]
    end
    
    subgraph "Métricas de Engagement"
        E1[Usuarios Activos Diarios]
        E2[Racha Promedio]
        E3[Lecciones Completadas por Día]
        E4[Usuarios con Racha >7 días]
    end
    
    subgraph "Métricas de Progreso"
        P1[Progreso por Lección]
        P2[Tiempo Promedio por Lección]
        P3[Tasa de Abandono por Lección]
        P4[Repeticiones Promedio]
    end
    
    style M1 fill:#e3f2fd
    style M2 fill:#e3f2fd
    style E1 fill:#e8f5e8
    style E2 fill:#e8f5e8
    style P1 fill:#fff3e0
    style P2 fill:#fff3e0
```

## 🔧 Comandos de Mantenimiento

### **Backup Strategy**
```sql
-- Backup completo diario
pg_dump --host=db.xxx.supabase.co --port=5432 --username=postgres --dbname=postgres --schema=public --data-only --file=backup_$(date +%Y%m%d).sql

-- Backup solo estructura
pg_dump --host=db.xxx.supabase.co --port=5432 --username=postgres --dbname=postgres --schema=public --schema-only --file=schema.sql
```

### **Limpieza de Datos**
```sql
-- Limpiar actividad antigua (>1 año)
DELETE FROM user_daily_activity 
WHERE activity_date < CURRENT_DATE - INTERVAL '1 year';

-- Vacuum para recuperar espacio
VACUUM ANALYZE user_daily_activity;
```

### **Monitoring Queries**
```sql
-- Usuarios activos última semana
SELECT COUNT(DISTINCT user_id) as weekly_active_users
FROM user_daily_activity
WHERE activity_date >= CURRENT_DATE - INTERVAL '7 days';

-- Pagos del mes actual
SELECT COUNT(*), SUM(29) as revenue_usd
FROM user_profiles
WHERE has_paid_access = true
  AND purchase_date >= date_trunc('month', CURRENT_DATE);
``` 